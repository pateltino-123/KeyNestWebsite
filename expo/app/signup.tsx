import React, { useCallback, useMemo, useState } from "react";
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
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Eye, EyeOff, Check, ChevronLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { checkPassword, isPasswordValid } from "@/utilities/password";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rules = useMemo(() => checkPassword(password), [password]);
  const passwordOk = isPasswordValid(password);
  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && passwordOk && !loading;

  const handleSignUp = useCallback(async () => {
    if (!canSubmit) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError(null);
    setLoading(true);
    const result = await signUp(email, password, name);
    setLoading(false);
    if (!result.ok) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(result.error ?? "Couldn't create your account. Try again.");
      return;
    }
    if (result.error === "CONFIRM_EMAIL") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Check your email",
        "We sent a confirmation link to your email. Confirm it, then sign in.",
        [{ text: "OK", onPress: () => router.replace("/login" as never) }],
      );
    }
    // On success with a session, the auth gate navigates automatically.
  }, [canSubmit, email, password, name, signUp]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <ChevronLeft size={26} color={colors.text} />
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Save your fit, wishlist, and history across devices
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={[styles.label, { color: colors.textSecondary, marginTop: 18 }]}>Email</Text>
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
              placeholder="Create a password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleSignUp}
            />
            <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={10} style={styles.eyeButton}>
              {showPassword ? (
                <EyeOff size={20} color={colors.textMuted} />
              ) : (
                <Eye size={20} color={colors.textMuted} />
              )}
            </Pressable>
          </View>

          <View style={styles.rules}>
            {rules.map((rule) => (
              <View key={rule.key} style={styles.ruleRow}>
                <View
                  style={[
                    styles.ruleDot,
                    {
                      backgroundColor: rule.met ? colors.success : "transparent",
                      borderColor: rule.met ? colors.success : colors.textMuted,
                    },
                  ]}
                >
                  {rule.met && <Check size={11} color="#FFFFFF" />}
                </View>
                <Text
                  style={[
                    styles.ruleText,
                    { color: rule.met ? colors.textSecondary : colors.textMuted },
                  ]}
                >
                  {rule.label}
                </Text>
              </View>
            ))}
          </View>

          {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

          <Pressable
            style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: canSubmit ? 1 : 0.5 }]}
            onPress={handleSignUp}
            disabled={!canSubmit}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Create account</Text>
            )}
          </Pressable>

          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: colors.textSecondary }]}>Already have an account?</Text>
            <Pressable onPress={() => router.replace("/login" as never)} hitSlop={8}>
              <Text style={[styles.switchLink, { color: colors.primary }]}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  backButton: { width: 40, height: 40, justifyContent: "center", marginLeft: -8, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginTop: 8, lineHeight: 21 },
  form: { marginTop: 28 },
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
  rules: { marginTop: 14, gap: 8 },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ruleDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  ruleText: { fontSize: 13 },
  error: { fontSize: 13, marginTop: 14, fontWeight: "500" },
  primaryButton: {
    marginTop: 24,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  switchRow: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 22 },
  switchText: { fontSize: 14 },
  switchLink: { fontSize: 14, fontWeight: "700" },
});
