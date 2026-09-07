import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  ShieldCheck,
  Calendar,
  Award,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";

export default function WhyKeyNestPage() {
  const { openConsultation, openRentalAnalysis } = useWebsiteModals();

  const comparisonRows = [
    {
      feature: "Dedicated Local Manager (Single Point of Contact)",
      self: "You handle all midnight calls, repairs, and tenant disputes",
      mega: "Call center routing; talk to a different rep each month",
      keynest: "Direct access to authorized managers (Dinesh & Purvang)",
    },
    {
      feature: "Maintenance Coordination & Markups",
      self: "You search Angie/Yelp with unvetted pricing",
      mega: "10%–20% hidden markup added to third-party invoices",
      keynest: "0% markup passed through at exact cost with photo proof",
    },
    {
      feature: "Tenant Screening Standard",
      self: "Basic gut feeling or unverified online reports",
      mega: "Automated credit score pass/fail with little human review",
      keynest: "Published Fair Housing criteria: 3x rent, criminal, rental history",
    },
    {
      feature: "Accounting & Distribution Timing",
      self: "Manual checks, Zelle, spreadsheet tracking",
      mega: "Delayed disbursements (often past the 15th of the month)",
      keynest: "Direct ACH disbursements around the 10th via AppFolio",
    },
    {
      feature: "Broker Regulatory Oversight",
      self: "High legal risk regarding security deposit rules",
      mega: "Distant corporate brokerage headquarters",
      keynest: "Active TREC supervision under local Fair Deal Realty Inc.",
    },
    {
      feature: "Vacancy Fees",
      self: "Mortgage unpaid while searching for tenants",
      mega: "Often charged monthly administrative fees during vacancy",
      keynest: "$0 management fee when vacant — we only earn when you earn",
    },
  ];

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Why Owners Choose KeyNest</Text>
          <Text style={styles.pageSubtitle}>
            Proven operational discipline over unverified marketing hype. Built by investors, for North Texas rental owners.
          </Text>
        </View>
      </View>

      {/* 1. The 5 Core Pillars (Slide 5 requirements) */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>OUR OPERATING FOUNDATION</Text>
            <Text style={styles.sectionTitle}>Five Pillars of Disciplined Property Management</Text>
            <Text style={styles.sectionSubtitle}>
              Every system at KeyNest is designed to minimize vacancy, eliminate accounting surprises, and protect your capital asset.
            </Text>
          </View>

          <View style={styles.pillarsGrid}>
            <View style={styles.pillarCard}>
              <View style={styles.pillarNumberBadge}>
                <Text style={styles.pillarNumberText}>1</Text>
              </View>
              <Text style={styles.pillarTitle}>Single Point of Owner Communication</Text>
              <Text style={styles.pillarDesc}>
                You deal directly with our authorized managers—Dinesh Donthula and Purvang Patel. No automated phone trees, no junior ticket-loggers, and no passing the buck.
              </Text>
            </View>

            <View style={styles.pillarCard}>
              <View style={styles.pillarNumberBadge}>
                <Text style={styles.pillarNumberText}>2</Text>
              </View>
              <Text style={styles.pillarTitle}>Documented Operating Workflows</Text>
              <Text style={styles.pillarDesc}>
                We follow our documented 7-stage lifecycle and 6-step maintenance escalation rules. Every inspection, turnaround, and vendor dispatch adheres to defined standards.
              </Text>
            </View>

            <View style={styles.pillarCard}>
              <View style={styles.pillarNumberBadge}>
                <Text style={styles.pillarNumberText}>3</Text>
              </View>
              <Text style={styles.pillarTitle}>AppFolio Modern Portals & Reporting</Text>
              <Text style={styles.pillarDesc}>
                Real-time visibility into income, itemized expenses, work order photo proof, digital leases, and direct monthly ACH distributions straight to your bank account.
              </Text>
            </View>

            <View style={styles.pillarCard}>
              <View style={styles.pillarNumberBadge}>
                <Text style={styles.pillarNumberText}>4</Text>
              </View>
              <Text style={styles.pillarTitle}>Vetted Local Contractor Network</Text>
              <Text style={styles.pillarDesc}>
                We coordinate with thoroughly vetted, licensed, and insured North Texas trades. We charge 0% maintenance markup, passing contractor savings directly to owners.
              </Text>
            </View>

            <View style={styles.pillarCard}>
              <View style={styles.pillarNumberBadge}>
                <Text style={styles.pillarNumberText}>5</Text>
              </View>
              <Text style={styles.pillarTitle}>Broker-Supervised Compliance</Text>
              <Text style={styles.pillarDesc}>
                Under Fair Deal Realty Inc., your leases, trust-account procedures, and advertising are strictly compliant with Texas Real Estate Commission (TREC) laws.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Side-by-Side Comparison Matrix */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>COMPARE YOUR OPTIONS</Text>
            <Text style={styles.sectionTitle}>Self-Managing vs. Mega-Franchise vs. KeyNest</Text>
            <Text style={styles.sectionSubtitle}>
              See how our transparent local boutique model protects your time, sanity, and cash flow.
            </Text>
          </View>

          <View style={styles.comparisonTable}>
            <View style={styles.tableHead}>
              <Text style={[styles.headCell, { width: "28%" }]}>FEATURE / POLICY</Text>
              <Text style={[styles.headCell, { width: "24%" }]}>DIY SELF-MANAGEMENT</Text>
              <Text style={[styles.headCell, { width: "24%" }]}>MEGA-FRANCHISE</Text>
              <Text style={[styles.headCellHighlight, { width: "24%" }]}>KEYNEST REALTY</Text>
            </View>

            {comparisonRows.map((row, i) => (
              <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.featureCell, { width: "28%" }]}>{row.feature}</Text>
                <Text style={[styles.cellText, { width: "24%" }]}>{row.self}</Text>
                <Text style={[styles.cellText, { width: "24%" }]}>{row.mega}</Text>
                <Text style={[styles.cellTextHighlight, { width: "24%" }]}>{row.keynest}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 3. Operational Sign-Off CTA Banner */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.consultationCalloutCard}>
            <Award size={36} color="#164E3A" />
            <Text style={styles.calloutTitle}>Ready for Transparent Management You Can Rely On?</Text>
            <Text style={styles.calloutText}>
              Book a direct consultation with Dinesh Donthula or Purvang Patel. We will review your {"property's"} specific numbers, discuss local HOA considerations, and walk you through our onboarding timeline.
            </Text>
            <View style={styles.calloutBtnRow}>
              <TouchableOpacity style={styles.calloutPrimaryBtn} onPress={openConsultation}>
                <Calendar size={18} color="#FFFFFF" />
                <Text style={styles.calloutPrimaryBtnText}>Schedule a Consultation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.calloutSecondaryBtn}
                onPress={() => openRentalAnalysis()}
              >
                <Text style={styles.calloutSecondaryBtnText}>Get Free Rental Analysis</Text>
              </TouchableOpacity>
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
    maxWidth: 1240,
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
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#D1D5DB",
    lineHeight: 24,
    maxWidth: 720,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 64,
  },
  sectionLight: {
    backgroundColor: "#F8FAF9",
    paddingVertical: 64,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 40,
    gap: 8,
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F261E",
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: "#4B5563",
    maxWidth: 680,
    textAlign: "center",
    lineHeight: 22,
  },
  pillarsGrid: {
    gap: 16,
    maxWidth: 900,
    marginHorizontal: "auto",
    width: "100%",
  },
  pillarCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    gap: 16,
    alignItems: "flex-start",
  },
  pillarNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#164E3A",
    justifyContent: "center",
    alignItems: "center",
  },
  pillarNumberText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  pillarTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  pillarDesc: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
    flex: 1,
  },
  comparisonTable: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headCell: {
    color: "#E5E7EB",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  headCellHighlight: {
    color: "#34D399",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "flex-start",
  },
  tableRowAlt: {
    backgroundColor: "#F9FAFB",
  },
  featureCell: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    paddingRight: 10,
  },
  cellText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
    paddingRight: 10,
  },
  cellTextHighlight: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#166534",
    lineHeight: 17,
    paddingRight: 10,
  },
  consultationCalloutCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: 36,
    alignItems: "center",
    textAlign: "center",
    gap: 12,
    maxWidth: 800,
    marginHorizontal: "auto",
    width: "100%",
  },
  calloutTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F261E",
    textAlign: "center",
  },
  calloutText: {
    fontSize: 14.5,
    color: "#065F46",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 620,
  },
  calloutBtnRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
  calloutPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#164E3A",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  calloutPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  calloutSecondaryBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#164E3A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  calloutSecondaryBtnText: {
    color: "#164E3A",
    fontSize: 14,
    fontWeight: "700",
  },
});
