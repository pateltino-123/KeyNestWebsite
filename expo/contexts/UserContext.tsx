import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Shoe } from "@/mocks/shoes";
import {
  saveSecureMeasurements,
  loadSecureMeasurements,
  saveSecureProfile,
  loadSecureProfile,
  saveNonSensitiveState,
  loadNonSensitiveState,
  deleteAllUserData,
} from "@/services/storage";
import { sanitizeLog } from "@/utilities/sanitize";

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

interface NonSensitiveState {
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

const defaultNonSensitive: NonSensitiveState = {
  preferences: defaultPreferences,
  wishlist: [],
  scanHistory: [],
  hasCompletedOnboarding: false,
  priceAlerts: [],
};

export const [UserProvider, useUser] = createContextHook(() => {
  const queryClient = useQueryClient();

  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [measurements, setMeasurementsState] = useState<FootMeasurements | null>(null);
  const [nonSensitive, setNonSensitive] = useState<NonSensitiveState>(defaultNonSensitive);

  // ── Load sensitive data from SecureStore ──

  const secureDataQuery = useQuery({
    queryKey: ["secureData"],
    queryFn: async () => {
      const [prof, meas] = await Promise.all([
        loadSecureProfile<UserProfile>(),
        loadSecureMeasurements<FootMeasurements>(),
      ]);
      return { profile: prof, measurements: meas };
    },
  });

  useEffect(() => {
    if (secureDataQuery.data) {
      if (secureDataQuery.data.profile) setProfileState(secureDataQuery.data.profile);
      if (secureDataQuery.data.measurements) setMeasurementsState(secureDataQuery.data.measurements);
    }
  }, [secureDataQuery.data]);

  // ── Load non-sensitive data from AsyncStorage ──

  const nonSensitiveQuery = useQuery({
    queryKey: ["nonSensitiveData"],
    queryFn: async () => {
      return (await loadNonSensitiveState<NonSensitiveState>()) ?? defaultNonSensitive;
    },
  });

  useEffect(() => {
    if (nonSensitiveQuery.data) {
      setNonSensitive(nonSensitiveQuery.data);
    }
  }, [nonSensitiveQuery.data]);

  // ── Save non-sensitive ──

  const { mutate: persistNonSensitive } = useMutation({
    mutationFn: async (data: NonSensitiveState) => {
      await saveNonSensitiveState(data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nonSensitiveData"] });
    },
  });

  const updateNonSensitive = useCallback(
    (updates: Partial<NonSensitiveState>) => {
      setNonSensitive((prev) => {
        const next = { ...prev, ...updates };
        persistNonSensitive(next);
        return next;
      });
    },
    [persistNonSensitive],
  );

  // ── Measurements (SecureStore) ──

  const setMeasurements = useCallback(
    (meas: FootMeasurements) => {
      const scanRecord: ScanHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        measurements: meas,
      };
      saveSecureMeasurements(meas);
      setMeasurementsState(meas);
      updateNonSensitive({
        scanHistory: [scanRecord, ...nonSensitive.scanHistory].slice(0, 10),
      });
    },
    [updateNonSensitive, nonSensitive.scanHistory],
  );

  // ── Profile (SecureStore) ──

  const updateProfile = useCallback(
    (prof: UserProfile) => {
      saveSecureProfile(prof);
      setProfileState(prof);
    },
    [],
  );

  // ── Preferences ──

  const setPreferences = useCallback(
    (prefs: Partial<UserPreferences>) => {
      updateNonSensitive({
        preferences: { ...nonSensitive.preferences, ...prefs },
      });
    },
    [updateNonSensitive, nonSensitive.preferences],
  );

  // ── Wishlist ──

  const addToWishlist = useCallback(
    (shoeId: string) => {
      if (nonSensitive.wishlist.some((item) => item.shoeId === shoeId)) return;
      const newItem: WishlistItem = {
        shoeId,
        addedAt: new Date().toISOString(),
        status: "saved",
      };
      updateNonSensitive({ wishlist: [newItem, ...nonSensitive.wishlist] });
    },
    [updateNonSensitive, nonSensitive.wishlist],
  );

  const removeFromWishlist = useCallback(
    (shoeId: string) => {
      updateNonSensitive({
        wishlist: nonSensitive.wishlist.filter((item) => item.shoeId !== shoeId),
      });
    },
    [updateNonSensitive, nonSensitive.wishlist],
  );

  const updateWishlistStatus = useCallback(
    (shoeId: string, status: WishlistItem["status"]) => {
      updateNonSensitive({
        wishlist: nonSensitive.wishlist.map((item) =>
          item.shoeId === shoeId ? { ...item, status } : item,
        ),
      });
    },
    [updateNonSensitive, nonSensitive.wishlist],
  );

  const isInWishlist = useCallback(
    (shoeId: string) => {
      return nonSensitive.wishlist.some((item) => item.shoeId === shoeId);
    },
    [nonSensitive.wishlist],
  );

  // ── Onboarding ──

  const completeOnboarding = useCallback(() => {
    updateNonSensitive({ hasCompletedOnboarding: true });
  }, [updateNonSensitive]);

  // ── Price Alerts ──

  const setPriceAlert = useCallback(
    (shoeId: string, targetPrice: number) => {
      const existing = nonSensitive.priceAlerts.findIndex((a) => a.shoeId === shoeId);
      let newAlerts: PriceAlert[];
      if (existing >= 0) {
        newAlerts = nonSensitive.priceAlerts.map((a, i) =>
          i === existing ? { ...a, targetPrice, isActive: true } : a,
        );
      } else {
        newAlerts = [
          ...nonSensitive.priceAlerts,
          {
            shoeId,
            targetPrice,
            isActive: true,
            createdAt: new Date().toISOString(),
            notificationsSent: 0,
          },
        ];
      }
      updateNonSensitive({ priceAlerts: newAlerts });
      // Safe logging: no PII
      if (__DEV__) {
        console.log("[User] Price alert updated for item:", sanitizeLog(shoeId.slice(0, 8)));
      }
    },
    [updateNonSensitive, nonSensitive.priceAlerts],
  );

  const removePriceAlert = useCallback(
    (shoeId: string) => {
      updateNonSensitive({
        priceAlerts: nonSensitive.priceAlerts.filter((a) => a.shoeId !== shoeId),
      });
      if (__DEV__) {
        console.log("[User] Price alert removed for item:", sanitizeLog(shoeId.slice(0, 8)));
      }
    },
    [updateNonSensitive, nonSensitive.priceAlerts],
  );

  const togglePriceAlert = useCallback(
    (shoeId: string) => {
      updateNonSensitive({
        priceAlerts: nonSensitive.priceAlerts.map((a) =>
          a.shoeId === shoeId ? { ...a, isActive: !a.isActive } : a,
        ),
      });
    },
    [updateNonSensitive, nonSensitive.priceAlerts],
  );

  const getPriceAlert = useCallback(
    (shoeId: string): PriceAlert | undefined => {
      return nonSensitive.priceAlerts.find((a) => a.shoeId === shoeId);
    },
    [nonSensitive.priceAlerts],
  );

  // ── Full data deletion ──

  const deleteAllData = useCallback(async () => {
    setProfileState(null);
    setMeasurementsState(null);
    setNonSensitive(defaultNonSensitive);
    await deleteAllUserData();
    queryClient.invalidateQueries({ queryKey: ["secureData"] });
    queryClient.invalidateQueries({ queryKey: ["nonSensitiveData"] });
  }, [queryClient]);

  const isLoading =
    secureDataQuery.isLoading || nonSensitiveQuery.isLoading;

  return {
    profile,
    measurements,
    ...nonSensitive,
    isLoading,
    setMeasurements,
    setPreferences,
    setProfile: updateProfile,
    addToWishlist,
    removeFromWishlist,
    updateWishlistStatus,
    isInWishlist,
    completeOnboarding,
    setPriceAlert,
    removePriceAlert,
    togglePriceAlert,
    getPriceAlert,
    deleteAllData,
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
        if (
          preferences.preferredBrands.length > 0 &&
          !preferences.preferredBrands.includes(shoe.brand)
        ) {
          return false;
        }
        if (
          preferences.stylePreferences.length > 0 &&
          !preferences.stylePreferences.includes(shoe.category)
        ) {
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
