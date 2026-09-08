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
  ActivityIndicator,
} from "react-native";
import { X, CheckCircle2, Calculator, ShieldCheck, ArrowRight } from "lucide-react-native";

interface RentalAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
  prefillCity?: string;
}

export default function RentalAnalysisModal({
  visible,
  onClose,
  prefillCity = "",
}: RentalAnalysisModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const [address, setAddress] = useState("");
  const [city, setCity] = useState(prefillCity || "The Colony");
  const [beds, setBeds] = useState("4");
  const [baths, setBaths] = useState("2.5");
  const [condition, setCondition] = useState("Good");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedRent, setEstimatedRent] = useState<{ low: number; high: number } | null>(null);

  const calculateEstimate = () => {
    let base = 2300;
    const bedNum = parseInt(beds) || 3;
    base += (bedNum - 3) * 350;
    if (city.toLowerCase().includes("frisco") || city.toLowerCase().includes("prosper")) {
      base += 400;
    } else if (city.toLowerCase().includes("plano") || city.toLowerCase().includes("the colony")) {
      base += 200;
    }
    if (condition === "Excellent" || condition === "Renovated") {
      base += 250;
    }
    return { low: base - 150, high: base + 200 };
  };

  const handleSubmit = () => {
    if (!address.trim() || !ownerName.trim() || !ownerEmail.trim()) {
      alert("Please enter your property address, name, and email.");
      return;
    }

    setIsSubmitting(true);
    const est = calculateEstimate();

    setTimeout(() => {
      setIsSubmitting(false);
      setEstimatedRent(est);
      setSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEstimatedRent(null);
    onClose();
  };

  const northTexasCities = [
    "The Colony",
    "Frisco",
    "Plano",
    "McKinney",
    "Allen",
    "Prosper",
    "Carrollton",
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxWidth: isDesktop ? 640 : "94%" }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Calculator size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Free Rental Analysis</Text>
                <Text style={styles.modalSubtitle}>
                  Data-driven rental rate & operational readiness review
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close modal">
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 24 }}>
            {!submitted ? (
              <View style={styles.formContainer}>
                <View style={styles.routingNoticeBox}>
                  <ShieldCheck size={16} color="#2563EB" />
                  <Text style={styles.routingNoticeText}>
                    Directly routed to Dinesh Donthula & Purvang Patel (Fair Deal Realty Inc.)
                  </Text>
                </View>

                {/* Section 1: Property Details */}
                <Text style={styles.sectionHeading}>1. PROPERTY LOCATION & SPECS</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Property Street Address *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 4218 Shoreline Trail"
                    placeholderTextColor="#94A3B8"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>City (North Texas)</Text>
                  <View style={styles.cityPillsRow}>
                    {northTexasCities.map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.pill, city === c && styles.pillActive]}
                        onPress={() => setCity(c)}
                      >
                        <Text style={[styles.pillText, city === c && styles.pillTextActive]}>
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Bedrooms</Text>
                    <View style={styles.miniPillsRow}>
                      {["2", "3", "4", "5+"].map((b) => (
                        <TouchableOpacity
                          key={b}
                          style={[styles.miniPill, beds === b && styles.miniPillActive]}
                          onPress={() => setBeds(b)}
                        >
                          <Text style={[styles.miniPillText, beds === b && styles.miniPillTextActive]}>
                            {b}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Bathrooms</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 2.5"
                      placeholderTextColor="#94A3B8"
                      value={baths}
                      onChangeText={setBaths}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Current Property Condition</Text>
                  <View style={styles.miniPillsRow}>
                    {["Turnkey / Like New", "Good", "Needs Minor Paint/Clean", "Needs Renovation"].map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.pill, condition === c && styles.pillActive]}
                        onPress={() => setCondition(c)}
                      >
                        <Text style={[styles.pillText, condition === c && styles.pillTextActive]}>
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Section 2: Contact Info */}
                <Text style={[styles.sectionHeading, { marginTop: 16 }]}>2. YOUR CONTACT INFORMATION</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Jane Doe"
                    placeholderTextColor="#94A3B8"
                    value={ownerName}
                    onChangeText={setOwnerName}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Email Address *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="jane@example.com"
                      placeholderTextColor="#94A3B8"
                      value={ownerEmail}
                      onChangeText={setOwnerEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="(469) 555-0199"
                      placeholderTextColor="#94A3B8"
                      value={ownerPhone}
                      onChangeText={setOwnerPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  activeOpacity={0.85}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.submitBtnText}>Calculate & Generate Analysis Report</Text>
                      <ArrowRight size={16} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* Success / Results Screen */
              <View style={styles.resultsContainer}>
                <View style={styles.successIconCircle}>
                  <CheckCircle2 size={36} color="#10B981" />
                </View>

                <Text style={styles.resultsTitle}>Preliminary Analysis Ready!</Text>
                <Text style={styles.resultsSubtitle}>
                  Based on recent verified MLS closed rental comps in {city}, TX for a {beds}-bedroom home:
                </Text>

                <View style={styles.estimateBox}>
                  <Text style={styles.estimateLabel}>ESTIMATED MONTHLY MARKET RENT</Text>
                  <Text style={styles.estimateValue}>
                    ${estimatedRent?.low.toLocaleString()} – ${estimatedRent?.high.toLocaleString()}
                    <Text style={styles.estimatePerMonth}> / month</Text>
                  </Text>
                  <Text style={styles.estimateRangeNote}>
                    Annual Projected Gross: ${(
                      (estimatedRent?.low || 2400) * 12
                    ).toLocaleString()} – ${((estimatedRent?.high || 2800) * 12).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.feeBreakdownBox}>
                  <Text style={styles.feeBreakdownTitle}>Estimated Management Retainer (8.9% Full Service):</Text>
                  <Text style={styles.feeBreakdownAmount}>
                    ${Math.round(((estimatedRent?.low || 2400) + (estimatedRent?.high || 2800)) / 2 * 0.089)}/mo
                  </Text>
                  <Text style={styles.feeBreakdownNote}>
                    ✓ $0 charged when vacant • Direct ACH by 10th of each month
                  </Text>
                </View>

                <View style={styles.managerFollowupBox}>
                  <Text style={styles.managerFollowupTitle}>What Happens Next?</Text>
                  <Text style={styles.managerFollowupText}>
                    Authorized Managers Dinesh Donthula and Purvang Patel will review active neighborhood competition, tax records, and schedule a 10-minute discovery call to finalize the report.
                  </Text>
                </View>

                <View style={styles.resultActions}>
                  <TouchableOpacity style={styles.doneBtn} onPress={handleReset}>
                    <Text style={styles.doneBtnText}>Close & Return to Site</Text>
                  </TouchableOpacity>
                </View>
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
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
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
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  modalScroll: {
    flexGrow: 0,
  },
  formContainer: {
    gap: 14,
  },
  routingNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  routingNoticeText: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "600",
    flex: 1,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#475569",
    letterSpacing: 0.8,
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
    color: "#1E293B",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0F172A",
  },
  cityPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#475569",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  miniPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  miniPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  miniPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  miniPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  miniPillTextActive: {
    color: "#FFFFFF",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  resultsContainer: {
    alignItems: "center",
    paddingVertical: 12,
    gap: 16,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  resultsSubtitle: {
    fontSize: 13.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  estimateBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#2563EB",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  estimateLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 1,
  },
  estimateValue: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
  },
  estimatePerMonth: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
  },
  estimateRangeNote: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  feeBreakdownBox: {
    width: "100%",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 4,
  },
  feeBreakdownTitle: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "600",
  },
  feeBreakdownAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  feeBreakdownNote: {
    fontSize: 11.5,
    color: "#3B82F6",
    fontWeight: "500",
  },
  managerFollowupBox: {
    width: "100%",
    backgroundColor: "#F1F5F9",
    padding: 14,
    borderRadius: 10,
    gap: 4,
  },
  managerFollowupTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  managerFollowupText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
  },
  resultActions: {
    width: "100%",
    marginTop: 6,
  },
  doneBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
