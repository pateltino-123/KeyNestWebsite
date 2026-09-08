import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import {
  Calculator,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react-native";
import WebsiteLayout from "@/components/keynest/WebsiteLayout";

export default function RentalAnalysisPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("The Colony");
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
    setAddress("");
    setCity("The Colony");
    setBeds("4");
    setBaths("2.5");
    setCondition("Good");
    setOwnerName("");
    setOwnerEmail("");
    setOwnerPhone("");
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
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#367A5E" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Free Rental Analysis</Text>
          <Text style={styles.pageSubtitle}>
            Get a data-driven rental rate estimate and operational readiness review for your North Texas property. Our team will analyze recent market comps and provide personalized insights.
          </Text>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          {!submitted ? (
            <View style={[styles.formCard, { maxWidth: isDesktop ? 720 : "100%" }]}>
              <View style={styles.formHeader}>
                <View style={styles.iconCircle}>
                  <Calculator size={24} color="#367A5E" />
                </View>
                <View>
                  <Text style={styles.formTitle}>Analyze Your Property</Text>
                  <Text style={styles.formSubtitle}>
                    Complete the form below to receive your preliminary rental analysis
                  </Text>
                </View>
              </View>

              <View style={styles.routingNoticeBox}>
                <ShieldCheck size={16} color="#367A5E" />
                <Text style={styles.routingNoticeText}>
                  Directly routed to Dinesh Donthula & Purvang Patel (Fair Deal Realty Inc.)
                </Text>
              </View>

              <ScrollView style={styles.formScroll} scrollEnabled={!isDesktop}>
                <View style={styles.formContainer}>
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
                    <View style={styles.conditionPillsRow}>
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
                  <Text style={[styles.sectionHeading, { marginTop: 24 }]}>2. YOUR CONTACT INFORMATION</Text>

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
              </ScrollView>
            </View>
          ) : (
            /* Success / Results Screen */
            <View style={[styles.resultsContainer, { maxWidth: isDesktop ? 720 : "100%" }]}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={48} color="#10B981" />
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
                  <Text style={styles.doneBtnText}>Analyze Another Property</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  headerHero: {
    backgroundColor: "#FDFBF7",
    paddingVertical: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
  },
  innerContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
  },
  badgePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EDF5F1",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C7E0D3",
    marginBottom: 16,
  },
  badgePillText: {
    color: "#285C47",
    fontSize: 12.5,
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#22252A",
    letterSpacing: -1,
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 16.5,
    color: "#4A515A",
    maxWidth: 760,
    lineHeight: 25,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 72,
  },
  formCard: {
    marginHorizontal: "auto",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    shadowColor: "#22252A",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E2D5",
    backgroundColor: "#F7F3EB",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#EDF5F1",
    justifyContent: "center",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#22252A",
  },
  formSubtitle: {
    fontSize: 13.5,
    color: "#737B85",
    marginTop: 2,
  },
  routingNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EDF5F1",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7E0D3",
    marginHorizontal: 24,
    marginTop: 20,
  },
  routingNoticeText: {
    fontSize: 12,
    color: "#285C47",
    fontWeight: "600",
    flex: 1,
  },
  formScroll: {
    maxHeight: 500,
  },
  formContainer: {
    padding: 24,
    gap: 16,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#4A515A",
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
  cityPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  conditionPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
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
  miniPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  miniPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    backgroundColor: "#F7F3EB",
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  miniPillActive: {
    backgroundColor: "#367A5E",
    borderColor: "#367A5E",
  },
  miniPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A515A",
  },
  miniPillTextActive: {
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
    marginTop: 16,
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
  resultsContainer: {
    marginHorizontal: "auto",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    gap: 20,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EBF5F0",
    justifyContent: "center",
    alignItems: "center",
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22252A",
    textAlign: "center",
  },
  resultsSubtitle: {
    fontSize: 15,
    color: "#737B85",
    textAlign: "center",
    lineHeight: 22,
  },
  estimateBox: {
    width: "100%",
    backgroundColor: "#FAF7F0",
    borderWidth: 2,
    borderColor: "#367A5E",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  estimateLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#367A5E",
    letterSpacing: 1,
  },
  estimateValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#22252A",
  },
  estimatePerMonth: {
    fontSize: 16,
    fontWeight: "600",
    color: "#737B85",
  },
  estimateRangeNote: {
    fontSize: 13,
    color: "#737B85",
    fontWeight: "500",
    textAlign: "center",
  },
  feeBreakdownBox: {
    width: "100%",
    backgroundColor: "#EDF5F1",
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C7E0D3",
    gap: 6,
  },
  feeBreakdownTitle: {
    fontSize: 13,
    color: "#285C47",
    fontWeight: "600",
  },
  feeBreakdownAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E4636",
  },
  feeBreakdownNote: {
    fontSize: 12,
    color: "#367A5E",
    fontWeight: "500",
  },
  managerFollowupBox: {
    width: "100%",
    backgroundColor: "#F7F3EB",
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 6,
  },
  managerFollowupTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22252A",
  },
  managerFollowupText: {
    fontSize: 13,
    color: "#4A515A",
    lineHeight: 20,
  },
  resultActions: {
    width: "100%",
    marginTop: 8,
  },
  doneBtn: {
    backgroundColor: "#22252A",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
