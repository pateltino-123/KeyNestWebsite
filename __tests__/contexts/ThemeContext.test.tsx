import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { darkTheme, lightTheme } from '@/constants/colors';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide default dark theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });
    expect(result.current.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(result.current.colors).toEqual(darkTheme);
  });

  it('should toggle theme from dark to light', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(result.current.mode).toBe('light');
    });

    expect(result.current.isDark).toBe(false);
    expect(result.current.colors).toEqual(lightTheme);
  });

  it('should toggle theme from light back to dark', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(result.current.mode).toBe('light');
    });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(result.current.mode).toBe('dark');
    });
  });

  it('should set specific theme', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

    act(() => {
      result.current.setTheme('light');
    });

    await waitFor(() => {
      expect(result.current.mode).toBe('light');
    });

    expect(result.current.colors).toEqual(lightTheme);
  });

  it('should save theme to AsyncStorage on toggle', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

    act(() => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('shoefit_theme', 'light');
    });
  });

  it('should save theme to AsyncStorage on setTheme', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });

    act(() => {
      result.current.setTheme('light');
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('shoefit_theme', 'light');
    });
  });

  it('should expose isLoading state', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });
    expect(typeof result.current.isLoading).toBe('boolean');
  });
});
