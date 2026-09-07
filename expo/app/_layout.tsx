import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useTheme, ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

const AUTH_ROUTES = ["login", "signup"];

function useAuthGate() {
  // Public website: allow all visitors to browse pages without login gating
  const { isAuthed, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;
    const inAuthRoute = AUTH_ROUTES.includes(segments[0] ?? "");
    if (isAuthed && inAuthRoute) {
      router.replace("/" as never);
    }
  }, [isAuthed, initializing, segments, router]);
}

function RootLayoutNav() {
  const { colors, isDark } = useTheme();
  const { initializing } = useAuth();

  useAuthGate();

  useEffect(() => {
    if (!initializing) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [initializing]);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen name="services" options={{ headerShown: false }} />
        <Stack.Screen name="owners" options={{ headerShown: false }} />
        <Stack.Screen name="tenants" options={{ headerShown: false }} />
        <Stack.Screen name="rentals" options={{ headerShown: false }} />
        <Stack.Screen name="pricing" options={{ headerShown: false }} />
        <Stack.Screen name="why-keynest" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
        <Stack.Screen name="compliance" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

function AppContent() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <RootLayoutNav />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppContent />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
