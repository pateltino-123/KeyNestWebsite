import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from "react-native";
import {
  X,
  Key,
  Users,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  FileText,
  Wrench,
  DollarSign,
  Lock,
} from "lucide-react-native";
import { KEYNEST_INFO } from "@/constants/keynestData";

interface PortalLoginModalProps {
  visible: boolean;
  onClose: () => void;
  defaultTab?: "owner" | "tenant";
}

export default function PortalLoginModal({
  visible,
  onClose,
  defaultTab = "owner",
}: PortalLoginModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 540;
  const [activeTab, setActiveTab] = useState<"owner" | "tenant">(defaultTab);

  const openAppFolio = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxWidth: isDesktop ? 540 : "92%" }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.lockIconBox}>
                <Lock size={18} color="#3B6E99" />
              </View>
              <View>
                <Text style={styles.modalTitle}>KeyNest Client Portals</Text>
                <Text style={styles.modalSubtitle}>Powered securely by AppFolio</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close modal">
              <X size={20} color="#737B85" />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "owner" && styles.tabBtnActive]}
              onPress={() => setActiveTab("owner")}
            >
              <Key size={16} color={activeTab === "owner" ? "#3B6E99" : "#737B85"} />
              <Text style={[styles.tabBtnText, activeTab === "owner" && styles.tabBtnTextActive]}>
                Owner Portal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "tenant" && styles.tabBtnActive]}
              onPress={() => setActiveTab("tenant")}
            >
              <Users size={16} color={activeTab === "tenant" ? "#3B6E99" : "#737B85"} />
              <Text style={[styles.tabBtnText, activeTab === "tenant" && styles.tabBtnTextActive]}>
                Resident Portal
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentBody}>
            {activeTab === "owner" ? (
              <View style={styles.tabContent}>
                <View style={styles.portalBadge}>
                  <Text style={styles.portalBadgeText}>PROPERTY OWNER ACCESS</Text>
                </View>

                <Text style={styles.portalHeading}>Access Real-Time Owner Financials</Text>
                <Text style={styles.portalDescription}>
                  Review your monthly cash-flow statements, download 1099 tax forms, track maintenance work orders, and approve expenditures above authority limits.
                </Text>

                <View style={styles.featuresGrid}>
                  <View style={styles.featureItem}>
                    <DollarSign size={16} color="#3B6E99" />
                    <Text style={styles.featureText}>Monthly Direct ACH Cash-Flow Ledgers</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <FileText size={16} color="#3B6E99" />
                    <Text style={styles.featureText}>Signed Texas Leases & Inspection Reports</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Wrench size={16} color="#3B6E99" />
                    <Text style={styles.featureText}>Itemized Vendor Invoices (Zero Markup)</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.loginActionBtn}
                  onPress={() => openAppFolio(KEYNEST_INFO.appFolioOwnerPortalUrl)}
                >
                  <Text style={styles.loginActionText}>Launch AppFolio Owner Portal</Text>
                  <ExternalLink size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.helpText}>
                  Need help logging in? Email Dinesh or Purvang at {KEYNEST_INFO.email}
                </Text>
              </View>
            ) : (
              <View style={styles.tabContent}>
                <View style={styles.portalBadge}>
                  <Text style={styles.portalBadgeText}>
                    RESIDENT & TENANT ACCESS
                  </Text>
                </View>

                <Text style={styles.portalHeading}>Pay Rent & Submit Service Tickets</Text>
                <Text style={styles.portalDescription}>
                  Set up zero-fee ACH autopay, submit routine maintenance requests with photos, review your lease agreements, and access 24/7 account history.
                </Text>

                <View style={styles.featuresGrid}>
                  <View style={styles.featureItem}>
                    <CreditCard size={16} color="#3B6E99" />
                    <Text style={styles.featureText}>Fast Zero-Fee ACH Autopay & Card Options</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Wrench size={16} color="#3B6E99" />
                    <Text style={styles.featureText}>Submit Photos & Track Real-Time Repairs</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <FileText size={16} color="#3B6E99" />
                    <Text style={styles.featureText}>Digital Lease Records & Payment Receipts</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.loginActionBtn}
                  onPress={() => openAppFolio(KEYNEST_INFO.appFolioTenantPortalUrl)}
                >
                  <Text style={styles.loginActionText}>Launch AppFolio Resident Portal</Text>
                  <ExternalLink size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.helpText}>
                  Experiencing an urgent repair? Call 24/7 hotline: {KEYNEST_INFO.emergencyPhone}
                </Text>
              </View>
            )}

            <View style={styles.complianceFooter}>
              <ShieldCheck size={14} color="#64748B" />
              <Text style={styles.complianceText}>
                Encrypted 256-bit bank-grade transmission • Fair Deal Realty Inc.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
    backgroundColor: "#F7F3EB",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lockIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#EBF2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#22252A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#737B85",
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 6,
  },
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
    backgroundColor: "#FAF7F0",
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: "#3B6E99",
    backgroundColor: "#FFFFFF",
  },
  tabBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#737B85",
  },
  tabBtnTextActive: {
    color: "#3B6E99",
    fontWeight: "700",
  },
  contentBody: {
    padding: 24,
  },
  tabContent: {
    gap: 14,
  },
  portalBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EBF2F7",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  portalBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#3B6E99",
    letterSpacing: 0.8,
  },
  portalHeading: {
    fontSize: 18,
    fontWeight: "800",
    color: "#22252A",
  },
  portalDescription: {
    fontSize: 13.5,
    color: "#4A515A",
    lineHeight: 20,
  },
  featuresGrid: {
    backgroundColor: "#FAF7F0",
    borderRadius: 8,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    color: "#22252A",
    fontWeight: "500",
  },
  loginActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#3B6E99",
    paddingVertical: 13,
    borderRadius: 8,
    marginTop: 6,
    shadowColor: "#3B6E99",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  loginActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  helpText: {
    fontSize: 12,
    color: "#737B85",
    textAlign: "center",
    lineHeight: 16,
  },
  complianceFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E8E2D5",
  },
  complianceText: {
    fontSize: 11.5,
    color: "#737B85",
  },
});
