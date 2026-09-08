import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Camera,
  Search,
  FileCheck,
  FileSignature,
  CreditCard,
  Wrench,
  ClipboardList,
  Calendar,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import { SERVICE_LIFECYCLE } from "@/constants/keynestData";

export default function ServicesPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { openRentalAnalysis, openConsultation } = useWebsiteModals();
  const [activeStage, setActiveStage] = useState(1);

  const stageIcons = [Camera, Search, FileCheck, FileSignature, CreditCard, Wrench, ClipboardList];

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#38BDF8" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Full Management Lifecycle</Text>
          <Text style={styles.pageSubtitle}>
            What happens before, during, and after tenancy. A documented 7-stage operational workflow designed for North Texas property owners.
          </Text>
        </View>
      </View>

      {/* 7-Stage Interactive Navigator */}
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

          {/* Detailed All 7 Stages Cards */}
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
                      <Clock size={12} color="#2563EB" />
                      <Text style={styles.slaBadgeText}>{stage.sla}</Text>
                    </View>
                  </View>

                  <View style={styles.stageTitleRow}>
                    <View style={styles.iconCircle}>
                      <Icon size={22} color="#2563EB" />
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

                    {/* Right Column: Governance */}
                    <View style={[styles.detailBoxRight, { width: isDesktop ? "49%" : "100%" }]}>
                      <Text style={styles.detailLabelBlue}>WEBSITE DETAILS & GOVERNANCE</Text>
                      <Text style={styles.detailText}>{stage.websiteDetails}</Text>
                    </View>
                  </View>

                  {isHighlighted && (
                    <View style={styles.stageActionRow}>
                      <TouchableOpacity
                        style={styles.stageCtaBtn}
                        onPress={() => openRentalAnalysis()}
                      >
                        <Text style={styles.stageCtaBtnText}>Request Review for This Stage</Text>
                        <ArrowRight size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stageSecondaryBtn}
                        onPress={openConsultation}
                      >
                        <Calendar size={14} color="#0F172A" />
                        <Text style={styles.stageSecondaryBtnText}>Ask Questions</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Owner Governance CTA Banner */}
      <View style={styles.bottomBanner}>
        <View style={styles.innerContainer}>
          <View style={[styles.bottomBannerRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bottomBannerTitle}>Ready to Experience Disciplined Management?</Text>
              <Text style={styles.bottomBannerSub}>
                Talk directly with Dinesh Donthula and Purvang Patel about your North Texas rental home.
              </Text>
            </View>
            <View style={styles.bottomBannerButtons}>
              <TouchableOpacity
                style={styles.bottomPrimaryBtn}
                onPress={() => openRentalAnalysis()}
              >
                <Text style={styles.bottomPrimaryBtnText}>Get a Free Rental Analysis</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomSecondaryBtn}
                onPress={openConsultation}
              >
                <Text style={styles.bottomSecondaryBtnText}>Schedule Consultation</Text>
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
    fontSize: 40,
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
  sectionIntroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 36,
    flexWrap: "wrap",
    gap: 16,
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 1,
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },
  analysisBtnTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  analysisBtnTopText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  stageTabsContainer: {
    marginBottom: 36,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 12,
  },
  stageTabsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stageTabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  stageTabItemActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  tabNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  tabNumberCircleActive: {
    backgroundColor: "#2563EB",
  },
  tabNumberText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
  },
  tabNumberTextActive: {
    color: "#FFFFFF",
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  tabLabelActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  stagesList: {
    gap: 24,
  },
  lifecycleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 24,
    gap: 16,
  },
  lifecycleCardHighlighted: {
    borderColor: "#2563EB",
    borderWidth: 2,
    shadowColor: "#2563EB",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stageNumberBadge: {
    backgroundColor: "#0F172A",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  stageNumberBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  slaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  slaBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  stageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  stageMainTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
  },
  stageAudience: {
    fontSize: 12.5,
    color: "#64748B",
    marginTop: 2,
  },
  twoColDetails: {
    justifyContent: "space-between",
    gap: 16,
  },
  detailBoxLeft: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  detailBoxRight: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    letterSpacing: 0.6,
  },
  detailLabelBlue: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E40AF",
    letterSpacing: 0.6,
  },
  detailText: {
    fontSize: 13.5,
    color: "#334155",
    lineHeight: 20,
  },
  stageActionRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 8,
  },
  stageCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  stageCtaBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  stageSecondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  stageSecondaryBtnText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "600",
  },
  bottomBanner: {
    backgroundColor: "#0B1120",
    paddingVertical: 60,
  },
  bottomBannerRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 28,
  },
  bottomBannerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  bottomBannerSub: {
    fontSize: 15,
    color: "#94A3B8",
  },
  bottomBannerButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  bottomPrimaryBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  bottomPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomSecondaryBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#334155",
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  bottomSecondaryBtnText: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
  },
});
