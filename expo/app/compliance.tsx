import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  ShieldCheck,
  ExternalLink,
  Building,
  Scale,
  Lock,
  FileText,
  CheckCircle2,
} from "lucide-react-native";
import WebsiteLayout from "@/components/keynest/WebsiteLayout";
import { KEYNEST_INFO } from "@/constants/keynestData";

export default function CompliancePage() {
  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#38BDF8" />
            <Text style={styles.badgePillText}>Texas Real Estate Commission (TREC) Regulatory Notices</Text>
          </View>
          <Text style={styles.pageTitle}>Regulatory Compliance & Broker Disclosures</Text>
          <Text style={styles.pageSubtitle}>
            Statutory disclosures required by Texas law, Fair Housing guidelines, broker oversight standards, and secure data handling commitments.
          </Text>
        </View>
      </View>

      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.contentStack}>
            {/* 1. Broker Identification & Relationship */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <Building size={22} color="#2563EB" />
                <Text style={styles.cardHeading}>Brokerage Identification & Operating Entity</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                <Text style={{ fontWeight: "700" }}>{KEYNEST_INFO.brokerageFullLine}</Text>
              </Text>
              <Text style={styles.bodyParagraph}>
                KeyNest Realty is an operating property management division of DoubleDee LLC, conducting all regulated real estate activities under the direct sponsorship and active oversight of Texas licensed real estate broker <Text style={{ fontWeight: "700" }}>Fair Deal Realty Inc.</Text>
              </Text>
              <View style={styles.infoGrid}>
                <Text style={styles.infoLine}>• Central Office Address: {KEYNEST_INFO.officeAddress}</Text>
                <Text style={styles.infoLine}>• Authorized Managers: Dinesh Donthula & Purvang Patel</Text>
                <Text style={styles.infoLine}>• Sponsoring Brokerage: Fair Deal Realty Inc.</Text>
                <Text style={styles.infoLine}>• Office Contact: {KEYNEST_INFO.phone} | {KEYNEST_INFO.email}</Text>
              </View>
            </View>

            {/* 2. Mandatory TREC Notices */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <FileText size={22} color="#2563EB" />
                <Text style={styles.cardHeading}>Texas Real Estate Commission (TREC) Mandatory Notices</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                Texas law requires all real estate license holders to provide the Information About Brokerage Services (IABS) form and the Consumer Protection Notice to prospective clients.
              </Text>

              <View style={styles.trecButtonsGroup}>
                <TouchableOpacity
                  style={styles.trecActionBtn}
                  onPress={() => openUrl(KEYNEST_INFO.trecIabsUrl)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trecBtnTitle}>TREC Information About Brokerage Services (IABS)</Text>
                    <Text style={styles.trecBtnSub}>Learn about the different types of brokerage representation and consumer duties.</Text>
                  </View>
                  <ExternalLink size={16} color="#2563EB" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.trecActionBtn}
                  onPress={() => openUrl(KEYNEST_INFO.trecConsumerNoticeUrl)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trecBtnTitle}>TREC Consumer Protection Notice</Text>
                    <Text style={styles.trecBtnSub}>Official TREC notice regarding broker licensing, recovery funds, and filing complaints.</Text>
                  </View>
                  <ExternalLink size={16} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Fair Housing Policy */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <Scale size={22} color="#2563EB" />
                <Text style={styles.cardHeading}>Equal Housing Opportunity & Fair Housing Statement</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                KeyNest Realty and Fair Deal Realty Inc. conduct business in strict accordance with Federal, State, and Local Fair Housing laws. We do not discriminate against any applicant or resident based on:
              </Text>
              <View style={styles.protectedClassesRow}>
                {["Race", "Color", "National Origin", "Religion", "Sex", "Familial Status", "Disability"].map((cls) => (
                  <View key={cls} style={styles.classPill}>
                    <CheckCircle2 size={13} color="#2563EB" />
                    <Text style={styles.classPillText}>{cls}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 4. Security Deposit Trust Accounts */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <Lock size={22} color="#2563EB" />
                <Text style={styles.cardHeading}>Security Deposit & Trust Escrow Accounting</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                All tenant security deposits collected by KeyNest Realty are deposited into an FDIC-insured broker trust escrow account governed by Texas Property Code Chapter 92. Security deposits are never commingled with operating funds.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  headerHero: {
    backgroundColor: "#0B1120",
    paddingVertical: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  innerContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
  },
  badgePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E293B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  badgePillText: {
    color: "#E2E8F0",
    fontSize: 12.5,
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 16.5,
    color: "#94A3B8",
    maxWidth: 760,
    lineHeight: 25,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 72,
  },
  contentStack: {
    maxWidth: 900,
    width: "100%",
    marginHorizontal: "auto",
    gap: 24,
  },
  complianceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 28,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  bodyParagraph: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  infoGrid: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  infoLine: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
  },
  trecButtonsGroup: {
    gap: 12,
    marginTop: 6,
  },
  trecActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    gap: 14,
  },
  trecBtnTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
  },
  trecBtnSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  protectedClassesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  classPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  classPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
  },
});
