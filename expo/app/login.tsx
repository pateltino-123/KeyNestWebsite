import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { signIn, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const handleSignIn = useCallback(async () => {
    if (!canSubmit) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (!result.ok) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(result.error ?? "Couldn't sign in. Check your details and try again.");
    }
  }, [canSubmit, email, password, signIn]);

  const handleGuest = useCallback(async () => {
    void Haptics.selectionAsync();
    await continueAsGuest();
  }, [continueAsGuest]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <Text style={[styles.brand, { color: colors.text }]}>Shoe</Text>
          <Text style={[styles.brand, { color: colors.primary }]}>Fit</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to sync your fit and saved shoes
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 18 }]}>Password</Text>
          <View style={[styles.passwordRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              style={[styles.passwordInput, { color: colors.text }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSignIn}
            />
            <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={10} style={styles.eyeButton}>
              {showPassword ? (
                <EyeOff size={20} color={colors.textMuted} />
              ) : (
                <Eye size={20} color={colors.textMuted} />
              )}
            </Pressable>
          </View>

          {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: canSubmit ? 1 : 0.5 }]}
            onPress={handleSignIn}
            disabled={!canSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign in</Text>
            )}
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.textSecondary }]}>New here?</Text>
            <Pressable onPress={() => router.push("/signup")} hitSlop={8}>
              <Text style={[styles.switchLink, { color: colors.primary }]}>Create an account</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={handleGuest} style={styles.guestButton} hitSlop={8}>
          <Text style={[styles.guestText, { color: colors.textMuted }]}>Continue as guest</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  brandRow: { flexDirection: "row", justifyContent: "center" },
  brand: { fontSize: 34, fontWeight: "800", letterSpacing: -1 },
  subtitle: { fontSize: 15, textAlign: "center", marginTop: 8 },
  form: { marginTop: 40 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingRight: 12,
  },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  eyeButton: { padding: 4 },
  error: { fontSize: 13, marginTop: 14, fontWeight: "500" },
  primaryButton: {
    marginTop: 28,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  switchRow: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 22 },
  switchText: { fontSize: 14 },
  switchLink: { fontSize: 14, fontWeight: "700" },
  guestButton: { alignItems: "center", marginTop: "auto", paddingTop: 24 },
  guestText: { fontSize: 14, fontWeight: "600" },
});
