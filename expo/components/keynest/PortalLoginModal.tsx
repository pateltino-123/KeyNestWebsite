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
        <View style={[styles.modalCard, { maxWidth: isDesktop ? 520 : "92%" }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.lockIconBox}>
                <Lock size={18} color="#164E3A" />
              </View>
              <View>
                <Text style={styles.modalTitle}>KeyNest Client Portals</Text>
                <Text style={styles.modalSubtitle}>Powered securely by AppFolio</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close modal">
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "owner" && styles.tabBtnActive]}
              onPress={() => setActiveTab("owner")}
            >
              <Key size={16} color={activeTab === "owner" ? "#164E3A" : "#6B7280"} />
              <Text style={[styles.tabBtnText, activeTab === "owner" && styles.tabBtnTextActive]}>
                Owner Portal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === "tenant" && styles.tabBtnActive]}
              onPress={() => setActiveTab("tenant")}
            >
              <Users size={16} color={activeTab === "tenant" ? "#164E3A" : "#6B7280"} />
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
                    <DollarSign size={16} color="#059669" />
                    <Text style={styles.featureText}>Monthly ACH Distribution Records</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <FileText size={16} color="#059669" />
                    <Text style={styles.featureText}>Detailed Cash Flow & Expense Ledger</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Wrench size={16} color="#059669" />
                    <Text style={styles.featureText}>Maintenance Invoices & Photo Logs</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <ShieldCheck size={16} color="#059669" />
                    <Text style={styles.featureText}>Executed Texas Leases & Addenda</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.launchPortalBtn}
                  onPress={() => openAppFolio(KEYNEST_INFO.appFolioOwnerPortalUrl)}
                >
                  <Text style={styles.launchPortalBtnText}>Log In to AppFolio Owner Portal</Text>
                  <ExternalLink size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.tabContent}>
                <View style={styles.portalBadge}>
                  <Text style={styles.portalBadgeText}>RESIDENT & TENANT ACCESS</Text>
                </View>

                <Text style={styles.portalHeading}>Pay Rent & Request Maintenance</Text>
                <Text style={styles.portalDescription}>
                  Pay rent online with zero-fee ACH or credit card, set up autopay reminders, view your ledger balance, and submit 24/7 maintenance requests.
                </Text>

                <View style={styles.featuresGrid}>
                  <View style={styles.featureItem}>
                    <CreditCard size={16} color="#059669" />
                    <Text style={styles.featureText}>Instant Online Rent Payments & Autopay</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Wrench size={16} color="#059669" />
                    <Text style={styles.featureText}>Track Maintenance Tickets in Real Time</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <FileText size={16} color="#059669" />
                    <Text style={styles.featureText}>Access Digital Copy of Your Texas Lease</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <ShieldCheck size={16} color="#059669" />
                    <Text style={styles.featureText}>256-Bit Encrypted Payment Security</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.launchPortalBtn}
                  onPress={() => openAppFolio(KEYNEST_INFO.appFolioTenantPortalUrl)}
                >
                  <Text style={styles.launchPortalBtnText}>Log In to AppFolio Resident Portal</Text>
                  <ExternalLink size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.securityFooter}>
              <ShieldCheck size={14} color="#059669" />
              <Text style={styles.securityText}>
                Encrypted bank-grade authentication. Sensitive documents and payments are never processed over unencrypted web forms.
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
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  lockIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#164E3A",
  },
  modalSubtitle: {
    fontSize: 11.5,
    color: "#6B7280",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderBottomColor: "#164E3A",
  },
  tabBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabBtnTextActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  contentBody: {
    padding: 20,
    gap: 16,
  },
  tabContent: {
    gap: 12,
  },
  portalBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  portalBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#065F46",
    letterSpacing: 0.5,
  },
  portalHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  portalDescription: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
  featuresGrid: {
    gap: 8,
    marginVertical: 4,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 12.5,
    color: "#374151",
    fontWeight: "500",
  },
  launchPortalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#164E3A",
    paddingVertical: 13,
    borderRadius: 8,
    marginTop: 6,
  },
  launchPortalBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  securityFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  securityText: {
    fontSize: 11,
    color: "#6B7280",
    lineHeight: 15,
    flex: 1,
  },
});
