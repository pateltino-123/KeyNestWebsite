import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ShieldCheck,
  CreditCard,
  Wrench,
  ExternalLink,
  AlertTriangle,
  PhoneCall,
  Lock,
  ArrowRight,
  Scale,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import {
  KEYNEST_INFO,
  RENTAL_CRITERIA_POINTS,
  MAINTENANCE_STEPS,
} from "@/constants/keynestData";

export default function TenantsPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { openMaintenanceTriage } = useWebsiteModals();

  const openResidentPortal = () => {
    Linking.openURL(KEYNEST_INFO.appFolioTenantPortalUrl).catch(() => {});
  };

  const callEmergency = () => {
    Linking.openURL(`tel:${KEYNEST_INFO.emergencyPhone.replace(/[^0-9]/g, "")}`).catch(() => {});
  };

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Tenant & Resident Center</Text>
          <Text style={styles.pageSubtitle}>
            Pay rent online, submit 24/7 maintenance requests, review published rental selection criteria, and access your digital lease records.
          </Text>
        </View>
      </View>

      {/* 1. AppFolio Resident Portal Quick Actions Banner */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={[styles.portalBox, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={{ flex: 1, gap: 10 }}>
              <View style={styles.portalTag}>
                <CreditCard size={12} color="#059669" />
                <Text style={styles.portalTagText}>APPFOLIO RESIDENT PORTAL</Text>
              </View>
              <Text style={styles.portalTitle}>Manage Your Rent & Lease Online</Text>
              <Text style={styles.portalDesc}>
                Set up recurring zero-fee ACH autopay, view real-time account balances and payment receipts, download your signed Texas residential lease, and track maintenance tickets.
              </Text>
              <View style={styles.portalPillsRow}>
                <Text style={styles.portalPill}>✓ Autopay & Zero-Fee ACH</Text>
                <Text style={styles.portalPill}>✓ 24/7 Work Order Tracking</Text>
                <Text style={styles.portalPill}>✓ Official Notices & Documents</Text>
              </View>
            </View>

            <View style={styles.portalActionCol}>
              <TouchableOpacity
                style={styles.openPortalPrimaryBtn}
                onPress={openResidentPortal}
                activeOpacity={0.85}
              >
                <Text style={styles.openPortalPrimaryText}>Log In to AppFolio Resident Portal</Text>
                <ExternalLink size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.browseRentalsSecondaryBtn}
                onPress={() => router.push("/rentals" as never)}
              >
                <Text style={styles.browseRentalsSecondaryText}>Looking for a Home? Search Rentals →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 2. 6-Step Maintenance Escalation Workflow (Slide 7) */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>STANDARDIZED OPERATIONAL PROCESS</Text>
            <Text style={styles.sectionTitle}>6-Step Maintenance Escalation Rules</Text>
            <Text style={styles.sectionSubtitle}>
              Every repair request follows a defined workflow to ensure rapid triage, verified spending limits, and quality craftsmanship.
            </Text>
          </View>

          {/* Emergency Alert Hotline Callout */}
          <View style={styles.emergencyHotlineBanner}>
            <View style={styles.hotlineLeft}>
              <AlertTriangle size={24} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={styles.hotlineTitle}>Experiencing an Emergency Maintenance Issue?</Text>
                <Text style={styles.hotlineSub}>
                  Active flooding, smell of gas, loss of heat during freeze warnings (&lt;32°F), or electrical hazards.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callHotlineBtn} onPress={callEmergency}>
              <PhoneCall size={16} color="#FFFFFF" />
              <Text style={styles.callHotlineBtnText}>Call Dispatch: {KEYNEST_INFO.emergencyPhone}</Text>
            </TouchableOpacity>
          </View>

          {/* The 6 Steps Visual */}
          <View style={styles.stepsGrid}>
            {MAINTENANCE_STEPS.map((s) => (
              <View key={s.step} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{s.step}</Text>
                  </View>
                  <Text style={styles.stepChannelTag}>{s.channel}</Text>
                </View>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepDesc}>{s.description}</Text>
              </View>
            ))}
          </View>

          <View style={styles.triageActionRow}>
            <TouchableOpacity
              style={styles.launchTriageWizardBtn}
              onPress={openMaintenanceTriage}
            >
              <Wrench size={18} color="#FFFFFF" />
              <Text style={styles.launchTriageWizardBtnText}>Open Maintenance Triage Wizard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. Published Rental Selection Criteria (Fair Housing Compliant, Slide 6 & 8) */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>OBJECTIVE & FAIR HOUSING COMPLIANT</Text>
            <Text style={styles.sectionTitle}>Published Rental Selection Criteria</Text>
            <Text style={styles.sectionSubtitle}>
              In accordance with Texas Property Code and Fair Housing laws, our qualification criteria are published and applied consistently across all applicants.
            </Text>
          </View>

          <View style={styles.criteriaList}>
            {RENTAL_CRITERIA_POINTS.map((crit, idx) => (
              <View key={idx} style={styles.criteriaCard}>
                <View style={styles.criteriaCardTop}>
                  <Scale size={18} color="#164E3A" />
                  <Text style={styles.criteriaTitle}>{crit.title}</Text>
                </View>
                <Text style={styles.criteriaRequirement}>{crit.requirement}</Text>
                <Text style={styles.criteriaDetails}>{crit.details}</Text>
              </View>
            ))}
          </View>

          {/* Secure Application Note */}
          <View style={styles.securityHandoffBox}>
            <Lock size={20} color="#164E3A" />
            <View style={{ flex: 1 }}>
              <Text style={styles.securityHandoffTitle}>Secure Application Protocol</Text>
              <Text style={styles.securityHandoffText}>
                To protect your identity and private personal information, KeyNest never collects Social Security numbers, bank account logins, or credit screening data through standard public web forms. All rental applications are submitted through our encrypted AppFolio leasing platform.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.browseHomesCta}
              onPress={() => router.push("/rentals" as never)}
            >
              <Text style={styles.browseHomesCtaText}>View Available Homes</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </TouchableOpacity>
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
    paddingVertical: 56,
  },
  portalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#10B981",
    padding: 28,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    shadowColor: "#059669",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  portalTag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  portalTagText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#065F46",
    letterSpacing: 0.5,
  },
  portalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  portalDesc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
  },
  portalPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  portalPill: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
    backgroundColor: "#F0FDF4",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  portalActionCol: {
    gap: 10,
    minWidth: 260,
  },
  openPortalPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#164E3A",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  openPortalPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  browseRentalsSecondaryBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  browseRentalsSecondaryText: {
    color: "#164E3A",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeaderCentered: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 36,
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
  emergencyHotlineBanner: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 28,
  },
  hotlineLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
    minWidth: 280,
  },
  hotlineTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#991B1B",
  },
  hotlineSub: {
    fontSize: 12.5,
    color: "#B91C1C",
    lineHeight: 17,
  },
  callHotlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  callHotlineBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  stepsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    width: "31.5%",
    minWidth: 240,
    gap: 8,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#164E3A",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  stepChannelTag: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  stepDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  triageActionRow: {
    alignItems: "center",
    marginTop: 28,
  },
  launchTriageWizardBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#164E3A",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  launchTriageWizardBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  criteriaList: {
    gap: 14,
    maxWidth: 900,
    marginHorizontal: "auto",
    width: "100%",
  },
  criteriaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    gap: 6,
  },
  criteriaCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  criteriaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  criteriaRequirement: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#164E3A",
    lineHeight: 19,
  },
  criteriaDetails: {
    fontSize: 12.5,
    color: "#6B7280",
    lineHeight: 18,
  },
  securityHandoffBox: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    marginTop: 32,
    maxWidth: 900,
    marginHorizontal: "auto",
  },
  securityHandoffTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#164E3A",
  },
  securityHandoffText: {
    fontSize: 12.5,
    color: "#065F46",
    lineHeight: 18,
    marginTop: 2,
  },
  browseHomesCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#164E3A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  browseHomesCtaText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
