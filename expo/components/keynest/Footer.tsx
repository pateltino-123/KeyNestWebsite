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
  Key,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ExternalLink,
  Building,
} from "lucide-react-native";
import { KEYNEST_INFO } from "@/constants/keynestData";

export default function Footer() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640;

  const navigateTo = (href: string) => {
    router.push(href as never);
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.footerContainer}>
      {/* Top Mandatory Disclosure Banner */}
      <View style={styles.brokerageBanner}>
        <View style={styles.innerContainer}>
          <View style={styles.brokerageBannerContent}>
            <View style={styles.brokerageIconBox}>
              <ShieldCheck size={20} color="#10B981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.brokerageBannerTitle}>
                {KEYNEST_INFO.brokerageFullLine}
              </Text>
              <Text style={styles.brokerageBannerSubtitle}>
                Operating under the active supervision of Texas Real Estate Commission (TREC) licensed broker Fair Deal Realty Inc.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Footer Links & Information */}
      <View style={styles.mainFooter}>
        <View style={styles.innerContainer}>
          <View
            style={[
              styles.footerColumns,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            {/* Column 1: Company Profile & Office */}
            <View style={[styles.col, { width: isDesktop ? "32%" : isTablet ? "48%" : "100%" }]}>
              <View style={styles.footerLogoRow}>
                <View style={styles.footerLogoMark}>
                  <Key size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.footerLogoTitle}>KeyNest Realty</Text>
                  <Text style={styles.footerLogoSub}>Property Management</Text>
                </View>
              </View>
              <Text style={styles.companyBio}>
                North Texas property management made simple. Delivering reliable leasing, consistent rent collection, and transparent communication for rental owners across approved North Texas communities.
              </Text>

              <View style={styles.contactList}>
                <View style={styles.contactItem}>
                  <MapPin size={16} color="#34D399" style={styles.contactIcon} />
                  <Text style={styles.contactText}>{KEYNEST_INFO.officeAddress}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Phone size={16} color="#34D399" style={styles.contactIcon} />
                  <Text style={styles.contactText}>Office: {KEYNEST_INFO.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Mail size={16} color="#34D399" style={styles.contactIcon} />
                  <Text style={styles.contactText}>{KEYNEST_INFO.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Clock size={16} color="#34D399" style={styles.contactIcon} />
                  <Text style={styles.contactText}>{KEYNEST_INFO.hours}</Text>
                </View>
              </View>
            </View>

            {/* Column 2: Navigation & Services */}
            <View style={[styles.col, { width: isDesktop ? "22%" : isTablet ? "48%" : "100%" }]}>
              <Text style={styles.colTitle}>Property Management</Text>
              <View style={styles.linkList}>
                <TouchableOpacity onPress={() => navigateTo("/services")}>
                  <Text style={styles.footerLink}>Management Services</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/why-keynest")}>
                  <Text style={styles.footerLink}>Why Choose KeyNest</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/pricing")}>
                  <Text style={styles.footerLink}>Pricing & Fee Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/owners")}>
                  <Text style={styles.footerLink}>Owner Onboarding</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/owners")}>
                  <Text style={styles.footerLink}>AppFolio Owner Portal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/contact")}>
                  <Text style={styles.footerLink}>Request Rental Analysis</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Column 3: Resident & Territory */}
            <View style={[styles.col, { width: isDesktop ? "22%" : isTablet ? "48%" : "100%" }]}>
              <Text style={styles.colTitle}>Tenants & Service Areas</Text>
              <View style={styles.linkList}>
                <TouchableOpacity onPress={() => navigateTo("/rentals")}>
                  <Text style={styles.footerLink}>Available Rentals</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/tenants")}>
                  <Text style={styles.footerLink}>Tenant Portal & Rent Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/tenants")}>
                  <Text style={styles.footerLink}>Maintenance Escalation</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/tenants")}>
                  <Text style={styles.footerLink}>Published Rental Criteria</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/contact")}>
                  <Text style={styles.footerLink}>Service Territory (7 Cities)</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo("/about")}>
                  <Text style={styles.footerLink}>About KeyNest & Team</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Column 4: Brokerage Oversight & Regulatory */}
            <View style={[styles.col, { width: isDesktop ? "24%" : isTablet ? "48%" : "100%" }]}>
              <Text style={styles.colTitle}>Brokerage & Compliance</Text>
              <View style={styles.brokerageCard}>
                <View style={styles.brokerageCardHeader}>
                  <Building size={16} color="#10B981" />
                  <Text style={styles.brokerageCardTitle}>Fair Deal Realty Inc.</Text>
                </View>
                <Text style={styles.brokerageCardText}>
                  Authorized Managers:{"\n"}
                  <Text style={{ fontWeight: "700", color: "#FFFFFF" }}>Dinesh Donthula</Text> &{" "}
                  <Text style={{ fontWeight: "700", color: "#FFFFFF" }}>Purvang Patel</Text>
                </Text>
                <Text style={styles.brokerageCardText}>
                  TREC supervision and compliance, trust accounting procedures, transaction-file risk review, and regulated property-management activity.
                </Text>
              </View>

              <View style={styles.trecLinksBox}>
                <TouchableOpacity
                  style={styles.trecButton}
                  onPress={() => navigateTo("/compliance")}
                >
                  <Text style={styles.trecButtonText}>Texas Real Estate Commission (TREC)</Text>
                  <ExternalLink size={13} color="#34D399" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.trecSubButton}
                  onPress={() => openUrl(KEYNEST_INFO.trecIabsUrl)}
                >
                  <Text style={styles.trecSubText}>• Information About Brokerage Services (IABS)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.trecSubButton}
                  onPress={() => openUrl(KEYNEST_INFO.trecConsumerNoticeUrl)}
                >
                  <Text style={styles.trecSubText}>• TREC Consumer Protection Notice</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Legal & Equal Housing Disclaimer */}
      <View style={styles.bottomBar}>
        <View style={styles.innerContainer}>
          <View style={styles.bottomBarContent}>
            <View style={styles.equalHousingBox}>
              <View style={styles.equalHousingBadge}>
                <Text style={styles.equalHousingBadgeText}>EQUAL HOUSING OPPORTUNITY</Text>
              </View>
              <Text style={styles.legalDisclaimer}>
                KeyNest Realty Property Management strictly complies with federal, Texas state, and local Fair Housing laws. We do not discriminate on the basis of race, color, religion, sex, disability, familial status, or national origin. All residential leases and property management agreements are subject to broker approval under Fair Deal Realty Inc. All contractual obligations remain in broker-approved management agreements and leases.
              </Text>
            </View>

            <View style={styles.copyrightRow}>
              <Text style={styles.copyrightText}>
                © {new Date().getFullYear()} DoubleDee LLC d/b/a KeyNest Realty. All rights reserved. Under the brokerage of Fair Deal Realty Inc.
              </Text>
              <View style={styles.legalLinks}>
                <TouchableOpacity onPress={() => navigateTo("/compliance")}>
                  <Text style={styles.legalLink}>TREC Disclosures</Text>
                </TouchableOpacity>
                <Text style={styles.legalLinkDot}>•</Text>
                <TouchableOpacity onPress={() => navigateTo("/compliance")}>
                  <Text style={styles.legalLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <Text style={styles.legalLinkDot}>•</Text>
                <TouchableOpacity onPress={() => navigateTo("/compliance")}>
                  <Text style={styles.legalLink}>Terms of Service</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#0F261E",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#164E3A",
  },
  innerContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 16,
  },
  brokerageBanner: {
    backgroundColor: "#164E3A",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1D644B",
  },
  brokerageBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brokerageIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#103C2D",
    justifyContent: "center",
    alignItems: "center",
  },
  brokerageBannerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  brokerageBannerSubtitle: {
    color: "#A7F3D0",
    fontSize: 12,
    marginTop: 2,
  },
  mainFooter: {
    paddingVertical: 48,
  },
  footerColumns: {
    gap: 28,
    justifyContent: "space-between",
  },
  col: {
    marginBottom: 16,
  },
  footerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  footerLogoMark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  footerLogoTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  footerLogoSub: {
    fontSize: 11,
    color: "#34D399",
    fontWeight: "600",
    marginTop: -2,
  },
  companyBio: {
    color: "#9CA3AF",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },
  contactList: {
    gap: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  contactIcon: {
    marginTop: 2,
  },
  contactText: {
    color: "#D1D5DB",
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  colTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  linkList: {
    gap: 10,
  },
  footerLink: {
    color: "#9CA3AF",
    fontSize: 13.5,
    paddingVertical: 2,
  },
  brokerageCard: {
    backgroundColor: "#14372B",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E5642",
    marginBottom: 14,
  },
  brokerageCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  brokerageCardTitle: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  brokerageCardText: {
    fontSize: 11.5,
    color: "#A7F3D0",
    lineHeight: 16,
    marginTop: 4,
  },
  trecLinksBox: {
    gap: 6,
  },
  trecButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#184234",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#235B47",
  },
  trecButtonText: {
    color: "#34D399",
    fontSize: 12,
    fontWeight: "600",
  },
  trecSubButton: {
    paddingLeft: 6,
    paddingVertical: 2,
  },
  trecSubText: {
    color: "#9CA3AF",
    fontSize: 11.5,
  },
  bottomBar: {
    backgroundColor: "#091712",
    paddingVertical: 22,
    borderTopWidth: 1,
    borderTopColor: "#133126",
  },
  bottomBarContent: {
    gap: 16,
  },
  equalHousingBox: {
    gap: 6,
  },
  equalHousingBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#184234",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#235B47",
  },
  equalHousingBadgeText: {
    color: "#34D399",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  legalDisclaimer: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 16,
  },
  copyrightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#142D23",
  },
  copyrightText: {
    color: "#6B7280",
    fontSize: 11.5,
  },
  legalLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legalLink: {
    color: "#9CA3AF",
    fontSize: 11.5,
  },
  legalLinkDot: {
    color: "#4B5563",
    fontSize: 10,
  },
});
