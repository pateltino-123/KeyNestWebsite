import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  ShieldCheck,
  Calendar,
  Award,
  ArrowRight,
  Target,
  Wrench,
  Users,
  Building,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";

export default function WhyKeyNestPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
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
      keynest: "0% markup passed through at exact invoiced cost",
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

  const pillars = [
    {
      title: "Single Point of Decision-Making",
      desc: "You have direct access to Dinesh Donthula and Purvang Patel. No junior account reps, no frustrating call center ticket queues.",
      icon: Users,
    },
    {
      title: "Zero Hidden Maintenance Markups",
      desc: "Every repair invoice is uploaded unedited to your AppFolio ledger at exact cost. We never take kickbacks from contractors.",
      icon: Wrench,
    },
    {
      title: "Objective Fair Housing Screening",
      desc: "Clear published guidelines protecting your investment while upholding the law. 3x income ratio, full credit history, and nationwide criminal checks.",
      icon: Target,
    },
    {
      title: "AppFolio Financial Precision",
      desc: "Bank-grade portal with direct ACH disbursements around the 10th of every month and automated year-end 1099 tax packages.",
      icon: Award,
    },
    {
      title: "Active Texas Broker Supervision",
      desc: "Operating strictly under Fair Deal Realty Inc., maintaining broker trust accounts and TREC standardized agreements.",
      icon: Building,
    },
  ];

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#367A5E" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Why Owners Choose KeyNest</Text>
          <Text style={styles.pageSubtitle}>
            Proven operational discipline over unverified marketing hype. Built by local investors, for North Texas rental owners.
          </Text>
        </View>
      </View>

      {/* 1. The 5 Core Pillars */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>OUR OPERATING FOUNDATION</Text>
            <Text style={styles.sectionTitle}>Five Pillars of Disciplined Property Management</Text>
            <Text style={styles.sectionSubtitle}>
              Every system at KeyNest is designed to minimize vacancy, eliminate accounting surprises, and protect your capital asset.
            </Text>
          </View>

          <View
            style={[
              styles.pillarsGrid,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            {pillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <View
                  key={idx}
                  style={[
                    styles.pillarCard,
                    { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                  ]}
                >
                  <View style={styles.pillarIconBox}>
                    <Icon size={22} color="#367A5E" />
                  </View>
                  <Text style={styles.pillarTitle}>{pil.title}</Text>
                  <Text style={styles.pillarDesc}>{pil.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* 2. Detailed 3-Way Comparison Table */}
      <View style={styles.sectionAlt}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>THE HONEST COMPARISON</Text>
            <Text style={styles.sectionTitle}>KeyNest vs. Alternatives</Text>
            <Text style={styles.sectionSubtitle}>
              See how our transparent local model stacks up against self-management and corporate mega-franchises.
            </Text>
          </View>

          <View style={styles.tableWrapper}>
            {comparisonRows.map((row, idx) => (
              <View key={idx} style={[styles.tableRow, idx % 2 === 0 && styles.tableRowAlt]}>
                <Text style={styles.tableFeatureCol}>{row.feature}</Text>
                <View style={[styles.tableColGroup, { flexDirection: isDesktop ? "row" : "column" }]}>
                  <View style={styles.tableCol}>
                    <Text style={styles.colLabel}>Self-Management</Text>
                    <Text style={styles.colValText}>{row.self}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.colLabel}>Mega-Franchise</Text>
                    <Text style={styles.colValText}>{row.mega}</Text>
                  </View>
                  <View style={[styles.tableCol, styles.tableColKeynest]}>
                    <Text style={styles.colLabelKeynest}>KeyNest Realty</Text>
                    <Text style={styles.colValTextKeynest}>{row.keynest}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 3. Four Core Owner Guarantees */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>PEACE OF MIND</Text>
            <Text style={styles.sectionTitle}>KeyNest Four-Point Owner Guarantees</Text>
            <Text style={styles.sectionSubtitle}>
              Specific commitments backed by clear operational policies.
            </Text>
          </View>

          <View
            style={[
              styles.guaranteesGrid,
              { flexDirection: isDesktop ? "row" : "column" },
            ]}
          >
            <View style={styles.guaranteeCard}>
              <View style={styles.guaranteeNumber}>
                <Text style={styles.guaranteeNumText}>1</Text>
              </View>
              <Text style={styles.guaranteeTitle}>21-Day Placement Commitment</Text>
              <Text style={styles.guaranteeDesc}>
                If we do not procure a qualified applicant within 21 days of active marketing at agreed pricing, your first month{"'"}s management fee is free.
              </Text>
            </View>

            <View style={styles.guaranteeCard}>
              <View style={styles.guaranteeNumber}>
                <Text style={styles.guaranteeNumText}>2</Text>
              </View>
              <Text style={styles.guaranteeTitle}>Eviction Shield Protection</Text>
              <Text style={styles.guaranteeDesc}>
                If a tenant placed under our published criteria defaults within the first 6 months, we replace them for $0 additional leasing fee.
              </Text>
            </View>

            <View style={styles.guaranteeCard}>
              <View style={styles.guaranteeNumber}>
                <Text style={styles.guaranteeNumText}>3</Text>
              </View>
              <Text style={styles.guaranteeTitle}>0% Maintenance Markup</Text>
              <Text style={styles.guaranteeDesc}>
                Every invoice from third-party plumbers, HVAC techs, and handymen is passed through to you at exact dollar cost.
              </Text>
            </View>

            <View style={styles.guaranteeCard}>
              <View style={styles.guaranteeNumber}>
                <Text style={styles.guaranteeNumText}>4</Text>
              </View>
              <Text style={styles.guaranteeTitle}>$0 Vacancy Charge Policy</Text>
              <Text style={styles.guaranteeDesc}>
                Zero monthly management fees are assessed when your home is between tenancies. Our revenue is 100% tied to collected rent.
              </Text>
            </View>
          </View>

          <View style={styles.ctaBottomRow}>
            <TouchableOpacity style={styles.primaryCtaBtn} onPress={() => openRentalAnalysis()}>
              <Text style={styles.primaryCtaText}>Get a Free Rental Analysis</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryCtaBtn} onPress={openConsultation}>
              <Calendar size={16} color="#22252A" />
              <Text style={styles.secondaryCtaText}>Schedule Consultation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  headerHero: {
    backgroundColor: "#FDFBF7",
    paddingVertical: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
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
    backgroundColor: "#EDF5F1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C7E0D3",
    marginBottom: 16,
  },
  badgePillText: {
    color: "#285C47",
    fontSize: 12.5,
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#22252A",
    letterSpacing: -1,
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 16.5,
    color: "#4A515A",
    maxWidth: 760,
    lineHeight: 25,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 72,
  },
  sectionAlt: {
    backgroundColor: "#F7F3EB",
    paddingVertical: 72,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    marginBottom: 48,
    textAlign: "center",
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#367A5E",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#22252A",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#4A515A",
    maxWidth: 720,
    textAlign: "center",
    lineHeight: 24,
  },
  pillarsGrid: {
    gap: 24,
    justifyContent: "space-between",
  },
  pillarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 26,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 12,
    shadowColor: "#22252A",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  pillarIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EDF5F1",
    justifyContent: "center",
    alignItems: "center",
  },
  pillarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#22252A",
  },
  pillarDesc: {
    fontSize: 14,
    color: "#4A515A",
    lineHeight: 21,
  },
  tableWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    overflow: "hidden",
  },
  tableRow: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
    gap: 12,
  },
  tableRowAlt: {
    backgroundColor: "#FAF7F0",
  },
  tableFeatureCol: {
    fontSize: 16,
    fontWeight: "800",
    color: "#22252A",
  },
  tableColGroup: {
    gap: 12,
  },
  tableCol: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 4,
  },
  tableColKeynest: {
    backgroundColor: "#EDF5F1",
    borderColor: "#C7E0D3",
  },
  colLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#737B85",
  },
  colLabelKeynest: {
    fontSize: 11,
    fontWeight: "800",
    color: "#285C47",
  },
  colValText: {
    fontSize: 13,
    color: "#4A515A",
    lineHeight: 18,
  },
  colValTextKeynest: {
    fontSize: 13,
    fontWeight: "700",
    color: "#285C47",
    lineHeight: 18,
  },
  guaranteesGrid: {
    gap: 20,
    marginBottom: 40,
  },
  guaranteeCard: {
    flex: 1,
    backgroundColor: "#FAF7F0",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    padding: 24,
    gap: 10,
  },
  guaranteeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#367A5E",
    justifyContent: "center",
    alignItems: "center",
  },
  guaranteeNumText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  guaranteeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#22252A",
  },
  guaranteeDesc: {
    fontSize: 13.5,
    color: "#4A515A",
    lineHeight: 20,
  },
  ctaBottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 14,
  },
  primaryCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#367A5E",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  secondaryCtaText: {
    color: "#22252A",
    fontSize: 15,
    fontWeight: "700",
  },
});
