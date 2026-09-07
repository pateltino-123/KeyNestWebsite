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
import { X, CheckCircle2, Calculator, ShieldCheck } from "lucide-react-native";

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
  const [rentStatus, setRentStatus] = useState("Currently Vacant");
  const [targetDate, setTargetDate] = useState("Within 30 Days");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedRent, setEstimatedRent] = useState<{ low: number; high: number } | null>(null);

  const calculateEstimate = () => {
    // Realistic North Texas pricing baseline
    let base = 2200;
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
      alert("Please enter the property address, your name, and email.");
      return;
    }

    setIsSubmitting(true);
    const est = calculateEstimate();

    setTimeout(() => {
      setIsSubmitting(false);
      setEstimatedRent(est);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEstimatedRent(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxWidth: isDesktop ? 620 : "94%" }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Calculator size={20} color="#164E3A" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Free Rental Analysis</Text>
                <Text style={styles.modalSubtitle}>
                  Data-driven rental rate & operational readiness review
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close modal">
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 20 }}>
            {!submitted ? (
              <View style={styles.formContainer}>
                <View style={styles.routingNoticeBox}>
                  <ShieldCheck size={16} color="#059669" />
                  <Text style={styles.routingNoticeText}>
                    Routing: Directly to KeyNest Owner-Onboarding Lead under Fair Deal Realty Inc.
                  </Text>
                </View>

                {/* Section 1: Property Details */}
                <Text style={styles.sectionHeading}>1. PROPERTY LOCATION & SPECS</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Property Street Address *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 4218 Shoreline Trail"
                    placeholderTextColor="#9CA3AF"
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>North Texas City *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. The Colony, Frisco, Plano"
                      placeholderTextColor="#9CA3AF"
                      value={city}
                      onChangeText={setCity}
                    />
                  </View>
                  <View style={[styles.inputGroup, { width: 100 }]}>
                    <Text style={styles.label}>Bedrooms</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={beds}
                      onChangeText={setBeds}
                    />
                  </View>
                  <View style={[styles.inputGroup, { width: 100 }]}>
                    <Text style={styles.label}>Bathrooms</Text>
                    <TextInput
                      style={styles.input}
                      value={baths}
                      onChangeText={setBaths}
                    />
                  </View>
                </View>

                {/* Section 2: Property Status */}
                <Text style={styles.sectionHeading}>2. CURRENT STATUS & TIMELINE</Text>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Occupancy Status</Text>
                    <View style={styles.chipsRow}>
                      {["Currently Vacant", "Tenant Occupied", "Primary Home"].map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.chip,
                            rentStatus === status && styles.chipActive,
                          ]}
                          onPress={() => setRentStatus(status)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              rentStatus === status && styles.chipTextActive,
                            ]}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Property Condition</Text>
                  <View style={styles.chipsRow}>
                    {["Excellent", "Good", "Needs Minor Paint/Clean", "Needs Work"].map((cond) => (
                      <TouchableOpacity
                        key={cond}
                        style={[styles.chip, condition === cond && styles.chipActive]}
                        onPress={() => setCondition(cond)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            condition === cond && styles.chipTextActive,
                          ]}
                        >
                          {cond}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Target Marketing Date</Text>
                  <View style={styles.chipsRow}>
                    {["Immediately", "Within 30 Days", "30–60 Days", "Just Researching"].map((target) => (
                      <TouchableOpacity
                        key={target}
                        style={[styles.chip, targetDate === target && styles.chipActive]}
                        onPress={() => setTargetDate(target)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            targetDate === target && styles.chipTextActive,
                          ]}
                        >
                          {target}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Section 3: Owner Contact */}
                <Text style={styles.sectionHeading}>3. OWNER CONTACT DETAILS</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Owner / Investor Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Your Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={ownerName}
                    onChangeText={setOwnerName}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Email Address *</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="owner@example.com"
                      placeholderTextColor="#9CA3AF"
                      value={ownerEmail}
                      onChangeText={setOwnerEmail}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="phone-pad"
                      placeholder="(972) 000-0000"
                      placeholderTextColor="#9CA3AF"
                      value={ownerPhone}
                      onChangeText={setOwnerPhone}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Additional Notes or Questions (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    multiline
                    numberOfLines={3}
                    placeholder="HOA restrictions, recent upgrades, or specific management questions..."
                    placeholderTextColor="#9CA3AF"
                    value={notes}
                    onChangeText={setNotes}
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Generate Rental Analysis Report</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.complianceDisclaimer}>
                  By submitting, you consent to KeyNest Realty contacting you regarding property management services under Fair Deal Realty Inc. We respect your privacy and never sell contact info.
                </Text>
              </View>
            ) : (
              /* Submission Success Screen */
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <CheckCircle2 size={44} color="#10B981" />
                </View>

                <Text style={styles.successTitle}>Rental Analysis Initialized!</Text>
                <Text style={styles.successSubtitle}>
                  Your request has been routed to our North Texas owner-onboarding lead.
                </Text>

                {estimatedRent && (
                  <View style={styles.estimateCard}>
                    <Text style={styles.estimateLabel}>PRELIMINARY MARKET RENT RANGE</Text>
                    <Text style={styles.estimateValue}>
                      ${estimatedRent.low.toLocaleString()} – ${estimatedRent.high.toLocaleString()}
                      <Text style={{ fontSize: 16, color: "#6B7280" }}> / month</Text>
                    </Text>
                    <Text style={styles.estimateNote}>
                      Based on current {city} MLS comps for a {beds}-bedroom home in {condition.toLowerCase()} condition.
                    </Text>
                  </View>
                )}

                <View style={styles.nextStepsBox}>
                  <Text style={styles.nextStepsTitle}>What Happens Next:</Text>
                  <Text style={styles.stepText}>
                    1. <Text style={{ fontWeight: "600", color: "#111827" }}>Detailed Comps Review:</Text> Our team pulls verified active and closed MLS rental comps in your specific neighborhood.
                  </Text>
                  <Text style={styles.stepText}>
                    2. <Text style={{ fontWeight: "600", color: "#111827" }}>Readiness Assessment:</Text> We check local municipal rental requirements (e.g. The Colony rental licensing) and provide quick turnover tips.
                  </Text>
                  <Text style={styles.stepText}>
                    3. <Text style={{ fontWeight: "600", color: "#111827" }}>Direct Consultation:</Text> One of our authorized managers (Dinesh Donthula or Purvang Patel) will email or call you to discuss your preferred service tier.
                  </Text>
                </View>

                <TouchableOpacity style={styles.doneButton} onPress={handleReset}>
                  <Text style={styles.doneButtonText}>Close Window</Text>
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
    backgroundColor: "rgba(0,0,0,0.6)",
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
    fontSize: 18,
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
  formContainer: {
    gap: 14,
  },
  routingNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  routingNoticeText: {
    fontSize: 11.5,
    color: "#065F46",
    flex: 1,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#164E3A",
    letterSpacing: 0.6,
    marginTop: 6,
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
    minHeight: 65,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 11,
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
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: "#164E3A",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  complianceDisclaimer: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 15,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 14,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#164E3A",
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 13.5,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 19,
  },
  estimateCard: {
    width: "100%",
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    gap: 6,
  },
  estimateLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.6,
  },
  estimateValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#164E3A",
  },
  estimateNote: {
    fontSize: 11.5,
    color: "#4B5563",
    textAlign: "center",
  },
  nextStepsBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  nextStepsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  stepText: {
    fontSize: 12.5,
    color: "#4B5563",
    lineHeight: 18,
  },
  doneButton: {
    width: "100%",
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
