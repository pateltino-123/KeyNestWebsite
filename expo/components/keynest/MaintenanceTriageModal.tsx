import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  X,
  AlertTriangle,
  PhoneCall,
  Wrench,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
} from "lucide-react-native";
import { KEYNEST_INFO } from "@/constants/keynestData";

interface MaintenanceTriageModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MaintenanceTriageModal({
  visible,
  onClose,
}: MaintenanceTriageModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const [triageStep, setTriageStep] = useState<"classification" | "emergency" | "routine" | "success">("classification");
  const [selectedUrgency, setSelectedUrgency] = useState<"Emergency" | "Urgent" | "Routine">("Routine");
  const [residentName, setResidentName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [issueCategory, setIssueCategory] = useState("Plumbing");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callEmergency = () => {
    Linking.openURL(`tel:${KEYNEST_INFO.emergencyPhone.replace(/[^0-9]/g, "")}`).catch(() => {});
  };

  const openAppFolioPortal = () => {
    Linking.openURL(KEYNEST_INFO.appFolioTenantPortalUrl).catch(() => {});
  };

  const handleRoutineSubmit = () => {
    if (!residentName.trim() || !propertyAddress.trim() || !description.trim()) {
      alert("Please complete your name, property address, and issue description.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTriageStep("success");
    }, 600);
  };

  const handleClose = () => {
    setTriageStep("classification");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxWidth: isDesktop ? 620 : "94%" }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Wrench size={20} color="#3B6E99" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Maintenance & Repair Triage</Text>
                <Text style={styles.modalSubtitle}>
                  6-Step escalation workflow & rapid vendor dispatch
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} accessibilityLabel="Close modal">
              <X size={20} color="#737B85" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 24 }}>
            {/* Step 1: Classification Choice */}
            {triageStep === "classification" && (
              <View style={styles.contentWrap}>
                <Text style={styles.promptTitle}>Select Issue Severity Level</Text>
                <Text style={styles.promptSub}>
                  KeyNest follows a strict 3-tier triage system to ensure true safety threats receive immediate emergency attention.
                </Text>

                {/* Severity Card 1: Emergency */}
                <TouchableOpacity
                  style={[styles.severityCard, styles.severityEmergency]}
                  onPress={() => {
                    setSelectedUrgency("Emergency");
                    setTriageStep("emergency");
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.severityIconCircleRed}>
                    <ShieldAlert size={22} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.severityBadgeRed}>
                      <Text style={styles.severityBadgeRedText}>TIER 1: EMERGENCY (IMMEDIATE)</Text>
                    </View>
                    <Text style={styles.severityTitle}>Active Flooding, Fire, Gas, or Complete AC Loss (&gt;90°F)</Text>
                    <Text style={styles.severityDesc}>
                      Threats to life or major property damage. Dispatched 24/7/365 within 1–2 hours.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Severity Card 2: Urgent */}
                <TouchableOpacity
                  style={[styles.severityCard, styles.severityUrgent]}
                  onPress={() => {
                    setSelectedUrgency("Urgent");
                    setTriageStep("routine");
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.severityIconCircleAmber}>
                    <AlertTriangle size={22} color="#D97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.severityBadgeAmber}>
                      <Text style={styles.severityBadgeAmberText}>TIER 2: URGENT (12–24 HOURS)</Text>
                    </View>
                    <Text style={styles.severityTitle}>Water Heater Failure, Refrigerator Out, Minor Drain Leak</Text>
                    <Text style={styles.severityDesc}>
                      Essential appliances or partial plumbing impairments. Vendor dispatched same or next business day.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Severity Card 3: Routine */}
                <TouchableOpacity
                  style={[styles.severityCard, styles.severityRoutine]}
                  onPress={() => {
                    setSelectedUrgency("Routine");
                    setTriageStep("routine");
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.severityIconCircleBlue}>
                    <Clock size={22} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.severityBadgeBlue}>
                      <Text style={styles.severityBadgeBlueText}>TIER 3: ROUTINE (24–48 HOURS)</Text>
                    </View>
                    <Text style={styles.severityTitle}>Dripping Faucet, Garbage Disposal, Fence Latch, Light Fixture</Text>
                    <Text style={styles.severityDesc}>
                      Non-urgent cosmetic or convenience items. Scheduled directly via your AppFolio tenant portal.
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.directPortalLink}
                  onPress={openAppFolioPortal}
                >
                  <Text style={styles.directPortalLinkText}>
                    Already have an active ticket? Track it in AppFolio →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2A: Emergency Escalation */}
            {triageStep === "emergency" && (
              <View style={styles.contentWrap}>
                <View style={styles.emergencyWarningBanner}>
                  <ShieldAlert size={28} color="#DC2626" />
                  <Text style={styles.emergencyWarningTitle}>Emergency Hotline Protocol</Text>
                  <Text style={styles.emergencyWarningText}>
                    If this is a gas leak or fire, vacate the premises immediately and call 911. For active water floods, turn off the main water shutoff valve immediately.
                  </Text>
                </View>

                <View style={styles.emergencyActionCard}>
                  <Text style={styles.emergencyActionLabel}>24/7 DEDICATED EMERGENCY HOTLINE:</Text>
                  <Text style={styles.emergencyPhoneNumber}>{KEYNEST_INFO.emergencyPhone}</Text>
                  <Text style={styles.emergencyActionSub}>
                    Answered by local on-call technicians authorized under Fair Deal Realty Inc.
                  </Text>

                  <TouchableOpacity style={styles.callNowBtn} onPress={callEmergency}>
                    <PhoneCall size={18} color="#FFFFFF" />
                    <Text style={styles.callNowBtnText}>Call Emergency Hotline Now</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.backLink}
                  onPress={() => setTriageStep("classification")}
                >
                  <Text style={styles.backLinkText}>← Back to Severity Selection</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2B: Ticket Intake Form (Urgent / Routine) */}
            {triageStep === "routine" && (
              <View style={styles.contentWrap}>
                <View style={styles.selectedUrgencyBanner}>
                  <Text style={styles.selectedUrgencyBannerText}>
                    Logging: <Text style={{ fontWeight: "700" }}>{selectedUrgency} Priority Request</Text>
                  </Text>
                  <TouchableOpacity onPress={() => setTriageStep("classification")}>
                    <Text style={styles.changeUrgencyLink}>Change</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Resident Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. John Smith"
                    placeholderTextColor="#94A3B8"
                    value={residentName}
                    onChangeText={setResidentName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Rental Property Address *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 5204 Lakewood Drive, The Colony"
                    placeholderTextColor="#94A3B8"
                    value={propertyAddress}
                    onChangeText={setPropertyAddress}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="(469) 555-0199"
                      placeholderTextColor="#94A3B8"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Issue Category</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Plumbing / HVAC / Electrical"
                      placeholderTextColor="#94A3B8"
                      value={issueCategory}
                      onChangeText={setIssueCategory}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Detailed Description of the Issue *</Text>
                  <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                    placeholder="Describe where the issue is, when it started, and if any breaker was tripped or valve shut."
                    placeholderTextColor="#94A3B8"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleRoutineSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.submitBtnText}>Submit Maintenance Ticket</Text>
                      <ArrowRight size={16} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Success Confirmation */}
            {triageStep === "success" && (
              <View style={styles.successWrap}>
                <View style={styles.successIconCircle}>
                  <CheckCircle2 size={40} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>Maintenance Ticket Created</Text>
                <Text style={styles.successSub}>
                  Your ticket has been logged into KeyNest maintenance triage and routed to our local North Texas trade partner network.
                </Text>

                <View style={styles.ticketDetailsCard}>
                  <View style={styles.ticketRow}>
                    <Text style={styles.ticketLabel}>Status:</Text>
                    <Text style={styles.ticketVal}>Triage Stage 2 (Vendor Dispatched)</Text>
                  </View>
                  <View style={styles.ticketRow}>
                    <Text style={styles.ticketLabel}>Property:</Text>
                    <Text style={styles.ticketVal}>{propertyAddress}</Text>
                  </View>
                  <View style={styles.ticketRow}>
                    <Text style={styles.ticketLabel}>Severity:</Text>
                    <Text style={styles.ticketVal}>{selectedUrgency}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                  <Text style={styles.doneBtnText}>Close Window</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
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
    maxHeight: "90%",
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
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
    backgroundColor: "#F7F3EB",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconCircle: {
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
  modalScroll: {
    flexGrow: 0,
  },
  contentWrap: {
    gap: 14,
  },
  promptTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#22252A",
  },
  promptSub: {
    fontSize: 13,
    color: "#737B85",
    lineHeight: 19,
    marginBottom: 4,
  },
  severityCard: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  severityEmergency: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  severityUrgent: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  severityRoutine: {
    backgroundColor: "#FAF7F0",
    borderColor: "#E8E2D5",
  },
  severityIconCircleRed: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  severityIconCircleAmber: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  severityIconCircleBlue: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#EBF2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  severityBadgeRed: {
    alignSelf: "flex-start",
    backgroundColor: "#DC2626",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  severityBadgeRedText: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  severityBadgeAmber: {
    alignSelf: "flex-start",
    backgroundColor: "#D97706",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  severityBadgeAmberText: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  severityBadgeBlue: {
    alignSelf: "flex-start",
    backgroundColor: "#3B6E99",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  severityBadgeBlueText: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  severityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22252A",
    lineHeight: 20,
  },
  severityDesc: {
    fontSize: 12,
    color: "#737B85",
    marginTop: 4,
    lineHeight: 17,
  },
  directPortalLink: {
    alignSelf: "center",
    paddingVertical: 6,
  },
  directPortalLinkText: {
    color: "#3B6E99",
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  emergencyWarningBanner: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  emergencyWarningTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#991B1B",
  },
  emergencyWarningText: {
    fontSize: 13,
    color: "#7F1D1D",
    textAlign: "center",
    lineHeight: 19,
  },
  emergencyActionCard: {
    backgroundColor: "#FAF7F0",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  emergencyActionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#737B85",
    letterSpacing: 0.8,
  },
  emergencyPhoneNumber: {
    fontSize: 26,
    fontWeight: "900",
    color: "#22252A",
  },
  emergencyActionSub: {
    fontSize: 12,
    color: "#737B85",
    textAlign: "center",
  },
  callNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#DC2626",
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 6,
  },
  callNowBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  backLink: {
    alignSelf: "center",
    paddingVertical: 8,
  },
  backLinkText: {
    color: "#737B85",
    fontSize: 13,
    fontWeight: "600",
  },
  selectedUrgencyBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EBF2F7",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C8D9E8",
  },
  selectedUrgencyBannerText: {
    fontSize: 13,
    color: "#2E567A",
  },
  changeUrgencyLink: {
    color: "#3B6E99",
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  inputGroup: {
    gap: 6,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#22252A",
  },
  input: {
    backgroundColor: "#FAF7F0",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#22252A",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#3B6E99",
    paddingVertical: 13,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: "#3B6E99",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  successWrap: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 14,
  },
  successIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EBF5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#22252A",
    textAlign: "center",
  },
  successSub: {
    fontSize: 13.5,
    color: "#737B85",
    textAlign: "center",
    lineHeight: 20,
  },
  ticketDetailsCard: {
    width: "100%",
    backgroundColor: "#FAF7F0",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 8,
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ticketLabel: {
    fontSize: 12.5,
    color: "#737B85",
  },
  ticketVal: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#22252A",
  },
  doneBtn: {
    width: "100%",
    backgroundColor: "#22252A",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 8,
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
