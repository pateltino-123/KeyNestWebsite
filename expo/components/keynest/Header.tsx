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
  Search,
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
  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Services", href: "/services", icon: Layers },
    { label: "Why KeyNest", href: "/why-keynest", icon: Award },
    { label: "Available Rentals", href: "/rentals", icon: Search },
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
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.topBannerText}>
              <Text style={styles.boldText}>KeyNest Realty</Text> • Under the Brokerage of{" "}
              <Text style={styles.boldText}>Fair Deal Realty Inc.</Text> • TREC Licensed
            </Text>
          </View>
          <View style={styles.topBannerRight}>
            <Phone size={13} color="#D1FAE5" />
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
                  <Key size={15} color="#1B4D3E" />
                  <Text style={styles.portalButtonText}>Portals</Text>
                  <ChevronDown size={14} color="#1B4D3E" />
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
                      <Text style={styles.dropdownItemTitle}>Owner Portal</Text>
                      <Text style={styles.dropdownItemSub}>Statements, distributions, tax 1099</Text>
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
                      <Text style={styles.dropdownItemTitle}>Tenant Portal</Text>
                      <Text style={styles.dropdownItemSub}>Pay rent, view ledger, maintenance</Text>
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
                <Menu size={24} color="#164E3A" />
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
                onPress={() => setMobileMenuOpen(false)}
                style={styles.mobileDrawerCloseBtn}
                accessibilityLabel="Close navigation menu"
              >
                <X size={24} color="#1F2937" />
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
                      <Icon size={18} color={isActive ? "#1B4D3E" : "#4B5563"} />
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
                  <Key size={16} color="#1B4D3E" />
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
                  <Users size={16} color="#1B4D3E" />
                  <Text style={styles.mobilePortalBtnText}>AppFolio Tenant Portal</Text>
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
    borderBottomColor: "#E5E7EB",
    zIndex: 100,
  },
  topBanner: {
    backgroundColor: "#113A2F",
    paddingVertical: 7,
    paddingHorizontal: 16,
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
    color: "#E6F4EA",
    fontSize: 12,
  },
  boldText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  topBannerPhone: {
    color: "#D1FAE5",
    fontSize: 12,
    fontWeight: "500",
  },
  topBannerDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#1E5642",
  },
  topBannerLink: {
    color: "#34D399",
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  mainNav: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    gap: 10,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#164E3A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: "#164E3A",
    letterSpacing: -0.5,
  },
  logoTextSub: {
    fontSize: 20,
    fontWeight: "600",
    color: "#059669",
    letterSpacing: -0.3,
  },
  logoBrokerSub: {
    fontSize: 10.5,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: -2,
  },
  desktopNavItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  navItemActive: {
    backgroundColor: "#ECFDF5",
  },
  navItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  navItemTextActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dropdownRelative: {
    position: "relative",
  },
  portalButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },
  portalButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    zIndex: 200,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  dropdownItemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  dropdownItemSub: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 4,
  },
  primaryCtaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#164E3A",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 7,
    shadowColor: "#164E3A",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  mobileMenuToggle: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  mobileDrawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  mobileDrawerContent: {
    width: "82%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    height: "100%",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  mobileDrawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logoMarkSmall: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#164E3A",
    justifyContent: "center",
    alignItems: "center",
  },
  logoTextMainSmall: {
    fontSize: 17,
    fontWeight: "800",
    color: "#164E3A",
  },
  logoBrokerSubSmall: {
    fontSize: 9.5,
    color: "#6B7280",
  },
  mobileDrawerCloseBtn: {
    padding: 6,
  },
  mobileLinksScroll: {
    marginTop: 12,
  },
  mobileLinksList: {
    gap: 4,
  },
  mobileNavItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  mobileNavItemActive: {
    backgroundColor: "#ECFDF5",
  },
  mobileNavText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  mobileNavTextActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  mobilePortalSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  mobileSectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  mobilePortalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginBottom: 8,
  },
  mobilePortalBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },
  mobileCtaSection: {
    marginTop: 16,
    gap: 10,
  },
  mobilePrimaryCta: {
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  mobilePrimaryCtaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  mobileSecondaryCta: {
    borderWidth: 1,
    borderColor: "#164E3A",
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
  },
  mobileSecondaryCtaText: {
    color: "#164E3A",
    fontSize: 14,
    fontWeight: "600",
  },
  mobileFooterCompliance: {
    marginTop: 30,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  mobileComplianceText: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 16,
  },
});
