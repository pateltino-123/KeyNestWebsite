import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from "lucide-react-native";
import WebsiteLayout from "@/components/keynest/WebsiteLayout";
import { KEYNEST_INFO } from "@/constants/keynestData";

export default function OwnersPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // 4-Step Interactive Owner Onboarding Intake State
  const [step, setStep] = useState(1);
  const [propertyAddress, setPropertyAddress] = useState("");
  const [city, setCity] = useState("The Colony");
  const [propertyType, setPropertyType] = useState("Single Family");
  const [occupancy, setOccupancy] = useState("Vacant (Ready to Lease)");
  const [targetRent, setTargetRent] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [hoaName, setHoaName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [intakeCompleted, setIntakeCompleted] = useState(false);

  const openAppFolioOwnerPortal = () => {
    Linking.openURL(KEYNEST_INFO.appFolioOwnerPortalUrl).catch(() => {});
  };

  const handleNextStep = () => {
    if (step === 1 && !propertyAddress.trim()) {
      alert("Please enter the property street address.");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (!ownerName.trim() || !ownerEmail.trim() || !ownerPhone.trim()) {
        alert("Please provide your full contact information.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIntakeCompleted(true);
      }, 700);
    }
  };

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#367A5E" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Property Owner Center</Text>
          <Text style={styles.pageSubtitle}>
            Access your 24/7 AppFolio financial portal, review distribution schedules, or onboard a new North Texas rental property.
          </Text>
        </View>
      </View>

      {/* 1. AppFolio Owner Portal Banner */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={[styles.portalBox, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={{ flex: 1, gap: 10 }}>
              <View style={styles.portalTag}>
                <Lock size={12} color="#367A5E" />
                <Text style={styles.portalTagText}>APPFOLIO OWNER PORTAL</Text>
              </View>
              <Text style={styles.portalTitle}>Real-Time Owner Accounting & Documents</Text>
              <Text style={styles.portalDesc}>
                Log into your encrypted AppFolio portal to view real-time balance ledgers, direct ACH disbursement records, download year-end 1099 tax packages, and review maintenance invoices with zero markup.
              </Text>
              <View style={styles.portalPillsRow}>
                <Text style={styles.portalPill}>✓ Monthly ACH around 10th</Text>
                <Text style={styles.portalPill}>✓ Instant 1099 Tax Archives</Text>
                <Text style={styles.portalPill}>✓ Paid Vendor Invoice Copies</Text>
              </View>
            </View>

            <View style={styles.portalActionCol}>
              <TouchableOpacity
                style={styles.portalLoginBtn}
                onPress={openAppFolioOwnerPortal}
                activeOpacity={0.85}
              >
                <Text style={styles.portalLoginBtnText}>Open Owner Portal</Text>
                <ExternalLink size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.portalHelpText}>
                Need login assistance? Contact Dinesh or Purvang at {KEYNEST_INFO.email}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Interactive 4-Step Owner Intake Flow */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.intakeWrapper}>
            <View style={styles.intakeHeader}>
              <Text style={styles.intakeOverline}>ONBOARD A PROPERTY</Text>
              <Text style={styles.intakeTitle}>New Owner Onboarding Intake</Text>
              <Text style={styles.intakeSubtitle}>
                Tell us about your North Texas rental property to begin setup under Fair Deal Realty Inc.
              </Text>
            </View>

            {/* Step Progress Indicators */}
            <View style={styles.stepProgressRow}>
              {[
                { num: 1, label: "Property Specs" },
                { num: 2, label: "Occupancy & Rent" },
                { num: 3, label: "Contact & Owner" },
              ].map((s) => (
                <View key={s.num} style={styles.stepIndicatorItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      step === s.num && styles.stepCircleActive,
                      step > s.num && styles.stepCircleCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepCircleText,
                        (step === s.num || step > s.num) && styles.stepCircleTextActive,
                      ]}
                    >
                      {step > s.num ? "✓" : s.num}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      step === s.num && styles.stepLabelActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Form Steps */}
            {!intakeCompleted ? (
              <View style={styles.intakeFormCard}>
                {step === 1 && (
                  <View style={styles.stepContent}>
                    <Text style={styles.stepHeading}>Step 1: Property Location & Details</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Property Street Address *</Text>
                      <TextInput
                        style={styles.inputField}
                        placeholder="e.g. 5204 Shoreline Trail"
                        placeholderTextColor="#94A3B8"
                        value={propertyAddress}
                        onChangeText={setPropertyAddress}
                      />
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>City</Text>
                        <TextInput
                          style={styles.inputField}
                          value={city}
                          onChangeText={setCity}
                        />
                      </View>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Property Type</Text>
                        <TextInput
                          style={styles.inputField}
                          value={propertyType}
                          onChangeText={setPropertyType}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {step === 2 && (
                  <View style={styles.stepContent}>
                    <Text style={styles.stepHeading}>Step 2: Occupancy & Financial Goals</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Current Occupancy Status</Text>
                      <View style={styles.chipsRow}>
                        {[
                          "Vacant (Ready to Lease)",
                          "Tenant Occupied (Transfer)",
                          "Under Construction / Rehab",
                        ].map((occ) => (
                          <TouchableOpacity
                            key={occ}
                            style={[styles.chip, occupancy === occ && styles.chipActive]}
                            onPress={() => setOccupancy(occ)}
                          >
                            <Text style={[styles.chipText, occupancy === occ && styles.chipTextActive]}>
                              {occ}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Target Monthly Rent ($)</Text>
                        <TextInput
                          style={styles.inputField}
                          placeholder="e.g. 2700"
                          placeholderTextColor="#94A3B8"
                          value={targetRent}
                          onChangeText={setTargetRent}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>HOA Name (If Applicable)</Text>
                        <TextInput
                          style={styles.inputField}
                          placeholder="e.g. Austin Waters HOA"
                          placeholderTextColor="#94A3B8"
                          value={hoaName}
                          onChangeText={setHoaName}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {step === 3 && (
                  <View style={styles.stepContent}>
                    <Text style={styles.stepHeading}>Step 3: Owner Contact Information</Text>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Your Full Legal Name *</Text>
                      <TextInput
                        style={styles.inputField}
                        placeholder="e.g. Jane Doe"
                        placeholderTextColor="#94A3B8"
                        value={ownerName}
                        onChangeText={setOwnerName}
                      />
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Email Address *</Text>
                        <TextInput
                          style={styles.inputField}
                          placeholder="jane@example.com"
                          placeholderTextColor="#94A3B8"
                          value={ownerEmail}
                          onChangeText={setOwnerEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Phone Number *</Text>
                        <TextInput
                          style={styles.inputField}
                          placeholder="(469) 555-0199"
                          placeholderTextColor="#94A3B8"
                          value={ownerPhone}
                          onChangeText={setOwnerPhone}
                          keyboardType="phone-pad"
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* Next / Back Buttons */}
                <View style={styles.intakeNavRow}>
                  {step > 1 ? (
                    <TouchableOpacity
                      style={styles.backBtn}
                      onPress={() => setStep(step - 1)}
                    >
                      <ArrowLeft size={16} color="#475569" />
                      <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>
                  ) : <View />}

                  <TouchableOpacity
                    style={styles.nextBtn}
                    onPress={handleNextStep}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.nextBtnText}>
                          {step === 3 ? "Submit Property Intake" : "Continue →"}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.intakeSuccessCard}>
                <View style={styles.successIconBox}>
                  <CheckCircle2 size={44} color="#10B981" />
                </View>
                <Text style={styles.intakeSuccessTitle}>Property Intake Received!</Text>
                <Text style={styles.intakeSuccessSub}>
                  Thank you, {ownerName}. Dinesh Donthula and Purvang Patel will review title records and prepare your Texas standard property management agreement.
                </Text>
                <TouchableOpacity
                  style={styles.resetIntakeBtn}
                  onPress={() => {
                    setIntakeCompleted(false);
                    setStep(1);
                    setPropertyAddress("");
                  }}
                >
                  <Text style={styles.resetIntakeBtnText}>Onboard Another Property</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* 3. Monthly Accounting Timeline */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.timelineHeader}>
            <Text style={styles.intakeOverline}>CASH FLOW PREDICTABILITY</Text>
            <Text style={styles.intakeTitle}>The Monthly Distribution Schedule</Text>
          </View>

          <View style={[styles.timelineGrid, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={styles.timelineCard}>
              <View style={styles.timelineDateBadge}>
                <Text style={styles.timelineDateText}>1ST OF MONTH</Text>
              </View>
              <Text style={styles.timelineCardTitle}>Rent Due Online</Text>
              <Text style={styles.timelineCardDesc}>
                Tenants submit rent via AppFolio zero-fee ACH or debit. Automated balance reminders notify residents 3 days prior.
              </Text>
            </View>

            <View style={styles.timelineCard}>
              <View style={styles.timelineDateBadge}>
                <Text style={styles.timelineDateText}>5TH OF MONTH</Text>
              </View>
              <Text style={styles.timelineCardTitle}>Grace Period Closes</Text>
              <Text style={styles.timelineCardDesc}>
                Statutory late fees assessed automatically under Texas Property Code. Management team initiates immediate follow-up.
              </Text>
            </View>

            <View style={[styles.timelineCard, styles.timelineCardHighlight]}>
              <View style={[styles.timelineDateBadge, { backgroundColor: "#367A5E" }]}>
                <Text style={[styles.timelineDateText, { color: "#FFFFFF" }]}>10TH OF MONTH</Text>
              </View>
              <Text style={styles.timelineCardTitle}>Owner ACH Direct Deposit</Text>
              <Text style={styles.timelineCardDesc}>
                Rental disbursements transferred directly into your designated bank account once funds clear our broker trust escrow.
              </Text>
            </View>

            <View style={styles.timelineCard}>
              <View style={styles.timelineDateBadge}>
                <Text style={styles.timelineDateText}>15TH OF MONTH</Text>
              </View>
              <Text style={styles.timelineCardTitle}>Statement Published</Text>
              <Text style={styles.timelineCardDesc}>
                Complete cash-flow statement, receipts, and vendor invoice copies uploaded to your AppFolio portal archives.
              </Text>
            </View>
          </View>
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
  sectionLight: {
    backgroundColor: "#F7F3EB",
    paddingVertical: 64,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 72,
  },
  portalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    padding: 32,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    shadowColor: "#22252A",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  portalTag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EDF5F1",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  portalTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#285C47",
    letterSpacing: 0.8,
  },
  portalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#22252A",
  },
  portalDesc: {
    fontSize: 14,
    color: "#4A515A",
    lineHeight: 22,
  },
  portalPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  portalPill: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#367A5E",
  },
  portalActionCol: {
    alignItems: "center",
    gap: 8,
  },
  portalLoginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#367A5E",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: "#367A5E",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  portalLoginBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  portalHelpText: {
    fontSize: 11.5,
    color: "#737B85",
    textAlign: "center",
  },
  intakeWrapper: {
    maxWidth: 780,
    width: "100%",
    marginHorizontal: "auto",
    gap: 24,
  },
  intakeHeader: {
    alignItems: "center",
    textAlign: "center",
  },
  intakeOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#367A5E",
    letterSpacing: 1,
    marginBottom: 6,
  },
  intakeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22252A",
    marginBottom: 8,
  },
  intakeSubtitle: {
    fontSize: 15,
    color: "#737B85",
    textAlign: "center",
  },
  stepProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  stepIndicatorItem: {
    alignItems: "center",
    gap: 6,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FAF7F0",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    backgroundColor: "#367A5E",
    borderColor: "#367A5E",
  },
  stepCircleCompleted: {
    backgroundColor: "#166534",
    borderColor: "#166534",
  },
  stepCircleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#737B85",
  },
  stepCircleTextActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: 12,
    color: "#737B85",
    fontWeight: "500",
  },
  stepLabelActive: {
    color: "#22252A",
    fontWeight: "700",
  },
  intakeFormCard: {
    backgroundColor: "#FAF7F0",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    padding: 28,
    gap: 20,
  },
  stepContent: {
    gap: 16,
  },
  stepHeading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#22252A",
  },
  inputGroup: {
    gap: 6,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#22252A",
  },
  inputField: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#22252A",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  chipActive: {
    backgroundColor: "#367A5E",
    borderColor: "#367A5E",
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#4A515A",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  intakeNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8E2D5",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A515A",
  },
  nextBtn: {
    backgroundColor: "#367A5E",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  intakeSuccessCard: {
    backgroundColor: "#FAF7F0",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    padding: 36,
    alignItems: "center",
    gap: 12,
  },
  successIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  intakeSuccessTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#22252A",
  },
  intakeSuccessSub: {
    fontSize: 14,
    color: "#4A515A",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 500,
  },
  resetIntakeBtn: {
    backgroundColor: "#22252A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  resetIntakeBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  timelineHeader: {
    alignItems: "center",
    marginBottom: 36,
    textAlign: "center",
  },
  timelineGrid: {
    gap: 16,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 8,
  },
  timelineCardHighlight: {
    borderColor: "#367A5E",
    borderWidth: 2,
    backgroundColor: "#EDF5F1",
  },
  timelineDateBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#FAF7F0",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  timelineDateText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#4A515A",
    letterSpacing: 0.5,
  },
  timelineCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#22252A",
  },
  timelineCardDesc: {
    fontSize: 13,
    color: "#4A515A",
    lineHeight: 19,
  },
});
