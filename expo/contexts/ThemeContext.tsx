import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { darkTheme, lightTheme, ThemeColors } from "@/constants/colors";

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "shoefit_theme";

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<ThemeMode>("light");

  const themeQuery = useQuery({
    queryKey: ["theme"],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        return (stored as ThemeMode) || "light";
      } catch {
        return "light" as ThemeMode;
      }
    },
  });

  useEffect(() => {
    if (themeQuery.data) {
      setMode(themeQuery.data);
    }
  }, [themeQuery.data]);

  const { mutate: saveTheme } = useMutation({
    mutationFn: async (newMode: ThemeMode) => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
      } catch {
        // Storage write failed — theme won't persist
      }
      return newMode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme"] });
    },
  });

  const toggleTheme = useCallback(() => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    saveTheme(newMode);
  }, [mode, saveTheme]);

  const setTheme = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    saveTheme(newMode);
  }, [saveTheme]);

  const colors: ThemeColors = useMemo(() => {
    return mode === "dark" ? darkTheme : lightTheme;
  }, [mode]);

  const isDark = mode === "dark";

  return {
    mode,
    colors,
    isDark,
    toggleTheme,
    setTheme,
    isLoading: themeQuery.isLoading,
  };
});
