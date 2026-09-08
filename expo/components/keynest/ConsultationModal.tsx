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
import { X, Calendar, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react-native";

interface ConsultationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ visible, onClose }: ConsultationModalProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 640;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("Switching from Another Property Manager");
  const [managerPreference, setManagerPreference] = useState("First Available Authorized Manager");
  const [preferredDay, setPreferredDay] = useState("This Week (Morning)");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert("Please enter your name, email, and phone number.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxWidth: isDesktop ? 600 : "94%" }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Calendar size={20} color="#367A5E" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Schedule a Consultation</Text>
                <Text style={styles.modalSubtitle}>
                  Direct discussion with KeyNest management leadership
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close modal">
              <X size={20} color="#737B85" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 24 }}>
            {!submitted ? (
              <View style={styles.formContainer}>
                <View style={styles.brokerNotice}>
                  <ShieldCheck size={16} color="#367A5E" />
                  <Text style={styles.brokerNoticeText}>
                    Authorized Managers: Dinesh Donthula & Purvang Patel • Fair Deal Realty Inc.
                  </Text>
                </View>

                {/* Manager Preference */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Manager Preference</Text>
                  <View style={styles.pillsRow}>
                    {[
                      "First Available",
                      "Dinesh Donthula",
                      "Purvang Patel",
                    ].map((mgr) => (
                      <TouchableOpacity
                        key={mgr}
                        style={[styles.pill, managerPreference.includes(mgr.split(" ")[0]) && styles.pillActive]}
                        onPress={() => setManagerPreference(mgr)}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            managerPreference.includes(mgr.split(" ")[0]) && styles.pillTextActive,
                          ]}
                        >
                          {mgr}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Topic */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Primary Discussion Topic</Text>
                  <View style={styles.pillsRow}>
                    {[
                      "Switching Managers",
                      "New Rental Owner",
                      "Portfolio (2+ Homes)",
                      "Pricing & Services",
                    ].map((top) => (
                      <TouchableOpacity
                        key={top}
                        style={[styles.pill, topic.includes(top.split(" ")[0]) && styles.pillActive]}
                        onPress={() => setTopic(top)}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            topic.includes(top.split(" ")[0]) && styles.pillTextActive,
                          ]}
                        >
                          {top}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Preferred Timing */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Preferred Time Frame</Text>
                  <View style={styles.pillsRow}>
                    {[
                      "Morning (9am - 12pm)",
                      "Afternoon (1pm - 4pm)",
                      "Saturday Morning",
                    ].map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[styles.pill, preferredDay === time && styles.pillActive]}
                        onPress={() => setPreferredDay(time)}
                      >
                        <Text style={[styles.pillText, preferredDay === time && styles.pillTextActive]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Contact Inputs */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Your Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Robert Smith"
                    placeholderTextColor="#94A3B8"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="robert@example.com"
                      placeholderTextColor="#94A3B8"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Phone *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="(469) 555-0199"
                      placeholderTextColor="#94A3B8"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Property Address or Notes (Optional)</Text>
                  <TextInput
                    style={[styles.input, { height: 70, textAlignVertical: "top" }]}
                    placeholder="e.g. 4-bed single family in Frisco, currently rented until end of month."
                    placeholderTextColor="#94A3B8"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                  />
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
                      <Text style={styles.submitBtnText}>Confirm Consultation Request</Text>
                      <ArrowRight size={16} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <CheckCircle2 size={36} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>Consultation Request Confirmed</Text>
                <Text style={styles.successSub}>
                  Thank you, {name}. A member of KeyNest leadership will reach out via {phone || email} during your requested {preferredDay} window.
                </Text>

                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Topic:</Text>
                    <Text style={styles.summaryValue}>{topic}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Assigned Lead:</Text>
                    <Text style={styles.summaryValue}>{managerPreference}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Brokerage:</Text>
                    <Text style={styles.summaryValue}>Fair Deal Realty Inc.</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={handleReset}>
                  <Text style={styles.doneBtnText}>Close</Text>
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
    backgroundColor: "#EDF5F1",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
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
  formContainer: {
    gap: 14,
  },
  brokerNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EDF5F1",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7E0D3",
  },
  brokerNoticeText: {
    fontSize: 12,
    color: "#285C47",
    fontWeight: "600",
    flex: 1,
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
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#F7F3EB",
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  pillActive: {
    backgroundColor: "#367A5E",
    borderColor: "#367A5E",
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#4A515A",
  },
  pillTextActive: {
    color: "#FFFFFF",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#367A5E",
    paddingVertical: 13,
    borderRadius: 8,
    marginTop: 8,
    shadowColor: "#367A5E",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  successContainer: {
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
  summaryCard: {
    width: "100%",
    backgroundColor: "#FAF7F0",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 12.5,
    color: "#737B85",
  },
  summaryValue: {
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
