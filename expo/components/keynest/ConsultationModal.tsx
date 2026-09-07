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
import { X, Calendar, CheckCircle2, ShieldCheck } from "lucide-react-native";
import { KEYNEST_INFO } from "@/constants/keynestData";

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
  const [propertyCount, setPropertyCount] = useState("1 Single Family");
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
    }, 700);
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
                <Calendar size={20} color="#164E3A" />
              </View>
              <View>
                <Text style={styles.modalTitle}>Schedule a Consultation</Text>
                <Text style={styles.modalSubtitle}>
                  Direct consultation with KeyNest management leadership
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
                <View style={styles.brokerNotice}>
                  <ShieldCheck size={16} color="#059669" />
                  <Text style={styles.brokerNoticeText}>
                    Authorized Managers: Dinesh Donthula & Purvang Patel | Under Fair Deal Realty Inc.
                  </Text>
                </View>

                {/* Consultation Topic */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Consultation Topic *</Text>
                  <View style={styles.chipsWrap}>
                    {[
                      "Switching from Another Property Manager",
                      "First-Time Landlord Onboarding",
                      "Multi-Property Portfolio Review",
                      "Controlled Pilot Program Inquiry",
                    ].map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[styles.chip, topic === item && styles.chipActive]}
                        onPress={() => setTopic(item)}
                      >
                        <Text style={[styles.chipText, topic === item && styles.chipTextActive]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Preferred Manager */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Requested Manager</Text>
                  <View style={styles.chipsWrap}>
                    {[
                      "First Available Authorized Manager",
                      "Dinesh Donthula (Ops Lead)",
                      "Purvang Patel (Tech & Portals)",
                    ].map((mgr) => (
                      <TouchableOpacity
                        key={mgr}
                        style={[styles.chip, managerPreference === mgr && styles.chipActive]}
                        onPress={() => setManagerPreference(mgr)}
                      >
                        <Text style={[styles.chipText, managerPreference === mgr && styles.chipTextActive]}>
                          {mgr}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Property Count & Time Preference */}
                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Number of Properties</Text>
                    <TextInput
                      style={styles.input}
                      value={propertyCount}
                      onChangeText={setPropertyCount}
                      placeholder="e.g. 1 home, 3 homes"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Preferred Time Window</Text>
                    <TextInput
                      style={styles.input}
                      value={preferredDay}
                      onChangeText={setPreferredDay}
                      placeholder="e.g. Weekday morning"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Contact Information */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Your Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Email Address *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="name@domain.com"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Phone Number *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="(972) 000-0000"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Questions or Specific Goals (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    multiline
                    numberOfLines={3}
                    placeholder="Current rental location, tenant turnover challenges, HOA considerations..."
                    placeholderTextColor="#9CA3AF"
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitBtnText}>Confirm Consultation Request</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.successBox}>
                <View style={styles.successIcon}>
                  <CheckCircle2 size={48} color="#10B981" />
                </View>
                <Text style={styles.successHeading}>Consultation Booked!</Text>
                <Text style={styles.successText}>
                  Thank you, <Text style={{ fontWeight: "700" }}>{name}</Text>. Our team has received your request for <Text style={{ fontWeight: "600" }}>{topic}</Text>.
                </Text>
                <View style={styles.detailsCard}>
                  <Text style={styles.detailsLine}>• Preferred Manager: {managerPreference}</Text>
                  <Text style={styles.detailsLine}>• Target Time: {preferredDay}</Text>
                  <Text style={styles.detailsLine}>• Portfolio Size: {propertyCount}</Text>
                </View>
                <Text style={styles.confirmSub}>
                  You will receive a calendar invitation and introductory email from our office at {KEYNEST_INFO.officeAddress}.
                </Text>
                <TouchableOpacity style={styles.closeDoneBtn} onPress={handleReset}>
                  <Text style={styles.closeDoneBtnText}>Done</Text>
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
  brokerNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  brokerNoticeText: {
    fontSize: 11.5,
    color: "#065F46",
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
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
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
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
  submitBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  successBox: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  successHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#164E3A",
  },
  successText: {
    fontSize: 13.5,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 19,
  },
  detailsCard: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  detailsLine: {
    fontSize: 12.5,
    color: "#374151",
  },
  confirmSub: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 17,
  },
  closeDoneBtn: {
    width: "100%",
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  closeDoneBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
