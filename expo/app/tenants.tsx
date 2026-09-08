import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from "react-native";
import {
  ShieldCheck,
  CreditCard,
  Wrench,
  ExternalLink,
  AlertTriangle,
  PhoneCall,
  Scale,
  CheckCircle2,
  Clock,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import {
  KEYNEST_INFO,
  RENTAL_CRITERIA_POINTS,
  MAINTENANCE_STEPS,
} from "@/constants/keynestData";

export default function TenantsPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
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
            <ShieldCheck size={14} color="#367A5E" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Tenant & Resident Center</Text>
          <Text style={styles.pageSubtitle}>
            Pay rent online, submit 24/7 maintenance requests, review published rental selection criteria, and access your digital lease records.
          </Text>
        </View>
      </View>

      {/* 1. AppFolio Resident Portal Banner */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={[styles.portalBox, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={{ flex: 1, gap: 10 }}>
              <View style={styles.portalTag}>
                <CreditCard size={12} color="#367A5E" />
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
                style={styles.portalPayBtn}
                onPress={openResidentPortal}
                activeOpacity={0.85}
              >
                <Text style={styles.portalPayBtnText}>Pay Rent Online (AppFolio)</Text>
                <ExternalLink size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.triageSecondaryBtn}
                onPress={openMaintenanceTriage}
              >
                <Text style={styles.triageSecondaryBtnText}>Submit Maintenance Request →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Maintenance Escalation & 24/7 Triage */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>RAPID REPAIR DISPATCH</Text>
            <Text style={styles.sectionTitle}>Six-Step Maintenance Escalation</Text>
            <Text style={styles.sectionSubtitle}>
              Documented protocol for diagnosing, authorizing, and completing repairs through licensed and insured North Texas technicians.
            </Text>
          </View>

          {/* Emergency Hotline Alert Box */}
          <View style={styles.emergencyBox}>
            <View style={styles.emergencyIconCircle}>
              <AlertTriangle size={24} color="#DC2626" />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.emergencyBoxTitle}>Experiencing an Emergency?</Text>
              <Text style={styles.emergencyBoxText}>
                For fire or gas leaks, evacuate and dial 911. For active burst pipes, main water shutoff, or complete AC loss in extreme heat (&gt;90°F), call our dedicated 24/7 emergency dispatch line.
              </Text>
            </View>
            <TouchableOpacity style={styles.emergencyCallBtn} onPress={callEmergency}>
              <PhoneCall size={16} color="#FFFFFF" />
              <Text style={styles.emergencyCallText}>{KEYNEST_INFO.emergencyPhone}</Text>
            </TouchableOpacity>
          </View>

          {/* 6 Step Cards */}
          <View
            style={[
              styles.stepsGrid,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            {MAINTENANCE_STEPS.map((st) => (
              <View
                key={st.step}
                style={[
                  styles.stepCard,
                  { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                ]}
              >
                <View style={styles.stepNumPill}>
                  <Text style={styles.stepNumText}>STEP {st.step}</Text>
                </View>
                <Text style={styles.stepTitle}>{st.title}</Text>
                <Text style={styles.stepDesc}>{st.description}</Text>
                <View style={styles.stepTimeRow}>
                  <Clock size={12} color="#367A5E" />
                  <Text style={styles.stepTimeText}>{st.channel}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.triageActionWrap}>
            <TouchableOpacity style={styles.triageLaunchBtn} onPress={openMaintenanceTriage}>
              <Wrench size={16} color="#FFFFFF" />
              <Text style={styles.triageLaunchBtnText}>Launch Interactive Maintenance Triage Wizard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. Published Rental Selection Criteria */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>TRANSPARENT & OBJECTIVE STANDARDS</Text>
            <Text style={styles.sectionTitle}>Published Rental Criteria</Text>
            <Text style={styles.sectionSubtitle}>
              Applied uniformly to all adult applicants in compliance with Texas Real Estate Commission and Federal Fair Housing mandates.
            </Text>
          </View>

          <View style={styles.criteriaGrid}>
            {RENTAL_CRITERIA_POINTS.map((crit, idx) => (
              <View key={idx} style={styles.criteriaItem}>
                <View style={styles.criteriaCheckCircle}>
                  <CheckCircle2 size={16} color="#367A5E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.criteriaItemTitle}>{crit.title}</Text>
                  <Text style={styles.criteriaItemDetail}>{crit.details}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.fairHousingBox}>
            <Scale size={20} color="#367A5E" />
            <Text style={styles.fairHousingText}>
              Equal Housing Opportunity: KeyNest Realty and Fair Deal Realty Inc. strictly prohibit discrimination based on race, color, religion, sex, disability, familial status, or national origin.
            </Text>
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
  sectionLight: {
    backgroundColor: "#F7F3EB",
    paddingVertical: 64,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 72,
  },
  portalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    padding: 32,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    shadowColor: "#22252A",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  portalTag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EDF5F1",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  portalTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#285C47",
    letterSpacing: 0.8,
  },
  portalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#22252A",
  },
  portalDesc: {
    fontSize: 14,
    color: "#4A515A",
    lineHeight: 22,
  },
  portalPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  portalPill: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#367A5E",
  },
  portalActionCol: {
    alignItems: "center",
    gap: 10,
  },
  portalPayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#367A5E",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: "#367A5E",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  portalPayBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  triageSecondaryBtn: {
    paddingVertical: 6,
  },
  triageSecondaryBtnText: {
    color: "#367A5E",
    fontSize: 13,
    fontWeight: "700",
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
  emergencyBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 36,
  },
  emergencyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyBoxTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#991B1B",
  },
  emergencyBoxText: {
    fontSize: 13,
    color: "#7F1D1D",
    lineHeight: 19,
  },
  emergencyCallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emergencyCallText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
  stepsGrid: {
    gap: 20,
    justifyContent: "space-between",
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 8,
  },
  stepNumPill: {
    alignSelf: "flex-start",
    backgroundColor: "#FAF7F0",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  stepNumText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#737B85",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22252A",
  },
  stepDesc: {
    fontSize: 13,
    color: "#4A515A",
    lineHeight: 19,
    flex: 1,
  },
  stepTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  stepTimeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#367A5E",
  },
  triageActionWrap: {
    marginTop: 36,
    alignItems: "center",
  },
  triageLaunchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#367A5E",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  triageLaunchBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  criteriaGrid: {
    maxWidth: 900,
    width: "100%",
    marginHorizontal: "auto",
    gap: 14,
  },
  criteriaItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  criteriaCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EDF5F1",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  criteriaItemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#22252A",
    marginBottom: 4,
  },
  criteriaItemDetail: {
    fontSize: 13.5,
    color: "#4A515A",
    lineHeight: 20,
  },
  fairHousingBox: {
    maxWidth: 900,
    width: "100%",
    marginHorizontal: "auto",
    marginTop: 24,
    backgroundColor: "#EDF5F1",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#C7E0D3",
  },
  fairHousingText: {
    fontSize: 12.5,
    color: "#285C47",
    lineHeight: 18,
    flex: 1,
  },
});
