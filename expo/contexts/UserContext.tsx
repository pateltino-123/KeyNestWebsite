import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Shoe } from "@/mocks/shoes";
import { generateDealInfo, DealInfo } from "@/mocks/priceData";
import { shoes as allShoes } from "@/mocks/shoes";

export interface FootMeasurements {
  leftLength: number;
  leftWidth: number;
  rightLength: number;
  rightWidth: number;
  archType: "flat" | "neutral" | "high";
  footType: "narrow" | "normal" | "wide";
  recommendedSize: number;
  lastScanned: string;
}

export interface UserPreferences {
  preferredBrands: string[];
  budgetMin: number;
  budgetMax: number;
  stylePreferences: string[];
  activityTypes: string[];
  sizeSystem: "US" | "UK" | "EU";
}

export interface WishlistItem {
  shoeId: string;
  addedAt: string;
  status: "saved" | "purchased" | "didnt_fit";
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface ScanHistory {
  id: string;
  date: string;
  measurements: FootMeasurements;
}

export interface PriceAlert {
  shoeId: string;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
  notificationsSent: number;
}

interface UserState {
  profile: UserProfile | null;
  measurements: FootMeasurements | null;
  preferences: UserPreferences;
  wishlist: WishlistItem[];
  scanHistory: ScanHistory[];
  hasCompletedOnboarding: boolean;
  priceAlerts: PriceAlert[];
}

const defaultPreferences: UserPreferences = {
  preferredBrands: [],
  budgetMin: 0,
  budgetMax: 300,
  stylePreferences: [],
  activityTypes: [],
  sizeSystem: "US",
};

const STORAGE_KEY = "solefit_user_data";

export const [UserProvider, useUser] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<UserState>({
    profile: null,
    measurements: null,
    preferences: defaultPreferences,
    wishlist: [],
    scanHistory: [],
    hasCompletedOnboarding: false,
    priceAlerts: [],
  });

  const userDataQuery = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserState;
      }
      return null;
    },
  });

  useEffect(() => {
    if (userDataQuery.data) {
      setState(userDataQuery.data);
    }
  }, [userDataQuery.data]);

  const { mutate: saveData } = useMutation({
    mutationFn: async (newState: UserState) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });

  const updateState = useCallback((updates: Partial<UserState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      saveData(newState);
      return newState;
    });
  }, [saveData]);

  const setMeasurements = useCallback((measurements: FootMeasurements) => {
    const scanRecord: ScanHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      measurements,
    };
    setState((prev) => {
      const newState = {
        ...prev,
        measurements,
        scanHistory: [scanRecord, ...prev.scanHistory].slice(0, 10),
      };
      saveData(newState);
      return newState;
    });
  }, [saveData]);

  const setPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setState((prev) => {
      const newState = {
        ...prev,
        preferences: { ...prev.preferences, ...preferences },
      };
      saveData(newState);
      return newState;
    });
  }, [saveData]);

  const setProfile = useCallback((profile: UserProfile) => {
    updateState({ profile });
  }, [updateState]);

  const addToWishlist = useCallback((shoeId: string) => {
    setState((prev) => {
      if (prev.wishlist.some((item) => item.shoeId === shoeId)) {
        return prev;
      }
      const newItem: WishlistItem = {
        shoeId,
        addedAt: new Date().toISOString(),
        status: "saved",
      };
      const newState = {
        ...prev,
        wishlist: [newItem, ...prev.wishlist],
      };
      saveData(newState);
      return newState;
    });
  }, [saveData]);

  const removeFromWishlist = useCallback((shoeId: string) => {
    setState((prev) => {
      const newState = {
        ...prev,
        wishlist: prev.wishlist.filter((item) => item.shoeId !== shoeId),
      };
      saveData(newState);
      return newState;
    });
  }, [saveData]);

  const updateWishlistStatus = useCallback((shoeId: string, status: WishlistItem["status"]) => {
    setState((prev) => {
      const newState = {
        ...prev,
        wishlist: prev.wishlist.map((item) =>
          item.shoeId === shoeId ? { ...item, status } : item
        ),
      };
      saveData(newState);
      return newState;
    });
  }, [saveData]);

  const isInWishlist = useCallback((shoeId: string) => {
    return state.wishlist.some((item) => item.shoeId === shoeId);
  }, [state.wishlist]);

  const completeOnboarding = useCallback(() => {
    updateState({ hasCompletedOnboarding: true });
  }, [updateState]);

  const setPriceAlert = useCallback((shoeId: string, targetPrice: number) => {
    setState((prev) => {
      const existing = prev.priceAlerts.findIndex((a) => a.shoeId === shoeId);
      let newAlerts: PriceAlert[];
      if (existing >= 0) {
        newAlerts = prev.priceAlerts.map((a, i) =>
          i === existing ? { ...a, targetPrice, isActive: true } : a
        );
      } else {
        newAlerts = [
          ...prev.priceAlerts,
          { shoeId, targetPrice, isActive: true, createdAt: new Date().toISOString(), notificationsSent: 0 },
        ];
      }
      const newState = { ...prev, priceAlerts: newAlerts };
      saveData(newState);
      return newState;
    });
    console.log("[User] Price alert set for shoe:", shoeId, "target:", targetPrice);
  }, [saveData]);

  const removePriceAlert = useCallback((shoeId: string) => {
    setState((prev) => {
      const newState = {
        ...prev,
        priceAlerts: prev.priceAlerts.filter((a) => a.shoeId !== shoeId),
      };
      saveData(newState);
      return newState;
    });
    console.log("[User] Price alert removed for shoe:", shoeId);
  }, [saveData]);

  const togglePriceAlert = useCallback((shoeId: string) => {
    setState((prev) => {
      const newState = {
        ...prev,
        priceAlerts: prev.priceAlerts.map((a) =>
          a.shoeId === shoeId ? { ...a, isActive: !a.isActive } : a
        ),
      };
      saveData(newState);
      return newState;
    });
  }, [saveData]);

  const getPriceAlert = useCallback((shoeId: string): PriceAlert | undefined => {
    return state.priceAlerts.find((a) => a.shoeId === shoeId);
  }, [state.priceAlerts]);

  return {
    ...state,
    isLoading: userDataQuery.isLoading,
    setMeasurements,
    setPreferences,
    setProfile,
    addToWishlist,
    removeFromWishlist,
    updateWishlistStatus,
    isInWishlist,
    completeOnboarding,
    setPriceAlert,
    removePriceAlert,
    togglePriceAlert,
    getPriceAlert,
  };
});

export function useWishlistedShoes(shoes: Shoe[]) {
  const { wishlist } = useUser();
  return useMemo(() => {
    return wishlist
      .map((item) => ({
        ...item,
        shoe: shoes.find((s) => s.id === item.shoeId),
      }))
      .filter((item) => item.shoe !== undefined);
  }, [wishlist, shoes]);
}

export function useRecommendedShoes(shoes: Shoe[]) {
  const { measurements, preferences } = useUser();
  
  return useMemo(() => {
    if (!measurements) return shoes.slice(0, 6);
    
    return shoes
      .filter((shoe) => {
        if (preferences.budgetMax > 0 && shoe.price > preferences.budgetMax) {
          return false;
        }
        if (preferences.budgetMin > 0 && shoe.price < preferences.budgetMin) {
          return false;
        }
        if (preferences.preferredBrands.length > 0 && 
            !preferences.preferredBrands.includes(shoe.brand)) {
          return false;
        }
        if (preferences.stylePreferences.length > 0 &&
            !preferences.stylePreferences.includes(shoe.category)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;
        
        if (measurements.footType === "wide") {
          if (a.widthFit === "wide") scoreA += 2;
          if (b.widthFit === "wide") scoreB += 2;
          if (a.widthFit === "narrow") scoreA -= 1;
          if (b.widthFit === "narrow") scoreB -= 1;
        } else if (measurements.footType === "narrow") {
          if (a.widthFit === "narrow") scoreA += 1;
          if (b.widthFit === "narrow") scoreB += 1;
        }
        
        if (measurements.archType === "high") {
          if (a.archSupport === "high") scoreA += 2;
          if (b.archSupport === "high") scoreB += 2;
        } else if (measurements.archType === "flat") {
          if (a.archSupport === "high") scoreA += 1;
          if (b.archSupport === "high") scoreB += 1;
        }
        
        scoreA += a.rating * 0.5;
        scoreB += b.rating * 0.5;
        
        return scoreB - scoreA;
      })
      .slice(0, 8);
  }, [shoes, measurements, preferences]);
}
