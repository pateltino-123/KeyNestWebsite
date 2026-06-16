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
import { ArrowLeft, FileText } from "lucide-react-native";

import { useTheme } from "@/contexts/ThemeContext";

export default function TermsOfServiceScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Terms of Service",
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
            <FileText size={32} color={colors.primary} />
          </View>
          <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
            Last updated: June 16, 2026
          </Text>
        </View>

        <Section title="1. Acceptance of Terms" colors={colors}>
          By downloading, installing, or using the shoeFitx mobile application
          (the "App"), you agree to be bound by these Terms of Service
          ("Terms"). If you do not agree to these Terms, do not use the App.
          {"\n\n"}
          We reserve the right to modify these Terms at any time. We will notify
          you of material changes by posting the updated Terms within the App.
          Your continued use of the App after changes constitutes acceptance of
          the updated Terms.
        </Section>

        <Section title="2. Description of the Service" colors={colors}>
          shoeFitx is a mobile application that helps users find properly
          fitting running shoes through:
          {"\n\n"}• AI-powered foot scanning and measurement
          {"\n"}• Personalized shoe recommendations based on foot measurements
          {"\n"}• A browsable catalog of running shoes with sizing information
          {"\n"}• An AI shoe expert assistant for sizing and product questions
          {"\n"}• Wishlist management and price tracking
        </Section>

        <Section title="3. User Obligations" colors={colors}>
          By using the App, you agree that:
          {"\n\n"}• You are at least 13 years of age.
          {"\n"}• You will provide accurate information when setting up your
          profile.
          {"\n"}• You will not use the App for any unlawful purpose or in
          violation of any applicable laws.
          {"\n"}• You will not attempt to reverse engineer, decompile, or
          extract the source code of the App.
          {"\n"}• You will not use the App to harass, abuse, or harm others.
          {"\n"}• You are responsible for maintaining the confidentiality of
          any account credentials.
        </Section>

        <Section title="4. Foot Measurement Disclaimer" colors={colors}>
          The foot scanning and measurement feature provides estimates based on
          computer vision analysis of camera images. While we strive for
          accuracy:
          {"\n\n"}• Measurements are estimates, not medical-grade precision.
          {"\n"}• Proper lighting, surface, and phone positioning are required
          for best results.
          {"\n"}• Shoe sizing recommendations are suggestions based on
          manufacturer size charts and user feedback — individual fit may vary.
          {"\n"}• Always try on shoes when possible and follow the
          manufacturer's sizing guidance and return policies.
          {"\n"}• shoeFitx is not responsible for ill-fitting shoes purchased
          based on our recommendations.
        </Section>

        <Section title="5. AI Assistant Disclaimer" colors={colors}>
          The AI shoe expert assistant provides automated responses based on
          the shoe catalog and your measurements. You acknowledge that:
          {"\n\n"}• AI-generated responses may contain errors or outdated
          information.
          {"\n"}• The assistant does not constitute professional advice
          (medical, podiatric, or otherwise).
          {"\n"}• You should verify important information before making
          purchasing decisions.
          {"\n"}• We are not liable for decisions made based on AI assistant
          responses.
        </Section>

        <Section title="6. Third-Party Services & Links" colors={colors}>
          The App integrates with third-party services:
          {"\n\n"}• <Bold>kicks.dev:</Bold> Provides shoe catalog data and
          pricing information. We are not responsible for the accuracy or
          availability of this data.
          {"\n"}• <Bold>Retailer links:</Bold> "Where to Buy" links may direct
          you to third-party websites (StockX, GOAT, Flight Club). We do not
          control these websites and are not responsible for their content,
          privacy practices, or transactions.
          {"\n"}• <Bold>Rork AI Toolkit:</Bold> Processes AI assistant
          messages. See our Privacy Policy for details on how your data is
          handled.
          {"\n\n"}
          Your interactions with third-party services are governed by their
          respective terms and policies.
        </Section>

        <Section title="7. Intellectual Property" colors={colors}>
          The App, including its code, design, text, graphics, and logo, is
          owned by shoeFitx and protected by copyright, trademark, and other
          intellectual property laws. You may not copy, modify, distribute, or
          create derivative works without our prior written consent.
          {"\n\n"}
          Shoe brand names, logos, and product images displayed in the App are
          the property of their respective owners and are used for informational
          purposes only.
        </Section>

        <Section title="8. Limitation of Liability" colors={colors}>
          To the fullest extent permitted by applicable law:
          {"\n\n"}• shoeFitx is provided "as is" without warranties of any kind,
          express or implied.
          {"\n"}• We do not guarantee that the App will be uninterrupted,
          error-free, or available at all times.
          {"\n"}• We are not liable for any indirect, incidental, special, or
          consequential damages arising from your use of the App.
          {"\n"}• Our total liability for any claim related to the App is
          limited to the amount you paid us (if any) in the 12 months preceding
          the claim.
          {"\n"}• Some jurisdictions do not allow certain limitations of
          liability, so some of these limitations may not apply to you.
        </Section>

        <Section title="9. Indemnification" colors={colors}>
          You agree to indemnify and hold harmless shoeFitx and its affiliates
          from any claims, damages, losses, or expenses arising from:
          {"\n\n"}• Your use of the App
          {"\n"}• Your violation of these Terms
          {"\n"}• Your violation of any third-party rights
          {"\n"}• Any content you submit through the App
        </Section>

        <Section title="10. Termination" colors={colors}>
          We reserve the right to suspend or terminate your access to the App
          at our sole discretion, without notice, for conduct that we believe
          violates these Terms or is harmful to other users, us, or third
          parties.
          {"\n\n"}
          You may terminate your use of the App at any time by deleting the App
          from your device. You can also delete all your data from within the
          App's Profile tab.
        </Section>

        <Section title="11. App Store & Google Play Terms" colors={colors}>
          When you download the App from the Apple App Store or Google Play
          Store, you acknowledge and agree that:
          {"\n\n"}• These Terms are between you and shoeFitx, not Apple or
          Google.
          {"\n"}• Apple and Google have no obligation to provide maintenance or
          support for the App.
          {"\n"}• Apple and Google are not responsible for any claims related
          to the App.
          {"\n"}• You must comply with the applicable App Store or Google Play
          Terms of Service.
          {"\n"}• Apple and Google are third-party beneficiaries of these Terms
          and may enforce them against you.
        </Section>

        <Section title="12. Governing Law" colors={colors}>
          These Terms are governed by the laws of the State of Delaware, United
          States, without regard to conflict of law principles. Any disputes
          arising from these Terms shall be resolved in the courts of Delaware.
        </Section>

        <Section title="13. Severability" colors={colors}>
          If any provision of these Terms is found to be unenforceable or
          invalid, that provision will be limited or eliminated to the minimum
          extent necessary, and the remaining provisions will remain in full
          force and effect.
        </Section>

        <Section title="14. Contact" colors={colors}>
          For questions about these Terms, please contact us at:
          {"\n\n"}• Email: legal@shoefitx.app
          {"\n"}• Through the App: Visit the Profile tab.
        </Section>

        <View style={[styles.footer, { borderTopColor: colors.borderLight }]}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            shoeFitx. Helping you find the perfect fit.
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
    <Text style={{ fontWeight: "700" as const }}>{children}</Text>
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
