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
              <ShieldCheck size={20} color="#5EAB86" />
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
                  <Key size={18} color="#FFFFFF" />
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
                  <MapPin size={15} color="#5EAB86" style={styles.contactIcon} />
                  <Text style={styles.contactText}>{KEYNEST_INFO.officeAddress}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Phone size={15} color="#5EAB86" style={styles.contactIcon} />
                  <Text style={styles.contactText}>Office: {KEYNEST_INFO.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Mail size={15} color="#5EAB86" style={styles.contactIcon} />
                  <Text style={styles.contactText}>{KEYNEST_INFO.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Clock size={15} color="#5EAB86" style={styles.contactIcon} />
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
                  <Building size={16} color="#5EAB86" />
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
                  <ExternalLink size={12} color="#5EAB86" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.trecBtn}
                  onPress={() => openUrl(KEYNEST_INFO.trecConsumerNoticeUrl)}
                >
                  <Text style={styles.trecBtnText}>Consumer Protection Notice</Text>
                  <ExternalLink size={12} color="#5EAB86" />
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
    backgroundColor: "#1A1D21",
    borderTopWidth: 1,
    borderTopColor: "#2A2F37",
  },
  innerContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
  },
  brokerageBanner: {
    backgroundColor: "#22262C",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2F3540",
  },
  brokerageBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  brokerageIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#2A303A",
    justifyContent: "center",
    alignItems: "center",
  },
  brokerageBannerTitle: {
    color: "#F5F3EF",
    fontSize: 14.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  brokerageBannerSubtitle: {
    color: "#9EA6B2",
    fontSize: 12.5,
    marginTop: 2,
  },
  mainFooter: {
    paddingVertical: 52,
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
    marginBottom: 14,
  },
  footerLogoMark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#367A5E",
    justifyContent: "center",
    alignItems: "center",
  },
  footerLogoTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#F5F3EF",
    letterSpacing: -0.3,
  },
  footerLogoSub: {
    fontSize: 11,
    color: "#82C7A5",
    fontWeight: "600",
    marginTop: -2,
  },
  companyBio: {
    color: "#A2AAB5",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
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
    color: "#CBD2DC",
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  colTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#F5F3EF",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  linkList: {
    gap: 10,
  },
  footerLink: {
    color: "#A2AAB5",
    fontSize: 13.5,
    paddingVertical: 2,
  },
  leadershipCard: {
    backgroundColor: "#22262C",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2F3540",
  },
  leadHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  leadBrokerName: {
    color: "#F5F3EF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  leadSub: {
    color: "#82C7A5",
    fontSize: 11,
    marginTop: 2,
  },
  leadDivider: {
    height: 1,
    backgroundColor: "#2F3540",
    marginVertical: 10,
  },
  leadLabel: {
    color: "#8C95A2",
    fontSize: 11,
    marginBottom: 4,
  },
  leadManagerName: {
    color: "#E2E7ED",
    fontSize: 12.5,
    fontWeight: "600",
    lineHeight: 18,
  },
  leadAddress: {
    color: "#737B85",
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
    backgroundColor: "#22262C",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#303742",
  },
  trecBtnText: {
    color: "#82C7A5",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomLegalBar: {
    backgroundColor: "#141619",
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#22262C",
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
    color: "#737B85",
    fontSize: 11.5,
    lineHeight: 17,
  },
  bottomBarRight: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  bottomLink: {
    color: "#8C95A2",
    fontSize: 12,
    fontWeight: "500",
  },
  dot: {
    color: "#475569",
    fontSize: 12,
  },
});
