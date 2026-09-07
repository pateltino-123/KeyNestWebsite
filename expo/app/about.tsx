import React from "react";
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
  Building,
  Target,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Award,
  Layers,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import { KEYNEST_INFO } from "@/constants/keynestData";

export default function AboutPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  const { openConsultation, openRentalAnalysis } = useWebsiteModals();

  const coreValues = [
    {
      title: "Radical Transparency",
      desc: "Clear accounting, zero hidden contractor markups, documented property inspections with photos, and real-time AppFolio portal access for owners.",
      icon: Target,
    },
    {
      title: "Reliability & Follow-Through",
      desc: "Standardized operating procedures that guarantee routine maintenance triage within 24–48 hours and emergency coordination around the clock.",
      icon: CheckCircle2,
    },
    {
      title: "Operational Consistency",
      desc: "Fair Housing-compliant tenant screening criteria and Texas REALTORS® standard leases applied uniformly without subjective deviations.",
      icon: Layers,
    },
    {
      title: "Deep Local North Texas Knowledge",
      desc: "Hyper-focused on The Colony, Frisco, Plano, McKinney, Allen, Prosper, and Celina. We know local HOA rules, municipal rental licenses, and true market comps.",
      icon: Compass,
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
          <Text style={styles.pageTitle}>About KeyNest Realty</Text>
          <Text style={styles.pageSubtitle}>
            Simplifying North Texas landlording through disciplined communication, repeatable processes, and modern technology.
          </Text>
        </View>
      </View>

      {/* 1. Mission & Philosophy */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={[styles.splitRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={[styles.splitColLeft, { width: isDesktop ? "52%" : "100%" }]}>
              <Text style={styles.sectionOverline}>OUR MISSION</Text>
              <Text style={styles.sectionHeading}>
                Eliminating Landlord Frustration Through Process Discipline
              </Text>
              <Text style={styles.bodyText}>
                Property management in North Texas often suffers from two extremes: disorganized DIY landlord stress or impersonal mega-franchises where owners are treated like account numbers.
              </Text>
              <Text style={styles.bodyText}>
                KeyNest was established by DoubleDee LLC under the active brokerage oversight of Fair Deal Realty Inc. to bridge this gap. Our mission is to simplify landlording by pairing responsive local managers with enterprise-grade AppFolio technology and rigorous Texas Real Estate Commission compliance.
              </Text>

              <View style={styles.missionPillarsBox}>
                <View style={styles.pillarItem}>
                  <Text style={styles.pillarLabel}>COMMUNICATION</Text>
                  <Text style={styles.pillarSub}>Single point of contact for every rental owner</Text>
                </View>
                <View style={styles.pillarItem}>
                  <Text style={styles.pillarLabel}>PROCESS</Text>
                  <Text style={styles.pillarSub}>Documented 7-stage lifecycle & 6-step triage</Text>
                </View>
                <View style={styles.pillarItem}>
                  <Text style={styles.pillarLabel}>TECHNOLOGY</Text>
                  <Text style={styles.pillarSub}>AppFolio real-time ledger & automated ACH</Text>
                </View>
              </View>
            </View>

            <View style={[styles.splitColRight, { width: isDesktop ? "44%" : "100%" }]}>
              <View style={styles.brokerageOversightCard}>
                <View style={styles.brokerageCardTop}>
                  <Building size={24} color="#164E3A" />
                  <Text style={styles.brokerageCardTopTitle}>Broker-Controlled Operating Model</Text>
                </View>
                <Text style={styles.brokerageCardText}>
                  Texas law demands strict fiduciary supervision over residential leasing, advertising, and trust accounting. KeyNest operates under the active oversight of <Text style={{ fontWeight: "700" }}>Fair Deal Realty Inc.</Text>
                </Text>

                <View style={styles.brokerResponsibilitiesList}>
                  <Text style={styles.respItem}>• Sponsoring broker TREC supervision & transaction review</Text>
                  <Text style={styles.respItem}>• Broker-supervised trust accounts for tenant security deposits</Text>
                  <Text style={styles.respItem}>• Texas REALTORS® standard residential leases & addenda</Text>
                  <Text style={styles.respItem}>• Advertising and fair housing compliance review</Text>
                  <Text style={styles.respItem}>• Central Office: 4815 State Hwy 121, Suite 2, The Colony, TX</Text>
                </View>

                <TouchableOpacity
                  style={styles.iabsLinkBtn}
                  onPress={() => router.push("/compliance" as never)}
                >
                  <Text style={styles.iabsLinkBtnText}>View TREC Information About Brokerage Services (IABS) →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Controlled Pilot Story (Slide 5 & 16 requirement) */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.pilotStoryCard}>
            <View style={styles.pilotBadge}>
              <Award size={16} color="#059669" />
              <Text style={styles.pilotBadgeText}>VALIDATED BEFORE SCALE</Text>
            </View>
            <Text style={styles.pilotHeading}>
              Validated Through a Controlled Pilot Before Accepting Outside Owners
            </Text>
            <Text style={styles.pilotDescription}>
              Unlike firms that launch prematurely and practice on client assets, KeyNest spent months running selected properties through a rigorous internal pilot. We tested vendor dispatch times, refined our 6-step maintenance escalation rules, configured seamless AppFolio owner distributions, and secured Fair Deal Realty broker sign-off.
            </Text>
            <Text style={styles.pilotReadinessText}>
              Today, KeyNest is fully operational, thoroughly staffed, and open to outside owners across our 7 core North Texas cities.
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Leadership Bios (Slide 5 requirement) */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>APPROVED LEADERSHIP</Text>
            <Text style={styles.sectionTitle}>Meet the Authorized Managers</Text>
            <Text style={styles.sectionSubtitle}>
              Experienced North Texas real estate professionals directly accountable for your property’s performance.
            </Text>
          </View>

          <View
            style={[
              styles.leadershipGrid,
              { flexDirection: isDesktop ? "row" : "column" },
            ]}
          >
            {KEYNEST_INFO.authorizedManagers.map((mgr, index) => (
              <View key={index} style={[styles.leaderCard, { width: isDesktop ? "48.5%" : "100%" }]}>
                <View style={styles.leaderAvatar}>
                  <Users size={32} color="#164E3A" />
                </View>
                <Text style={styles.leaderName}>{mgr.name}</Text>
                <Text style={styles.leaderTitle}>{mgr.title}</Text>
                <Text style={styles.leaderBrokerNote}>Authorized Manager | Under Fair Deal Realty Inc.</Text>
                <Text style={styles.leaderBio}>{mgr.bio}</Text>

                <View style={styles.leaderContactRow}>
                  <Text style={styles.leaderContactItem}>Office: {KEYNEST_INFO.officeAddress}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 4. Core Values (Slide 5 requirement) */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>OUR STANDARDS</Text>
            <Text style={styles.sectionTitle}>Four Pillars of KeyNest Service</Text>
            <Text style={styles.sectionSubtitle}>
              We hold ourselves to measurable operational principles on every property we manage.
            </Text>
          </View>

          <View
            style={[
              styles.valuesGrid,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <View
                  key={idx}
                  style={[
                    styles.valueCard,
                    { width: isDesktop ? "48.5%" : isTablet ? "48%" : "100%" },
                  ]}
                >
                  <View style={styles.valueIconBox}>
                    <Icon size={22} color="#164E3A" />
                  </View>
                  <Text style={styles.valueTitle}>{val.title}</Text>
                  <Text style={styles.valueDesc}>{val.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* 5. Schedule Consultation CTA */}
      <View style={styles.ctaSection}>
        <View style={styles.innerContainer}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaOverline}>DISCUSS YOUR PROPERTY</Text>
            <Text style={styles.ctaTitle}>Ready for Transparent North Texas Property Management?</Text>
            <Text style={styles.ctaSubtitle}>
              Schedule a 1-on-1 consultation with Dinesh Donthula or Purvang Patel to review your rental property, discuss realistic rental rates, or transition from another management company.
            </Text>

            <View style={styles.ctaButtonsGroup}>
              <TouchableOpacity style={styles.primaryCtaBtn} onPress={openConsultation}>
                <Calendar size={18} color="#FFFFFF" />
                <Text style={styles.primaryCtaBtnText}>Schedule Consultation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryCtaBtn}
                onPress={() => openRentalAnalysis()}
              >
                <Text style={styles.secondaryCtaBtnText}>Request Free Rental Analysis</Text>
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
  splitRow: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 36,
  },
  splitColLeft: {
    gap: 16,
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 1,
  },
  sectionHeading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F261E",
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  bodyText: {
    fontSize: 14.5,
    color: "#4B5563",
    lineHeight: 22,
  },
  missionPillarsBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 12,
    marginTop: 6,
  },
  pillarItem: {
    gap: 2,
  },
  pillarLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 0.8,
  },
  pillarSub: {
    fontSize: 13,
    color: "#166534",
    fontWeight: "500",
  },
  splitColRight: {},
  brokerageOversightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#164E3A",
    padding: 24,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  brokerageCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brokerageCardTopTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#164E3A",
    flex: 1,
  },
  brokerageCardText: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
  },
  brokerResponsibilitiesList: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  respItem: {
    fontSize: 12.5,
    color: "#374151",
    lineHeight: 18,
  },
  iabsLinkBtn: {
    marginTop: 4,
  },
  iabsLinkBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#164E3A",
    textDecorationLine: "underline",
  },
  pilotStoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 14,
  },
  pilotBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  pilotBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#065F46",
    letterSpacing: 0.6,
  },
  pilotHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  pilotDescription: {
    fontSize: 14.5,
    color: "#4B5563",
    lineHeight: 22,
  },
  pilotReadinessText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#164E3A",
    lineHeight: 21,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 40,
    gap: 8,
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
  leadershipGrid: {
    justifyContent: "space-between",
    gap: 24,
  },
  leaderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24,
    gap: 8,
  },
  leaderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  leaderName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  leaderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#059669",
  },
  leaderBrokerNote: {
    fontSize: 12,
    color: "#6B7280",
    fontStyle: "italic",
  },
  leaderBio: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 21,
    marginTop: 6,
  },
  leaderContactRow: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
    marginTop: 8,
  },
  leaderContactItem: {
    fontSize: 12,
    color: "#6B7280",
  },
  valuesGrid: {
    justifyContent: "space-between",
    gap: 20,
  },
  valueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 22,
    gap: 10,
  },
  valueIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  valueTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  valueDesc: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
  },
  ctaSection: {
    backgroundColor: "#164E3A",
    paddingVertical: 56,
  },
  ctaCard: {
    alignItems: "center",
    textAlign: "center",
    gap: 12,
  },
  ctaOverline: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#34D399",
    letterSpacing: 1,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  ctaSubtitle: {
    fontSize: 15,
    color: "#D1D5DB",
    textAlign: "center",
    maxWidth: 680,
    lineHeight: 22,
  },
  ctaButtonsGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginTop: 10,
  },
  primaryCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#059669",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  primaryCtaBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  secondaryCtaBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  secondaryCtaBtnText: {
    color: "#164E3A",
    fontSize: 14,
    fontWeight: "700",
  },
});
