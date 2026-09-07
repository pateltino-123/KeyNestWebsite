import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Clock,
  Camera,
  Search,
  FileCheck,
  FileSignature,
  CreditCard,
  Wrench,
  ClipboardList,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import { SERVICE_LIFECYCLE } from "@/constants/keynestData";

export default function ServicesPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { openRentalAnalysis } = useWebsiteModals();
  const [activeStage, setActiveStage] = useState(1);

  const stageIcons = [Camera, Search, FileCheck, FileSignature, CreditCard, Wrench, ClipboardList];

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Full Management Lifecycle</Text>
          <Text style={styles.pageSubtitle}>
            What happens before, during, and after tenancy. A documented 7-stage operational workflow designed for North Texas property owners.
          </Text>
        </View>
      </View>

      {/* 7-Stage Interactive Navigator / Lifecycle Section */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionIntroRow}>
            <View>
              <Text style={styles.sectionOverline}>END-TO-END OPERATING DISCIPLINE</Text>
              <Text style={styles.sectionHeading}>The Seven Lifecycle Stages</Text>
            </View>
            <TouchableOpacity
              style={styles.analysisBtnTop}
              onPress={() => openRentalAnalysis()}
            >
              <Text style={styles.analysisBtnTopText}>Get a Free Rental Analysis</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Stage Selector Bar */}
          <View style={styles.stageTabsContainer}>
            <View style={styles.stageTabsRow}>
              {SERVICE_LIFECYCLE.map((stage) => {
                const isActive = stage.stageNumber === activeStage;
                return (
                  <TouchableOpacity
                    key={stage.stageNumber}
                    style={[styles.stageTabItem, isActive && styles.stageTabItemActive]}
                    onPress={() => setActiveStage(stage.stageNumber)}
                  >
                    <View
                      style={[
                        styles.tabNumberCircle,
                        isActive && styles.tabNumberCircleActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabNumberText,
                          isActive && styles.tabNumberTextActive,
                        ]}
                      >
                        {stage.stageNumber}
                      </Text>
                    </View>
                    <Text
                      style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                      numberOfLines={1}
                    >
                      {stage.title.split(" ")[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Detailed All 7 Stages Cards (Slide 6 breakdown) */}
          <View style={styles.stagesList}>
            {SERVICE_LIFECYCLE.map((stage, idx) => {
              const Icon = stageIcons[idx] || CheckCircle2;
              const isHighlighted = stage.stageNumber === activeStage;
              return (
                <View
                  key={stage.stageNumber}
                  style={[
                    styles.lifecycleCard,
                    isHighlighted && styles.lifecycleCardHighlighted,
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.stageNumberBadge}>
                      <Text style={styles.stageNumberBadgeText}>STAGE {stage.stageNumber}</Text>
                    </View>
                    <View style={styles.slaBadge}>
                      <Clock size={12} color="#059669" />
                      <Text style={styles.slaBadgeText}>{stage.sla}</Text>
                    </View>
                  </View>

                  <View style={styles.stageTitleRow}>
                    <View style={styles.iconCircle}>
                      <Icon size={22} color="#164E3A" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stageMainTitle}>{stage.title}</Text>
                      <Text style={styles.stageAudience}>Primary Audience: {stage.audience}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.twoColDetails,
                      { flexDirection: isDesktop ? "row" : "column" },
                    ]}
                  >
                    {/* Left Column: KeyNest Activities */}
                    <View style={[styles.detailBoxLeft, { width: isDesktop ? "49%" : "100%" }]}>
                      <Text style={styles.detailLabel}>KEYNEST OPERATIONAL ACTIVITIES</Text>
                      <Text style={styles.detailText}>{stage.keynestActivities}</Text>
                    </View>

                    {/* Right Column: Website & Compliance Disclosures */}
                    <View style={[styles.detailBoxRight, { width: isDesktop ? "49%" : "100%" }]}>
                      <Text style={styles.detailLabelGreen}>WEBSITE DETAILS & GOVERNANCE</Text>
                      <Text style={styles.detailText}>{stage.websiteDetails}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Slide 6 Mandatory Legal Footnote */}
          <View style={styles.legalFootnoteCard}>
            <Info size={20} color="#164E3A" />
            <Text style={styles.legalFootnoteText}>
              <Text style={{ fontWeight: "700" }}>Statutory Compliance Note:</Text> This website describes KeyNest’s standard operational workflows. All contractual obligations, owner spending thresholds, and landlord-tenant duties remain governed by broker-approved Texas REALTORS® Property Management Agreements and Residential Leases under Fair Deal Realty Inc.
            </Text>
          </View>
        </View>
      </View>

      {/* Comparison & CTA Section */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={[styles.ctaBannerRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ctaBannerOverline}>TAKE THE NEXT STEP</Text>
              <Text style={styles.ctaBannerTitle}>Review Pricing or Request a Free Rental Comps Report</Text>
              <Text style={styles.ctaBannerSub}>
                We calculate accurate market rent based on verified recent closed leases in your exact neighborhood.
              </Text>
            </View>
            <View style={styles.ctaButtonGroup}>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={() => openRentalAnalysis()}
              >
                <Text style={styles.primaryActionBtnText}>Get Free Rental Analysis</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryActionBtn}
                onPress={() => router.push("/pricing" as never)}
              >
                <Text style={styles.secondaryActionBtnText}>Compare Pricing Plans</Text>
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
    paddingVertical: 56,
  },
  sectionIntroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F261E",
    letterSpacing: -0.5,
  },
  analysisBtnTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#164E3A",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 7,
  },
  analysisBtnTopText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  stageTabsContainer: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 6,
    marginBottom: 32,
    overflow: "hidden",
  },
  stageTabsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  stageTabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  stageTabItemActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  tabNumberCircleActive: {
    backgroundColor: "#164E3A",
  },
  tabNumberText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
  },
  tabNumberTextActive: {
    color: "#FFFFFF",
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabLabelActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  stagesList: {
    gap: 24,
  },
  lifecycleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24,
    gap: 16,
  },
  lifecycleCardHighlighted: {
    borderColor: "#164E3A",
    borderWidth: 2,
    shadowColor: "#164E3A",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stageNumberBadge: {
    backgroundColor: "#ECFDF5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  stageNumberBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#065F46",
    letterSpacing: 0.6,
  },
  slaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F9FAFB",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  slaBadgeText: {
    fontSize: 11.5,
    color: "#059669",
    fontWeight: "600",
  },
  stageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  stageMainTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },
  stageAudience: {
    fontSize: 12.5,
    color: "#6B7280",
    marginTop: 2,
  },
  twoColDetails: {
    justifyContent: "space-between",
    gap: 16,
  },
  detailBoxLeft: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  detailBoxRight: {
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#4B5563",
    letterSpacing: 0.6,
  },
  detailLabelGreen: {
    fontSize: 11,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.6,
  },
  detailText: {
    fontSize: 13.5,
    color: "#374151",
    lineHeight: 20,
  },
  legalFootnoteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 36,
  },
  legalFootnoteText: {
    fontSize: 12.5,
    color: "#4B5563",
    lineHeight: 18,
    flex: 1,
  },
  ctaBannerRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
  },
  ctaBannerOverline: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 1,
    marginBottom: 4,
  },
  ctaBannerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F261E",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  ctaBannerSub: {
    fontSize: 14.5,
    color: "#4B5563",
    maxWidth: 620,
    lineHeight: 21,
  },
  ctaButtonGroup: {
    gap: 10,
    minWidth: 240,
  },
  primaryActionBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: "center",
  },
  primaryActionBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryActionBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 7,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryActionBtnText: {
    color: "#374151",
    fontSize: 13.5,
    fontWeight: "600",
  },
});
