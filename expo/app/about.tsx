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
  Layers,
  ArrowRight,
  Phone,
  Mail,
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
      desc: "Hyper-focused on The Colony, Frisco, Plano, McKinney, Allen, Prosper, and Carrollton. We know local HOA rules, municipal rental licenses, and true market comps.",
      icon: Compass,
    },
  ];

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#3B6E99" />
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
                KeyNest was founded to deliver the best of both worlds: dedicated local leadership with personal accountability, combined with the rigorous technology and financial controls of AppFolio and Texas Real Estate Commission (TREC) broker supervision.
              </Text>

              <View style={styles.missionPoints}>
                <View style={styles.missionPointItem}>
                  <CheckCircle2 size={18} color="#3B6E99" />
                  <Text style={styles.missionPointText}>
                    Direct access to authorized local managers (Dinesh Donthula & Purvang Patel)
                  </Text>
                </View>
                <View style={styles.missionPointItem}>
                  <CheckCircle2 size={18} color="#3B6E99" />
                  <Text style={styles.missionPointText}>
                    100% fiduciary trust accounting under broker Fair Deal Realty Inc.
                  </Text>
                </View>
                <View style={styles.missionPointItem}>
                  <CheckCircle2 size={18} color="#3B6E99" />
                  <Text style={styles.missionPointText}>
                    Zero fee markups on maintenance invoices passed through at exact cost
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.splitColRight, { width: isDesktop ? "44%" : "100%" }]}>
              <View style={styles.brokerageCard}>
                <View style={styles.brokerageCardBadge}>
                  <Building size={16} color="#3B6E99" />
                  <Text style={styles.brokerageCardBadgeText}>SPONSORING BROKERAGE</Text>
                </View>
                <Text style={styles.brokerageCardName}>Fair Deal Realty Inc.</Text>
                <Text style={styles.brokerageCardText}>
                  KeyNest Realty operates as a specialized property management division under the active supervision of Texas licensed broker Fair Deal Realty Inc.
                </Text>

                <View style={styles.brokerDetailsList}>
                  <View style={styles.brokerDetailItem}>
                    <Text style={styles.detailTitle}>Corporate Office:</Text>
                    <Text style={styles.detailVal}>{KEYNEST_INFO.officeAddress}</Text>
                  </View>
                  <View style={styles.brokerDetailItem}>
                    <Text style={styles.detailTitle}>Direct Phone:</Text>
                    <Text style={styles.detailVal}>{KEYNEST_INFO.phone}</Text>
                  </View>
                  <View style={styles.brokerDetailItem}>
                    <Text style={styles.detailTitle}>Operating Hours:</Text>
                    <Text style={styles.detailVal}>{KEYNEST_INFO.hours}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.trecNavBtn}
                  onPress={() => router.push("/compliance" as never)}
                >
                  <Text style={styles.trecNavBtnText}>View Required TREC Consumer Notices →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Four Core Values */}
      <View style={styles.sectionAlt}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>OUR STANDARDS</Text>
            <Text style={styles.sectionTitle}>What Defines the KeyNest Experience</Text>
            <Text style={styles.sectionSubtitle}>
              Four core principles that guide our interactions with rental owners, residents, and trade contractors every single day.
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
                    { width: isDesktop ? "48.5%" : "100%" },
                  ]}
                >
                  <View style={styles.valueIconBox}>
                    <Icon size={24} color="#3B6E99" />
                  </View>
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={styles.valueTitle}>{val.title}</Text>
                    <Text style={styles.valueDesc}>{val.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* 3. Leadership Profiles */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>MANAGEMENT LEADERSHIP</Text>
            <Text style={styles.sectionTitle}>Meet Your Local Decision-Makers</Text>
            <Text style={styles.sectionSubtitle}>
              When you partner with KeyNest, you work directly with our authorized management leadership.
            </Text>
          </View>

          <View
            style={[
              styles.leadershipGrid,
              { flexDirection: isDesktop ? "row" : "column" },
            ]}
          >
            {KEYNEST_INFO.authorizedManagers.map((leader, idx) => (
              <View key={idx} style={styles.leaderCard}>
                <View style={styles.leaderAvatarCircle}>
                  <Users size={32} color="#3B6E99" />
                </View>
                <Text style={styles.leaderName}>{leader.name}</Text>
                <Text style={styles.leaderRole}>{leader.title}</Text>
                <Text style={styles.leaderBio}>{leader.bio}</Text>

                <View style={styles.leaderContactRow}>
                  <View style={styles.leaderContactItem}>
                    <Phone size={14} color="#3B6E99" />
                    <Text style={styles.leaderContactText}>{KEYNEST_INFO.phone}</Text>
                  </View>
                  <View style={styles.leaderContactItem}>
                    <Mail size={14} color="#3B6E99" />
                    <Text style={styles.leaderContactText}>{KEYNEST_INFO.email}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.aboutCtaRow}>
            <TouchableOpacity style={styles.aboutPrimaryBtn} onPress={openConsultation}>
              <Calendar size={16} color="#FFFFFF" />
              <Text style={styles.aboutPrimaryBtnText}>Schedule a Call with Dinesh & Purvang</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aboutSecondaryBtn} onPress={() => openRentalAnalysis()}>
              <Text style={styles.aboutSecondaryBtnText}>Request Free Rental Analysis</Text>
              <ArrowRight size={16} color="#22252A" />
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
    backgroundColor: "#EBF2F7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C8D9E8",
    marginBottom: 16,
  },
  badgePillText: {
    color: "#2E567A",
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
  splitRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 40,
  },
  splitColLeft: {
    gap: 16,
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#3B6E99",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#22252A",
    lineHeight: 38,
  },
  bodyText: {
    fontSize: 15,
    color: "#4A515A",
    lineHeight: 24,
  },
  missionPoints: {
    gap: 12,
    marginTop: 8,
  },
  missionPointItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  missionPointText: {
    fontSize: 14,
    color: "#22252A",
    fontWeight: "600",
  },
  splitColRight: {
    alignItems: "center",
  },
  brokerageCard: {
    width: "100%",
    backgroundColor: "#FAF7F0",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    padding: 28,
    gap: 14,
  },
  brokerageCardBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EBF2F7",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  brokerageCardBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2E567A",
    letterSpacing: 0.8,
  },
  brokerageCardName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#22252A",
  },
  brokerageCardText: {
    fontSize: 13.5,
    color: "#4A515A",
    lineHeight: 20,
  },
  brokerDetailsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  brokerDetailItem: {
    gap: 2,
  },
  detailTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#737B85",
  },
  detailVal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#22252A",
  },
  trecNavBtn: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  trecNavBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3B6E99",
  },
  sectionHeaderCentered: {
    alignItems: "center",
    marginBottom: 48,
    textAlign: "center",
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
  valuesGrid: {
    gap: 24,
    justifyContent: "space-between",
  },
  valueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  valueIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EBF2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  valueTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#22252A",
  },
  valueDesc: {
    fontSize: 13.5,
    color: "#4A515A",
    lineHeight: 20,
  },
  leadershipGrid: {
    gap: 24,
    justifyContent: "center",
  },
  leaderCard: {
    flex: 1,
    backgroundColor: "#FAF7F0",
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    alignItems: "center",
    textAlign: "center",
    gap: 10,
  },
  leaderAvatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#EBF2F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  leaderName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#22252A",
  },
  leaderRole: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3B6E99",
  },
  leaderBio: {
    fontSize: 13.5,
    color: "#4A515A",
    lineHeight: 21,
    textAlign: "center",
  },
  leaderContactRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  leaderContactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  leaderContactText: {
    fontSize: 12.5,
    color: "#4A515A",
    fontWeight: "600",
  },
  aboutCtaRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 48,
  },
  aboutPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3B6E99",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  aboutPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  aboutSecondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  aboutSecondaryBtnText: {
    color: "#22252A",
    fontSize: 14.5,
    fontWeight: "700",
  },
});
