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
  const isDesktop = width >= 1080;
  const isTablet = width >= 768 && width < 1080;
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
            <ShieldCheck size={14} color="#38BDF8" />
            <Text style={styles.topBannerText}>
              <Text style={styles.boldText}>KeyNest Realty</Text> • Under the Brokerage of{" "}
              <Text style={styles.boldText}>Fair Deal Realty Inc.</Text> • TREC Licensed
            </Text>
          </View>
          <View style={styles.topBannerRight}>
            <Phone size={13} color="#93C5FD" />
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
                  <Key size={14} color="#2563EB" />
                  <Text style={styles.portalButtonText}>Client Portals</Text>
                  <ChevronDown size={14} color="#64748B" />
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
                        <Key size={14} color="#2563EB" />
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
                        <Users size={14} color="#2563EB" />
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
                <Menu size={24} color="#0F172A" />
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
                      <Icon size={18} color={isActive ? "#2563EB" : "#64748B"} />
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
                  <Key size={16} color="#2563EB" />
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
                  <Users size={16} color="#2563EB" />
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
    borderBottomColor: "#E2E8F0",
    zIndex: 100,
  },
  topBanner: {
    backgroundColor: "#0B1120",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
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
    color: "#94A3B8",
    fontSize: 12,
  },
  boldText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  topBannerPhone: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "600",
  },
  topBannerDivider: {
    width: 1,
    height: 12,
    backgroundColor: "#334155",
  },
  topBannerLink: {
    color: "#38BDF8",
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
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  logoTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  logoTextMain: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  logoTextSub: {
    fontSize: 21,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: -0.5,
  },
  logoBrokerSub: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginTop: -2,
  },
  desktopNavItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: "#EFF6FF",
  },
  navItemText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#334155",
  },
  navItemTextActive: {
    color: "#2563EB",
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
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
  },
  portalButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  dropdownMenu: {
    position: "absolute",
    top: 42,
    right: 0,
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 6,
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 200,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownItemIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownItemTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  dropdownItemSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
  primaryCtaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryCtaText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  mobileMenuToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  mobileDrawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  mobileDrawerContent: {
    width: "82%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    height: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  mobileDrawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  logoMarkSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  logoTextMainSmall: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  logoBrokerSubSmall: {
    fontSize: 10,
    color: "#64748B",
  },
  closeDrawerBtn: {
    padding: 6,
    borderRadius: 8,
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
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  mobileNavItemActive: {
    backgroundColor: "#EFF6FF",
  },
  mobileNavText: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
  },
  mobileNavTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  mobilePortalSection: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  mobileSectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  mobilePortalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  mobilePortalBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#0F172A",
  },
  mobileCtaSection: {
    padding: 16,
    gap: 10,
  },
  mobilePrimaryCta: {
    backgroundColor: "#2563EB",
    paddingVertical: 13,
    borderRadius: 8,
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
    borderColor: "#CBD5E1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  mobileSecondaryCtaText: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "600",
  },
  mobileFooterCompliance: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 4,
  },
  mobileComplianceText: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 16,
  },
});
