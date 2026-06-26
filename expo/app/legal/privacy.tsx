import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { ArrowLeft, Shield } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Privacy Policy",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={12}
            >
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <View style={styles.headerSection}>
          <View
            style={[styles.iconWrap, { backgroundColor: colors.surfaceAlt }]}
          >
            <Shield size={32} color={colors.primary} />
          </View>
          <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
            Last updated: June 16, 2026
          </Text>
        </View>

        <Section title="1. Introduction" colors={colors}>
          shoeFitx ("we," "our," or "us") is committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, store, and
          share your personal data when you use the shoeFitx mobile application
          (the "App"). By using the App, you agree to the practices described in
          this policy. If you do not agree, please discontinue use of the App.
        </Section>

        <Section title="2. Data We Collect" colors={colors}>
          <Bold>a) Information you provide directly:</Bold>
          {"\n"}- Profile data: your name and email address (optional, for
          personalization).
          {"\n"}- Foot measurements: length, width, arch type, and foot type of
          your left and right feet, captured through our in-app scanning feature.
          {"\n"}- Preferences: preferred shoe brands, style categories, budget
          range, and sizing system.
          {"\n"}- Wishlist: shoes you save, including their purchase status.
          {"\n"}- AI chat messages: questions and prompts you send to our shoe
          expert assistant.
          {"\n\n"}
          <Bold>b) Information collected automatically:</Bold>
          {"\n"}- Camera access: used solely during the foot scanning process to
          capture images of your feet. Camera images are processed locally on
          your device and are never uploaded to our servers.
          {"\n"}- Device motion data: used during scanning to ensure the phone
          is properly aligned for accurate measurements.
          {"\n"}- Device type: used to optimize the app experience for your
          specific device.
        </Section>

        <Section title="3. How We Use Your Data" colors={colors}>
          We use your data for the following purposes only:
          {"\n\n"}- To provide personalized running shoe recommendations based
          on your foot measurements and preferences.
          {"\n"}- To display sizing alerts and fit warnings for specific shoes.
          {"\n"}- To enable the AI shoe expert assistant to answer your
          questions with context about your measurements and the shoe catalog.
          {"\n"}- To save and restore your wishlist, preferences, and scan
          history across app sessions.
          {"\n"}- To improve the accuracy of our foot measurement algorithms
          (using anonymized, aggregated data only).
          {"\n"}- To respond to your support requests.
        </Section>

        <Section title="4. Data Storage & Security" colors={colors}>
          All your data is stored locally on your device:
          {"\n\n"}• Foot measurements and profile data are encrypted using
          iOS Keychain / Android EncryptedSharedPreferences (via
          expo-secure-store).
          {"\n"}• Preferences, wishlist, and scan history are stored in app
          local storage (AsyncStorage).
          {"\n"}• Camera images are processed on-device and never stored
          permanently. They are discarded immediately after measurements are
          extracted.
          {"\n"}• AI chat messages are transmitted through a secure proxy
          (our secure AI proxy) for processing. Messages are not stored on our
          servers after the conversation ends.
          {"\n"}• We do not maintain cloud backups of your personal data.
          {"\n"}• You can delete all your data at any time from the Profile tab
          under "Delete All My Data."
        </Section>

        <Section title="5. Data Sharing & Third Parties" colors={colors}>
          We do not sell your personal data to third parties. We share limited
          data only as necessary to provide the App's features:
          {"\n\n"}• <Bold>kicks.dev API:</Bold> When you browse the shoe catalog
          or view shoe details, your search queries are sent to the kicks.dev API
          to retrieve shoe listings and pricing. No personal data is included in
          these requests.
          {"\n"}• <Bold>AI Assistant:</Bold> Chat messages to the AI
          assistant are processed through a secure AI proxy. Messages
          include your foot measurements and shoe catalog context to provide
          relevant recommendations. The AI provider does not use your data for
          model training.
          {"\n"}• <Bold>Legal obligations:</Bold> We may disclose data if
          required by law, court order, or to protect the rights and safety of
          our users.
        </Section>

        <Section title="6. Camera & Biometric Data" colors={colors}>
          The App requests camera access solely for the foot scanning feature.
          Camera images are:
          {"\n\n"}• Processed entirely on your device.{"\n"}• Never uploaded to
          our servers or any third party.{"\n"}• Never stored after measurement
          extraction is complete.
          {"\n\n"}
          While foot measurements could be considered biometric-adjacent data,
          they are not used to uniquely identify you — they are used only to
          suggest shoe sizes. Measurements are encrypted on-device and under
          your control at all times.
        </Section>

        <Section title="7. Children's Privacy" colors={colors}>
          shoeFitx is not directed to children under the age of 13. We do not
          knowingly collect personal data from children under 13. If you are a
          parent or guardian and believe your child has provided us with
          personal data, please contact us and we will delete it promptly.
        </Section>

        <Section title="8. Your Rights & Choices" colors={colors}>
          You have full control over your data:
          {"\n\n"}• <Bold>Access:</Bold> View your measurements, profile, and
          preferences at any time in the Profile tab.
          {"\n"}• <Bold>Edit:</Bold> Update your profile, preferences, and size
          system from the Profile tab.
          {"\n"}• <Bold>Delete:</Bold> Use "Delete All My Data" in the Profile
          tab to permanently erase all locally stored data, including
          measurements, profile, wishlist, preferences, and scan history.
          {"\n"}• <Bold>Revoke camera access:</Bold> You can disable camera
          access in your device's system Settings at any time. Without camera
          access, the foot scanning feature will not function.
          {"\n"}• <Bold>Opt out of AI processing:</Bold> You can choose not to
          use the AI Assistant tab. No messages are sent unless you actively
          type and send them.
        </Section>

        <Section title="9. Data Retention" colors={colors}>
          Your data is stored locally on your device for as long as you keep the
          App installed. When you delete your data through the App or uninstall
          the App, all locally stored data is permanently removed. We do not
          retain copies of your personal data on our servers.
        </Section>

        <Section title="10. International Users" colors={colors}>
          The App is distributed globally through the Apple App Store and Google
          Play Store. Your data is processed and stored locally on your device.
          By using the App, you consent to this local processing. We comply with
          applicable data protection laws including GDPR (EU/UK) and CCPA
          (California).
        </Section>

        <Section title="11. Changes to This Policy" colors={colors}>
          We may update this Privacy Policy from time to time. We will notify
          you of material changes by posting the updated policy within the App
          and updating the "Last updated" date. Your continued use of the App
          after changes constitutes acceptance of the updated policy.
        </Section>

        <Section title="12. Contact Us" colors={colors}>
          If you have questions, concerns, or requests regarding your privacy:
          {"\n\n"}• Email: privacy@shoefitx.app
          {"\n"}• Through the App: Visit the Profile tab and our support contact
          option.
        </Section>

        <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            shoeFitx is a product of ShoeFitX. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
        {children}
      </Text>
    </View>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontWeight: "700" as const }}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 4,
  },
  scrollContent: {
    padding: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 13,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 12,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 24,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
  },
});
