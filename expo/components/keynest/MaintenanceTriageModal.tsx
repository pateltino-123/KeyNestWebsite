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
  ExternalLink,
  ShieldAlert,
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
  const [entryPermission, setEntryPermission] = useState("Yes, enter if not home");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callEmergency = () => {
    Linking.openURL(`tel:${KEYNEST_INFO.emergencyPhone.replace(/[^0-9]/g, "")}`).catch(() => {});
  };

  const openAppFolioPortal = () => {
    Linking.openURL(KEYNEST_INFO.appFolioTenantPortalUrl).catch(() => {});
  };

  const handleRoutineSubmit = () => {
    if (!residentName.trim() || !propertyAddress.trim() || !description.trim()) {
      alert("Please complete the resident name, property address, and issue description.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTriageStep("success");
    }, 700);
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
                <Wrench size={20} color="#164E3A" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Maintenance & Repair Triage</Text>
                <Text style={styles.modalSubtitle}>
                  6-Step escalation workflow & rapid vendor dispatch
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} accessibilityLabel="Close modal">
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 20 }}>
            {/* Step 1: Classification Choice */}
            {triageStep === "classification" && (
              <View style={styles.contentWrap}>
                <Text style={styles.promptTitle}>What kind of issue are you experiencing?</Text>
                <Text style={styles.promptSub}>
                  To ensure resident safety and rapid vendor response, we triage all requests immediately.
                </Text>

                {/* Emergency Option Card */}
                <TouchableOpacity
                  style={styles.triageOptionCardDanger}
                  onPress={() => setTriageStep("emergency")}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.dangerIconBadge}>
                      <AlertTriangle size={20} color="#DC2626" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dangerTitle}>Emergency Maintenance (Immediate Action)</Text>
                      <Text style={styles.dangerSub}>
                        Active water flooding, smell of natural gas, electrical fire hazards, sewage backup, or AC out with heat &gt; 90°F.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardFooterDanger}>
                    <Text style={styles.cardFooterTextDanger}>View 24/7 Hotline & Emergency Steps →</Text>
                  </View>
                </TouchableOpacity>

                {/* Urgent Option Card */}
                <TouchableOpacity
                  style={styles.triageOptionCardUrgent}
                  onPress={() => {
                    setSelectedUrgency("Urgent");
                    setTriageStep("routine");
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.urgentIconBadge}>
                      <Clock size={20} color="#D97706" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.urgentTitle}>Urgent Request (24-Hour Dispatch)</Text>
                      <Text style={styles.urgentSub}>
                        Water heater failure, refrigerator not cooling, minor pipe leak with shut-off valve secure, garage door stuck.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardFooterUrgent}>
                    <Text style={styles.cardFooterTextUrgent}>Submit Urgent Work Order →</Text>
                  </View>
                </TouchableOpacity>

                {/* Routine Option Card */}
                <TouchableOpacity
                  style={styles.triageOptionCardRoutine}
                  onPress={() => {
                    setSelectedUrgency("Routine");
                    setTriageStep("routine");
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionHeader}>
                    <View style={styles.routineIconBadge}>
                      <Wrench size={20} color="#164E3A" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.routineTitle}>Routine Maintenance (24–48 Hour Target)</Text>
                      <Text style={styles.routineSub}>
                        Dripping faucet, garbage disposal jam, sprinkler head adjustment, interior door latch, light fixtures.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardFooterRoutine}>
                    <Text style={styles.cardFooterTextRoutine}>Submit Routine Ticket or Open Portal →</Text>
                  </View>
                </TouchableOpacity>

                {/* Direct AppFolio Link */}
                <View style={styles.directPortalLinkBox}>
                  <Text style={styles.directPortalText}>
                    Existing resident? For fastest tracking and photo uploads:
                  </Text>
                  <TouchableOpacity
                    style={styles.appFolioBtn}
                    onPress={openAppFolioPortal}
                  >
                    <Text style={styles.appFolioBtnText}>Open AppFolio Resident Portal</Text>
                    <ExternalLink size={14} color="#164E3A" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Emergency View */}
            {triageStep === "emergency" && (
              <View style={styles.contentWrap}>
                <View style={styles.emergencyAlertBanner}>
                  <ShieldAlert size={28} color="#B91C1C" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.emergencyAlertHeading}>EMERGENCY PROTOCOL ACTIVE</Text>
                    <Text style={styles.emergencyAlertBody}>
                      If there is an immediate threat to life, fire, or gas explosion hazard, immediately call 911 first, then notify KeyNest.
                    </Text>
                  </View>
                </View>

                <View style={styles.emergencyActionsList}>
                  <Text style={styles.actionsListHeading}>Immediate Steps Before Technician Arrival:</Text>
                  <Text style={styles.actionItem}>
                    1. <Text style={{ fontWeight: "700" }}>Active Water Leak:</Text> Shut off the main water valve at the house or street cut-off immediately to prevent structural damage.
                  </Text>
                  <Text style={styles.actionItem}>
                    2. <Text style={{ fontWeight: "700" }}>Smell of Gas:</Text> Evacuate premises immediately. Do not flip light switches or ignite flames. Call Atmos Energy (1-866-322-8667) and 911.
                  </Text>
                  <Text style={styles.actionItem}>
                    3. <Text style={{ fontWeight: "700" }}>Electrical Sparking:</Text> Turn off the relevant breaker at the electrical subpanel if safe to do so.
                  </Text>
                </View>

                {/* Emergency Phone CTA */}
                <TouchableOpacity style={styles.emergencyCallBtn} onPress={callEmergency}>
                  <PhoneCall size={22} color="#FFFFFF" />
                  <View>
                    <Text style={styles.callBtnMain}>Call 24/7 Dispatch: {KEYNEST_INFO.emergencyPhone}</Text>
                    <Text style={styles.callBtnSub}>Live on-call coordinator available 24/7/365</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setTriageStep("classification")}
                >
                  <Text style={styles.backBtnText}>← Back to Maintenance Options</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Routine & Urgent Ticket Submission Form */}
            {triageStep === "routine" && (
              <View style={styles.formWrap}>
                <View style={styles.urgencyBadgeRow}>
                  <Text style={styles.ticketTypeTag}>Classification: {selectedUrgency.toUpperCase()}</Text>
                  <TouchableOpacity onPress={() => setTriageStep("classification")}>
                    <Text style={styles.changeTagLink}>Change</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Resident Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. John Doe"
                    placeholderTextColor="#9CA3AF"
                    value={residentName}
                    onChangeText={setResidentName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Property Street Address & City *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 4218 Shoreline Trail, The Colony"
                    placeholderTextColor="#9CA3AF"
                    value={propertyAddress}
                    onChangeText={setPropertyAddress}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Contact Phone Number *</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="phone-pad"
                      placeholder="(972) 000-0000"
                      placeholderTextColor="#9CA3AF"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Category</Text>
                    <TextInput
                      style={styles.input}
                      value={issueCategory}
                      onChangeText={setIssueCategory}
                      placeholder="Plumbing, HVAC, Electrical, Appliance"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Detailed Description of the Issue *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    multiline
                    numberOfLines={4}
                    placeholder="Where is the issue located? When did it start? Any troubleshooting steps taken?"
                    placeholderTextColor="#9CA3AF"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Permission to Enter</Text>
                  <View style={styles.chipsRow}>
                    {["Yes, enter if not home", "No, schedule appointment with me"].map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.chip, entryPermission === opt && styles.chipActive]}
                        onPress={() => setEntryPermission(opt)}
                      >
                        <Text style={[styles.chipText, entryPermission === opt && styles.chipTextActive]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.submitWorkOrderBtn}
                  onPress={handleRoutineSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitWorkOrderBtnText}>Dispatch Request to Operations Queue</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => setTriageStep("classification")}
                >
                  <Text style={styles.backBtnText}>← Back to Triage Options</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Submission Success */}
            {triageStep === "success" && (
              <View style={styles.successWrap}>
                <View style={styles.successBadge}>
                  <CheckCircle2 size={50} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>Maintenance Work Order Logged!</Text>
                <Text style={styles.successSub}>
                  Your ticket has entered {"KeyNest's"} 6-step escalation workflow.
                </Text>

                <View style={styles.stepsMiniCard}>
                  <Text style={styles.miniCardTitle}>6-Step SLA Process:</Text>
                  <Text style={styles.miniStep}>1. Intake logged in KeyNest Operations Queue.</Text>
                  <Text style={styles.miniStep}>2. Triaged & owner spending limit verified ($350–$500).</Text>
                  <Text style={styles.miniStep}>3. Vetted, insured technician assigned.</Text>
                  <Text style={styles.miniStep}>4. Technician contacts you to confirm access window.</Text>
                  <Text style={styles.miniStep}>5. Work documented with before/after photos.</Text>
                  <Text style={styles.miniStep}>6. Closed out on AppFolio portal statement.</Text>
                </View>

                <TouchableOpacity style={styles.closeSuccessBtn} onPress={handleClose}>
                  <Text style={styles.closeSuccessBtnText}>Done</Text>
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
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxHeight: "90%",
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#164E3A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  modalScroll: {
    flexGrow: 0,
  },
  contentWrap: {
    gap: 14,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  promptSub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: -8,
  },
  triageOptionCardDanger: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    padding: 14,
    gap: 10,
  },
  optionHeader: {
    flexDirection: "row",
    gap: 12,
  },
  dangerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#991B1B",
  },
  dangerSub: {
    fontSize: 12,
    color: "#B91C1C",
    lineHeight: 16,
    marginTop: 2,
  },
  cardFooterDanger: {
    borderTopWidth: 1,
    borderTopColor: "#FECACA",
    paddingTop: 8,
  },
  cardFooterTextDanger: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
  },
  triageOptionCardUrgent: {
    backgroundColor: "#FFFBEB",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#FDE68A",
    padding: 14,
    gap: 10,
  },
  urgentIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  urgentTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#92400E",
  },
  urgentSub: {
    fontSize: 12,
    color: "#B45309",
    lineHeight: 16,
    marginTop: 2,
  },
  cardFooterUrgent: {
    borderTopWidth: 1,
    borderTopColor: "#FDE68A",
    paddingTop: 8,
  },
  cardFooterTextUrgent: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
  },
  triageOptionCardRoutine: {
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#BBF7D0",
    padding: 14,
    gap: 10,
  },
  routineIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },
  routineTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#166534",
  },
  routineSub: {
    fontSize: 12,
    color: "#15803D",
    lineHeight: 16,
    marginTop: 2,
  },
  cardFooterRoutine: {
    borderTopWidth: 1,
    borderTopColor: "#BBF7D0",
    paddingTop: 8,
  },
  cardFooterTextRoutine: {
    fontSize: 12,
    fontWeight: "700",
    color: "#166534",
  },
  directPortalLinkBox: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  directPortalText: {
    fontSize: 12,
    color: "#4B5563",
  },
  appFolioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  appFolioBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#164E3A",
  },
  emergencyAlertBanner: {
    backgroundColor: "#FEF2F2",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    flexDirection: "row",
    gap: 12,
  },
  emergencyAlertHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: "#991B1B",
  },
  emergencyAlertBody: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 4,
    lineHeight: 17,
  },
  emergencyActionsList: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  actionsListHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  actionItem: {
    fontSize: 12.5,
    color: "#374151",
    lineHeight: 18,
  },
  emergencyCallBtn: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 6,
  },
  callBtnMain: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  callBtnSub: {
    color: "#FEE2E2",
    fontSize: 11,
  },
  backBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  backBtnText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "600",
  },
  formWrap: {
    gap: 12,
  },
  urgencyBadgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  ticketTypeTag: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
  },
  changeTagLink: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 7,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  chipActive: {
    borderColor: "#164E3A",
    backgroundColor: "#ECFDF5",
  },
  chipText: {
    fontSize: 12,
    color: "#4B5563",
  },
  chipTextActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  submitWorkOrderBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitWorkOrderBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  successWrap: {
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  successBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#164E3A",
  },
  successSub: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
  },
  stepsMiniCard: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  miniCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  miniStep: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 17,
  },
  closeSuccessBtn: {
    width: "100%",
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  closeSuccessBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
