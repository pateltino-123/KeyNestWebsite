import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProvider,
  useUser,
  useWishlistedShoes,
  useRecommendedShoes,
  FootMeasurements,
} from '@/contexts/UserContext';
import { shoes } from '@/mocks/shoes';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  );
};

const mockMeasurements: FootMeasurements = {
  leftLength: 26.5,
  leftWidth: 10.0,
  rightLength: 26.7,
  rightWidth: 10.1,
  archType: 'neutral',
  footType: 'normal',
  recommendedSize: 10,
  lastScanned: new Date().toISOString(),
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useUser', () => {
    it('should provide default state', () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });
      expect(result.current.profile).toBeNull();
      expect(result.current.measurements).toBeNull();
      expect(result.current.wishlist).toEqual([]);
      expect(result.current.scanHistory).toEqual([]);
      expect(result.current.hasCompletedOnboarding).toBe(false);
    });

    it('should provide default preferences', () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });
      expect(result.current.preferences.preferredBrands).toEqual([]);
      expect(result.current.preferences.budgetMin).toBe(0);
      expect(result.current.preferences.budgetMax).toBe(300);
      expect(result.current.preferences.stylePreferences).toEqual([]);
      expect(result.current.preferences.activityTypes).toEqual([]);
      expect(result.current.preferences.sizeSystem).toBe('US');
    });

    it('should set profile', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.setProfile({ name: 'John', email: 'john@test.com' });
      });

      await waitFor(() => {
        expect(result.current.profile).toEqual({ name: 'John', email: 'john@test.com' });
      });
    });

    it('should set measurements', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.setMeasurements(mockMeasurements);
      });

      await waitFor(() => {
        expect(result.current.measurements).toEqual(mockMeasurements);
      });
    });

    it('should add to scan history when measurements are set', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.setMeasurements(mockMeasurements);
      });

      await waitFor(() => {
        expect(result.current.scanHistory.length).toBe(1);
        expect(result.current.scanHistory[0].measurements).toEqual(mockMeasurements);
      });
    });

    it('should limit scan history to 10 entries', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      for (let i = 0; i < 12; i++) {
        act(() => {
          result.current.setMeasurements({
            ...mockMeasurements,
            recommendedSize: 8 + i,
          });
        });
      }

      await waitFor(() => {
        expect(result.current.scanHistory.length).toBeLessThanOrEqual(10);
      });
    });

    it('should update preferences partially', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.setPreferences({ budgetMax: 500, sizeSystem: 'EU' });
      });

      await waitFor(() => {
        expect(result.current.preferences.budgetMax).toBe(500);
        expect(result.current.preferences.sizeSystem).toBe('EU');
        expect(result.current.preferences.budgetMin).toBe(0);
      });
    });

    it('should add to wishlist', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.addToWishlist('1');
      });

      await waitFor(() => {
        expect(result.current.wishlist.length).toBe(1);
        expect(result.current.wishlist[0].shoeId).toBe('1');
        expect(result.current.wishlist[0].status).toBe('saved');
      });
    });

    it('should not add duplicate wishlist items', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.addToWishlist('1');
      });

      await waitFor(() => {
        expect(result.current.wishlist.length).toBe(1);
      });

      act(() => {
        result.current.addToWishlist('1');
      });

      await waitFor(() => {
        expect(result.current.wishlist.length).toBe(1);
      });
    });

    it('should remove from wishlist', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.addToWishlist('1');
      });

      await waitFor(() => {
        expect(result.current.wishlist.length).toBe(1);
      });

      act(() => {
        result.current.removeFromWishlist('1');
      });

      await waitFor(() => {
        expect(result.current.wishlist.length).toBe(0);
      });
    });

    it('should update wishlist status', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.addToWishlist('1');
      });

      await waitFor(() => {
        expect(result.current.wishlist.length).toBe(1);
      });

      act(() => {
        result.current.updateWishlistStatus('1', 'purchased');
      });

      await waitFor(() => {
        expect(result.current.wishlist[0].status).toBe('purchased');
      });
    });

    it('should check if item is in wishlist', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      expect(result.current.isInWishlist('1')).toBe(false);

      act(() => {
        result.current.addToWishlist('1');
      });

      await waitFor(() => {
        expect(result.current.isInWishlist('1')).toBe(true);
      });
    });

    it('should complete onboarding', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.completeOnboarding();
      });

      await waitFor(() => {
        expect(result.current.hasCompletedOnboarding).toBe(true);
      });
    });

    it('should save data to AsyncStorage', async () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });

      act(() => {
        result.current.setProfile({ name: 'Test', email: 'test@test.com' });
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalled();
      });
    });

    it('should expose isLoading state', () => {
      const { result } = renderHook(() => useUser(), { wrapper: createWrapper() });
      expect(typeof result.current.isLoading).toBe('boolean');
    });
  });

  describe('useWishlistedShoes', () => {
    it('should return empty array when wishlist is empty', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useWishlistedShoes(shoes), { wrapper });
      expect(result.current).toEqual([]);
    });

    it('should filter out items where shoe is not found', async () => {
      const wrapper = createWrapper();
      const { result: userResult } = renderHook(() => useUser(), { wrapper });

      act(() => {
        userResult.current.addToWishlist('nonexistent-id');
      });

      const { result } = renderHook(() => useWishlistedShoes(shoes), { wrapper });

      await waitFor(() => {
        expect(result.current.length).toBe(0);
      });
    });
  });

  describe('useRecommendedShoes', () => {
    it('should return first 6 shoes when no measurements', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRecommendedShoes(shoes), { wrapper });
      expect(result.current.length).toBeLessThanOrEqual(6);
    });

    it('should return max 8 shoes when measurements exist', async () => {
      const wrapper = createWrapper();
      const { result: userResult } = renderHook(() => useUser(), { wrapper });

      act(() => {
        userResult.current.setMeasurements(mockMeasurements);
      });

      const { result } = renderHook(() => useRecommendedShoes(shoes), { wrapper });

      await waitFor(() => {
        expect(result.current.length).toBeLessThanOrEqual(8);
      });
    });
  });
});
