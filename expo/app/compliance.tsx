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
            <ShieldCheck size={14} color="#10B981" />
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
                <Building size={22} color="#164E3A" />
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

            {/* 2. Mandatory TREC Notices (IABS and Consumer Protection Notice) */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <FileText size={22} color="#164E3A" />
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
                  <ExternalLink size={16} color="#164E3A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.trecActionBtn}
                  onPress={() => openUrl(KEYNEST_INFO.trecConsumerNoticeUrl)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trecBtnTitle}>TREC Consumer Protection Notice</Text>
                    <Text style={styles.trecBtnSub}>Official TREC notice regarding broker licensing, recovery funds, and filing complaints.</Text>
                  </View>
                  <ExternalLink size={16} color="#164E3A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Fair Housing & Equal Opportunity */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <Scale size={22} color="#164E3A" />
                <Text style={styles.cardHeading}>Fair Housing & Equal Opportunity Policy</Text>
              </View>
              <View style={styles.equalHousingBadge}>
                <Text style={styles.equalHousingBadgeText}>EQUAL HOUSING OPPORTUNITY</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                KeyNest Realty Property Management and Fair Deal Realty Inc. are fully committed to the letter and spirit of the U.S. policy for the achievement of equal housing opportunity throughout the Nation.
              </Text>
              <Text style={styles.bodyParagraph}>
                We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap/disability, familial status, or national origin. All rental applications are evaluated strictly against published, objective selection criteria.
              </Text>
            </View>

            {/* 4. Trust Account & Financial Governance */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <Lock size={22} color="#164E3A" />
                <Text style={styles.cardHeading}>Security Deposit Trust Accounting</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                In strict compliance with Chapter 92 of the Texas Property Code and Texas Real Estate Commission regulations:
              </Text>
              <View style={styles.infoGrid}>
                <Text style={styles.infoLine}>• All resident security deposits are held in a separate, broker-supervised escrow trust account managed by Fair Deal Realty Inc.</Text>
                <Text style={styles.infoLine}>• Tenant funds are never commingled with company operating accounts.</Text>
                <Text style={styles.infoLine}>• Security deposit itemization and disbursements are executed within statutory 30-day deadlines upon surrender of possession.</Text>
              </View>
            </View>

            {/* 5. Privacy & Data Security Disclosures */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <ShieldCheck size={22} color="#164E3A" />
                <Text style={styles.cardHeading}>Privacy Policy & Secure Data Routing</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                KeyNest Realty takes user privacy and data security seriously. We adhere to the following principles:
              </Text>
              <View style={styles.infoGrid}>
                <Text style={styles.infoLine}>• No Sensitive Financial Data on Web Forms: Sensitive identity documents, Social Security numbers, bank account logins, and tenant credit screenings are processed solely through encrypted AppFolio software platforms.</Text>
                <Text style={styles.infoLine}>• No Selling of Personal Information: Lead inquiries, owner contacts, and phone numbers are never sold or rented to third-party marketing firms.</Text>
                <Text style={styles.infoLine}>• Communications Consent: In accordance with TCPA and CTIA standards, users submitting inquiries consent to communication regarding their specific real estate inquiries.</Text>
              </View>
            </View>

            {/* 6. Advertising Governance */}
            <View style={styles.complianceCard}>
              <View style={styles.cardHeader}>
                <CheckCircle2 size={22} color="#164E3A" />
                <Text style={styles.cardHeading}>Texas Advertising Rules & Supportable Claims</Text>
              </View>
              <Text style={styles.bodyParagraph}>
                Under TREC Rule §535.155, all real estate advertising must clearly identify the licensed broker and must not mislead the public. KeyNest Realty does not make unsupported performance guarantees such as {"\""}guaranteed faster leasing{"\""} or {"\""}maximum returns.{"\""} Every rental analysis reflects current comparative market data, and all final leasing terms are governed by written agreements.
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
    backgroundColor: "#164E3A",
    paddingVertical: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#1D644B",
  },
  innerContainer: {
    maxWidth: 1080,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 16,
  },
  badgePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#103C2D",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E5642",
    marginBottom: 12,
  },
  badgePillText: {
    color: "#D1FAE5",
    fontSize: 12.5,
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  pageSubtitle: {
    fontSize: 15.5,
    color: "#D1D5DB",
    lineHeight: 23,
    maxWidth: 760,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 56,
  },
  contentStack: {
    gap: 24,
  },
  complianceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 10,
  },
  cardHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  bodyParagraph: {
    fontSize: 13.5,
    color: "#374151",
    lineHeight: 21,
  },
  infoGrid: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  infoLine: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
  trecButtonsGroup: {
    gap: 12,
    marginTop: 6,
  },
  trecActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 12,
  },
  trecBtnTitle: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#164E3A",
  },
  trecBtnSub: {
    fontSize: 12,
    color: "#065F46",
    marginTop: 2,
  },
  equalHousingBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#164E3A",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  equalHousingBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
});
