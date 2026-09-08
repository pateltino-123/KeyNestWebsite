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
              <ShieldCheck size={20} color="#38BDF8" />
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
                  <MapPin size={16} color="#60A5FA" style={styles.contactIcon} />
                  <Text style={styles.contactText}>{KEYNEST_INFO.officeAddress}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Phone size={16} color="#60A5FA" style={styles.contactIcon} />
                  <Text style={styles.contactText}>Office: {KEYNEST_INFO.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Mail size={16} color="#60A5FA" style={styles.contactIcon} />
                  <Text style={styles.contactText}>{KEYNEST_INFO.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Clock size={16} color="#60A5FA" style={styles.contactIcon} />
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

            {/* Column 4: Brokerage Leadership */}
            <View style={[styles.col, { width: isDesktop ? "24%" : "100%" }]}>
              <Text style={styles.colTitle}>Brokerage & Leadership</Text>
              <View style={styles.leadershipCard}>
                <View style={styles.leadHeader}>
                  <Building size={16} color="#60A5FA" />
                  <Text style={styles.leadBrokerName}>Fair Deal Realty Inc.</Text>
                </View>
                <Text style={styles.leadSub}>Sponsoring Texas Brokerage</Text>
                <View style={styles.leadDivider} />
                <Text style={styles.leadLabel}>Authorized Property Managers:</Text>
                <Text style={styles.leadManagerName}>• {KEYNEST_INFO.authorizedManagers[0].name}</Text>
                <Text style={styles.leadManagerName}>• {KEYNEST_INFO.authorizedManagers[1].name}</Text>
                <Text style={styles.leadAddress}>{KEYNEST_INFO.officeAddress}</Text>
              </View>

              <View style={styles.complianceLinksBox}>
                <TouchableOpacity
                  style={styles.trecBtn}
                  onPress={() => openUrl(KEYNEST_INFO.trecIabsUrl)}
                >
                  <Text style={styles.trecBtnText}>TREC IABS Form</Text>
                  <ExternalLink size={12} color="#93C5FD" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.trecBtn}
                  onPress={() => openUrl(KEYNEST_INFO.trecConsumerNoticeUrl)}
                >
                  <Text style={styles.trecBtnText}>Consumer Protection Notice</Text>
                  <ExternalLink size={12} color="#93C5FD" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Legal & TREC Statutory Bottom Bar */}
      <View style={styles.bottomLegalBar}>
        <View style={styles.innerContainer}>
          <View style={[styles.bottomBarRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={styles.bottomBarLeft}>
              <Text style={styles.bottomLegalNotice}>
                © {new Date().getFullYear()} KeyNest Realty. All rights reserved. KeyNest Realty Property Management operates under the active brokerage of Fair Deal Realty Inc., a Texas licensed real estate brokerage. Equal Housing Opportunity.
              </Text>
            </View>

            <View style={styles.bottomBarRight}>
              <TouchableOpacity onPress={() => navigateTo("/compliance")}>
                <Text style={styles.bottomLink}>Compliance & Disclosures</Text>
              </TouchableOpacity>
              <Text style={styles.dot}>•</Text>
              <TouchableOpacity onPress={() => navigateTo("/compliance")}>
                <Text style={styles.bottomLink}>Fair Housing</Text>
              </TouchableOpacity>
              <Text style={styles.dot}>•</Text>
              <TouchableOpacity onPress={() => navigateTo("/contact")}>
                <Text style={styles.bottomLink}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#0B1120",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
  },
  innerContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
  },
  brokerageBanner: {
    backgroundColor: "#0F172A",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  brokerageBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  brokerageIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#1E293B",
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
    color: "#94A3B8",
    fontSize: 12.5,
    marginTop: 2,
  },
  mainFooter: {
    paddingVertical: 56,
  },
  footerColumns: {
    gap: 32,
    justifyContent: "space-between",
  },
  col: {
    marginBottom: 16,
  },
  footerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  footerLogoMark: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  footerLogoTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  footerLogoSub: {
    fontSize: 11.5,
    color: "#60A5FA",
    fontWeight: "600",
    marginTop: -2,
  },
  companyBio: {
    color: "#94A3B8",
    fontSize: 13.5,
    lineHeight: 21,
    marginBottom: 20,
  },
  contactList: {
    gap: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  contactIcon: {
    marginTop: 2,
  },
  contactText: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  colTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  linkList: {
    gap: 11,
  },
  footerLink: {
    color: "#94A3B8",
    fontSize: 13.5,
    paddingVertical: 2,
  },
  leadershipCard: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  leadHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  leadBrokerName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  leadSub: {
    color: "#60A5FA",
    fontSize: 11.5,
    marginTop: 2,
  },
  leadDivider: {
    height: 1,
    backgroundColor: "#1E293B",
    marginVertical: 10,
  },
  leadLabel: {
    color: "#94A3B8",
    fontSize: 11.5,
    marginBottom: 4,
  },
  leadManagerName: {
    color: "#E2E8F0",
    fontSize: 12.5,
    fontWeight: "600",
    lineHeight: 18,
  },
  leadAddress: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 8,
    lineHeight: 15,
  },
  complianceLinksBox: {
    marginTop: 14,
    gap: 8,
  },
  trecBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  trecBtnText: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomLegalBar: {
    backgroundColor: "#070A11",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#111827",
  },
  bottomBarRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  bottomBarLeft: {
    flex: 1,
  },
  bottomLegalNotice: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
  },
  bottomBarRight: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  bottomLink: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
  },
  dot: {
    color: "#475569",
    fontSize: 12,
  },
});
