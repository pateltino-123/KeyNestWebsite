import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  Home,
  Layers,
  Award,
  DollarSign,
  MapPin,
  Info,
  Key,
  Users,
  Menu,
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
} from "lucide-react-native";
import { KEYNEST_INFO } from "@/constants/keynestData";

interface HeaderProps {
  onRequestRentalAnalysis?: () => void;
  onOpenConsultation?: () => void;
  onOpenPortalModal?: (portalType?: "owner" | "tenant") => void;
}

export default function Header({
  onRequestRentalAnalysis,
  onOpenConsultation,
  onOpenPortalModal,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1080;
  const isTablet = width >= 768 && width < 1080;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Services", href: "/services", icon: Layers },
    { label: "Why KeyNest", href: "/why-keynest", icon: Award },
    { label: "Pricing", href: "/pricing", icon: DollarSign },
    { label: "Service Areas", href: "/contact", icon: MapPin },
    { label: "About", href: "/about", icon: Info },
    { label: "Owners", href: "/owners", icon: Key },
    { label: "Tenants", href: "/tenants", icon: Users },
  ];

  const navigateTo = (href: string) => {
    setMobileMenuOpen(false);
    setPortalDropdownOpen(false);
    router.push(href as never);
  };

  return (
    <View style={styles.headerWrapper}>
      {/* Top Compliance & Hotline Banner */}
      <View style={styles.topBanner}>
        <View style={styles.topBannerContent}>
          <View style={styles.topBannerLeft}>
            <ShieldCheck size={14} color="#3B6E99" />
            <Text style={styles.topBannerText}>
              <Text style={styles.boldText}>KeyNest Realty</Text> • Under the Brokerage of{" "}
              <Text style={styles.boldText}>Fair Deal Realty Inc.</Text> • TREC Licensed
            </Text>
          </View>
          <View style={styles.topBannerRight}>
            <Phone size={13} color="#3B6E99" />
            <Text style={styles.topBannerPhone}>Office: {KEYNEST_INFO.phone}</Text>
            <View style={styles.topBannerDivider} />
            <TouchableOpacity
              onPress={() => router.push("/compliance" as never)}
              accessibilityRole="link"
            >
              <Text style={styles.topBannerLink}>TREC Disclosures & IABS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Navigation Bar */}
      <View style={styles.mainNav}>
        <View style={styles.navContainer}>
          {/* Logo & Broker Identity */}
          <TouchableOpacity
            style={styles.logoContainer}
            onPress={() => navigateTo("/")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="KeyNest Realty Home"
          >
            <View style={styles.logoMark}>
              <Key size={20} color="#FFFFFF" />
            </View>
            <View>
              <View style={styles.logoTitleRow}>
                <Text style={styles.logoTextMain}>KeyNest</Text>
                <Text style={styles.logoTextSub}>Realty</Text>
              </View>
              <Text style={styles.logoBrokerSub}>Under Fair Deal Realty Inc.</Text>
            </View>
          </TouchableOpacity>

          {/* Desktop Navigation Items */}
          {isDesktop && (
            <View style={styles.desktopNavItems}>
              {navLinks.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/" || pathname === ""
                    : pathname.startsWith(item.href);
                return (
                  <TouchableOpacity
                    key={item.href}
                    style={[styles.navItem, isActive && styles.navItemActive]}
                    onPress={() => navigateTo(item.href)}
                    accessibilityRole="link"
                  >
                    <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Action CTAs */}
          <View style={styles.actionButtonsContainer}>
            {/* Portals Dropdown Button */}
            {(isDesktop || isTablet) && (
              <View style={styles.dropdownRelative}>
                <TouchableOpacity
                  style={styles.portalButton}
                  onPress={() => setPortalDropdownOpen(!portalDropdownOpen)}
                  accessibilityRole="button"
                >
                  <Key size={14} color="#3B6E99" />
                  <Text style={styles.portalButtonText}>Client Portals</Text>
                  <ChevronDown size={14} color="#737B85" />
                </TouchableOpacity>

                {portalDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setPortalDropdownOpen(false);
                        if (onOpenPortalModal) {
                          onOpenPortalModal("owner");
                        } else {
                          navigateTo("/owners");
                        }
                      }}
                    >
                      <View style={styles.dropdownItemIconCircle}>
                        <Key size={14} color="#3B6E99" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dropdownItemTitle}>Owner Portal</Text>
                        <Text style={styles.dropdownItemSub}>Statements, distributions, tax 1099</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.dropdownDivider} />
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setPortalDropdownOpen(false);
                        if (onOpenPortalModal) {
                          onOpenPortalModal("tenant");
                        } else {
                          navigateTo("/tenants");
                        }
                      }}
                    >
                      <View style={styles.dropdownItemIconCircle}>
                        <Users size={14} color="#3B6E99" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dropdownItemTitle}>Resident Portal</Text>
                        <Text style={styles.dropdownItemSub}>Pay rent, view ledger, maintenance</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Free Rental Analysis CTA */}
            <TouchableOpacity
              style={styles.primaryCtaButton}
              onPress={() => {
                if (onRequestRentalAnalysis) {
                  onRequestRentalAnalysis();
                } else {
                  navigateTo("/contact");
                }
              }}
              accessibilityRole="button"
            >
              <Text style={styles.primaryCtaText}>Free Rental Analysis</Text>
              <ArrowRight size={15} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            {/* Mobile / Tablet Menu Button */}
            {!isDesktop && (
              <TouchableOpacity
                style={styles.mobileMenuToggle}
                onPress={() => setMobileMenuOpen(true)}
                accessibilityLabel="Open navigation menu"
                accessibilityRole="button"
              >
                <Menu size={24} color="#22252A" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Mobile Menu Modal / Drawer */}
      <Modal
        visible={mobileMenuOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <View style={styles.mobileDrawerOverlay}>
          <View style={styles.mobileDrawerContent}>
            <View style={styles.mobileDrawerHeader}>
              <View style={styles.logoContainer}>
                <View style={styles.logoMarkSmall}>
                  <Key size={16} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.logoTextMainSmall}>KeyNest Realty</Text>
                  <Text style={styles.logoBrokerSubSmall}>Under Fair Deal Realty Inc.</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeDrawerBtn}
                onPress={() => setMobileMenuOpen(false)}
                accessibilityLabel="Close navigation menu"
              >
                <X size={22} color="#475569" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.mobileLinksScroll} contentContainerStyle={{ paddingBottom: 40 }}>
              <View style={styles.mobileLinksList}>
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/" || pathname === ""
                      : pathname.startsWith(item.href);
                  return (
                    <TouchableOpacity
                      key={item.href}
                      style={[styles.mobileNavItem, isActive && styles.mobileNavItemActive]}
                      onPress={() => navigateTo(item.href)}
                    >
                      <Icon size={18} color={isActive ? "#3B6E99" : "#737B85"} />
                      <Text style={[styles.mobileNavText, isActive && styles.mobileNavTextActive]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.mobilePortalSection}>
                <Text style={styles.mobileSectionHeader}>CLIENT PORTALS</Text>
                <TouchableOpacity
                  style={styles.mobilePortalBtn}
                  onPress={() => {
                    setMobileMenuOpen(false);
                    if (onOpenPortalModal) {
                      onOpenPortalModal("owner");
                    } else {
                      navigateTo("/owners");
                    }
                  }}
                >
                  <Key size={16} color="#3B6E99" />
                  <Text style={styles.mobilePortalBtnText}>AppFolio Owner Portal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.mobilePortalBtn}
                  onPress={() => {
                    setMobileMenuOpen(false);
                    if (onOpenPortalModal) {
                      onOpenPortalModal("tenant");
                    } else {
                      navigateTo("/tenants");
                    }
                  }}
                >
                  <Users size={16} color="#3B6E99" />
                  <Text style={styles.mobilePortalBtnText}>AppFolio Resident Portal</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.mobileCtaSection}>
                <TouchableOpacity
                  style={styles.mobilePrimaryCta}
                  onPress={() => {
                    setMobileMenuOpen(false);
                    if (onRequestRentalAnalysis) {
                      onRequestRentalAnalysis();
                    } else {
                      navigateTo("/contact");
                    }
                  }}
                >
                  <Text style={styles.mobilePrimaryCtaText}>Get a Free Rental Analysis</Text>
                </TouchableOpacity>

                {onOpenConsultation && (
                  <TouchableOpacity
                    style={styles.mobileSecondaryCta}
                    onPress={() => {
                      setMobileMenuOpen(false);
                      onOpenConsultation();
                    }}
                  >
                    <Text style={styles.mobileSecondaryCtaText}>Schedule Consultation</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.mobileFooterCompliance}>
                <Text style={styles.mobileComplianceText}>
                  Office: 4815 State Hwy 121, Suite 2, The Colony, TX 75056
                </Text>
                <Text style={styles.mobileComplianceText}>
                  Brokerage: Fair Deal Realty Inc.
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
    zIndex: 100,
  },
  topBanner: {
    backgroundColor: "#F7F3EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
  },
  topBannerContent: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  topBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  topBannerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topBannerText: {
    color: "#4A515A",
    fontSize: 12,
  },
  boldText: {
    fontWeight: "700",
    color: "#22252A",
  },
  topBannerPhone: {
    color: "#3B6E99",
    fontSize: 12,
    fontWeight: "600",
  },
  topBannerDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#E8E2D5",
  },
  topBannerLink: {
    color: "#3B6E99",
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  mainNav: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  navContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: "#3B6E99",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B6E99",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  logoTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  logoTextMain: {
    fontSize: 21,
    fontWeight: "800",
    color: "#22252A",
    letterSpacing: -0.4,
  },
  logoTextSub: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3B6E99",
    letterSpacing: -0.4,
  },
  logoBrokerSub: {
    fontSize: 11,
    color: "#737B85",
    fontWeight: "500",
    marginTop: -2,
  },
  desktopNavItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 6,
  },
  navItemActive: {
    backgroundColor: "#EBF2F7",
  },
  navItemText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#4A515A",
  },
  navItemTextActive: {
    color: "#3B6E99",
    fontWeight: "700",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dropdownRelative: {
    position: "relative",
    zIndex: 110,
  },
  portalButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    backgroundColor: "#FDFBF7",
  },
  portalButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#22252A",
  },
  dropdownMenu: {
    position: "absolute",
    top: 42,
    right: 0,
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    padding: 6,
    shadowColor: "#22252A",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
    zIndex: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 7,
  },
  dropdownItemIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: "#EBF2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownItemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#22252A",
  },
  dropdownItemSub: {
    fontSize: 11,
    color: "#737B85",
    marginTop: 1,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#F7F3EB",
    marginVertical: 4,
  },
  primaryCtaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B6E99",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 7,
    shadowColor: "#3B6E99",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  mobileMenuToggle: {
    padding: 8,
    borderRadius: 7,
    backgroundColor: "#F7F3EB",
  },
  mobileDrawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(34, 37, 42, 0.5)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  mobileDrawerContent: {
    width: "82%",
    maxWidth: 380,
    backgroundColor: "#FDFBF7",
    height: "100%",
    shadowColor: "#22252A",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mobileDrawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
    backgroundColor: "#FFFFFF",
  },
  logoMarkSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#3B6E99",
    justifyContent: "center",
    alignItems: "center",
  },
  logoTextMainSmall: {
    fontSize: 16,
    fontWeight: "800",
    color: "#22252A",
  },
  logoBrokerSubSmall: {
    fontSize: 10,
    color: "#737B85",
  },
  closeDrawerBtn: {
    padding: 6,
    borderRadius: 6,
  },
  mobileLinksScroll: {
    flex: 1,
  },
  mobileLinksList: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  mobileNavItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 7,
  },
  mobileNavItemActive: {
    backgroundColor: "#EBF2F7",
  },
  mobileNavText: {
    fontSize: 14.5,
    color: "#4A515A",
    fontWeight: "500",
  },
  mobileNavTextActive: {
    color: "#3B6E99",
    fontWeight: "700",
  },
  mobilePortalSection: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E8E2D5",
  },
  mobileSectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#737B85",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  mobilePortalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    marginBottom: 8,
  },
  mobilePortalBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#22252A",
  },
  mobileCtaSection: {
    padding: 16,
    gap: 10,
  },
  mobilePrimaryCta: {
    backgroundColor: "#3B6E99",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
  },
  mobilePrimaryCtaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  mobileSecondaryCta: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
  },
  mobileSecondaryCtaText: {
    color: "#22252A",
    fontSize: 14,
    fontWeight: "600",
  },
  mobileFooterCompliance: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E8E2D5",
    gap: 4,
  },
  mobileComplianceText: {
    fontSize: 11,
    color: "#737B85",
    lineHeight: 16,
  },
});
