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
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import { KEYNEST_INFO } from "@/constants/keynestData";

export default function OwnersPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { openConsultation } = useWebsiteModals();

  // 4-Step Interactive Owner Onboarding Intake State
  const [step, setStep] = useState(1);
  const [propertyAddress, setPropertyAddress] = useState("");
  const [city, setCity] = useState("The Colony");
  const [propertyType, setPropertyType] = useState("Single Family");
  const [units, setUnits] = useState("1");
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
      // Final step submit
      if (!ownerName.trim() || !ownerEmail.trim() || !ownerPhone.trim()) {
        alert("Please provide your full contact information.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIntakeCompleted(true);
      }, 800);
    }
  };

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Property Owner Center</Text>
          <Text style={styles.pageSubtitle}>
            Access your 24/7 AppFolio financial portal, review distribution schedules, or onboard a new North Texas rental property.
          </Text>
        </View>
      </View>

      {/* 1. AppFolio Owner Portal Banner & Quick Actions */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={[styles.portalBox, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={{ flex: 1, gap: 10 }}>
              <View style={styles.portalTag}>
                <Lock size={12} color="#059669" />
                <Text style={styles.portalTagText}>SECURE CLIENT LOG IN</Text>
              </View>
              <Text style={styles.portalTitle}>AppFolio Owner Portal Access</Text>
              <Text style={styles.portalDesc}>
                Log in to review real-time rent receipts, download monthly cash-flow statements, inspect maintenance repair work orders with before/after photos, and download annual 1099 tax packages.
              </Text>
              <View style={styles.portalPillsRow}>
                <Text style={styles.portalPill}>✓ Direct ACH Deposits around the 10th</Text>
                <Text style={styles.portalPill}>✓ 24/7 Maintenance Invoices</Text>
                <Text style={styles.portalPill}>✓ Digital Lease Vault</Text>
              </View>
            </View>

            <View style={styles.portalActionCol}>
              <TouchableOpacity
                style={styles.openPortalPrimaryBtn}
                onPress={openAppFolioOwnerPortal}
                activeOpacity={0.85}
              >
                <Text style={styles.openPortalPrimaryText}>Launch AppFolio Owner Portal</Text>
                <ExternalLink size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.helpPortalBtn}
                onPress={openConsultation}
              >
                <Text style={styles.helpPortalText}>Need Portal Login Help?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Interactive 4-Step Owner Intake Flow */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>START PROPERTY ONBOARDING</Text>
            <Text style={styles.sectionTitle}>New Property Intake Form</Text>
            <Text style={styles.sectionSubtitle}>
              Complete our structured onboarding intake. Submissions are routed directly to KeyNest Acquisition & Onboarding Leads under Fair Deal Realty Inc.
            </Text>
          </View>

          <View style={styles.intakeCard}>
            {/* Step Indicators */}
            {!intakeCompleted && (
              <View style={styles.stepProgressBar}>
                {[1, 2, 3].map((num) => (
                  <View key={num} style={styles.stepProgressItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        step === num && styles.stepCircleActive,
                        step > num && styles.stepCircleDone,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepNum,
                          (step === num || step > num) && styles.stepNumActive,
                        ]}
                      >
                        {num}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.stepProgressLabel,
                        step === num && styles.stepProgressLabelActive,
                      ]}
                    >
                      {num === 1 ? "Property Specs" : num === 2 ? "Status & Rent" : "Owner Details"}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {!intakeCompleted ? (
              <View style={styles.stepFormContent}>
                {/* Step 1: Property Specs */}
                {step === 1 && (
                  <View style={styles.formFieldsBlock}>
                    <Text style={styles.stepHeaderTitle}>Step 1: Property Location & Architecture</Text>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Property Street Address *</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="e.g. 4218 Shoreline Trail"
                        placeholderTextColor="#9CA3AF"
                        value={propertyAddress}
                        onChangeText={setPropertyAddress}
                      />
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>North Texas City *</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="e.g. The Colony, Frisco, Plano"
                          placeholderTextColor="#9CA3AF"
                          value={city}
                          onChangeText={setCity}
                        />
                      </View>
                      <View style={[styles.inputGroup, { width: 140 }]}>
                        <Text style={styles.inputLabel}>Number of Units</Text>
                        <TextInput
                          style={styles.textInput}
                          value={units}
                          onChangeText={setUnits}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Property Type</Text>
                      <View style={styles.chipsRow}>
                        {["Single Family", "Townhome", "Condominium", "Multi-Family"].map((t) => (
                          <TouchableOpacity
                            key={t}
                            style={[styles.chipBtn, propertyType === t && styles.chipBtnActive]}
                            onPress={() => setPropertyType(t)}
                          >
                            <Text
                              style={[
                                styles.chipBtnText,
                                propertyType === t && styles.chipBtnTextActive,
                              ]}
                            >
                              {t}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                )}

                {/* Step 2: Occupancy & Rent */}
                {step === 2 && (
                  <View style={styles.formFieldsBlock}>
                    <Text style={styles.stepHeaderTitle}>Step 2: Current Occupancy & Target Rent</Text>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Current Occupancy Status</Text>
                      <View style={styles.chipsRow}>
                        {[
                          "Vacant (Ready to Lease)",
                          "Tenant Occupied (Lease in Place)",
                          "Notice to Vacate Given",
                          "Currently Owner Occupied",
                        ].map((occ) => (
                          <TouchableOpacity
                            key={occ}
                            style={[styles.chipBtn, occupancy === occ && styles.chipBtnActive]}
                            onPress={() => setOccupancy(occ)}
                          >
                            <Text
                              style={[
                                styles.chipBtnText,
                                occupancy === occ && styles.chipBtnTextActive,
                              ]}
                            >
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
                          style={styles.textInput}
                          placeholder="e.g. 2650"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="numeric"
                          value={targetRent}
                          onChangeText={setTargetRent}
                        />
                      </View>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>HOA Name (If Applicable)</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="e.g. Twin Creeks HOA"
                          placeholderTextColor="#9CA3AF"
                          value={hoaName}
                          onChangeText={setHoaName}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* Step 3: Owner Contact */}
                {step === 3 && (
                  <View style={styles.formFieldsBlock}>
                    <Text style={styles.stepHeaderTitle}>Step 3: Owner Contact & Routing Details</Text>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Owner / Investor Full Name *</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Your Name"
                        placeholderTextColor="#9CA3AF"
                        value={ownerName}
                        onChangeText={setOwnerName}
                      />
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Email Address *</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="owner@domain.com"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={ownerEmail}
                          onChangeText={setOwnerEmail}
                        />
                      </View>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Phone Number *</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder="(972) 000-0000"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="phone-pad"
                          value={ownerPhone}
                          onChangeText={setOwnerPhone}
                        />
                      </View>
                    </View>

                    <View style={styles.routingNoticeBox}>
                      <ShieldCheck size={16} color="#059669" />
                      <Text style={styles.routingNoticeText}>
                        Lead Routing: KeyNest Acquisition Queue • Fair Deal Realty Inc.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Navigation Buttons */}
                <View style={styles.formNavButtonsRow}>
                  {step > 1 && (
                    <TouchableOpacity
                      style={styles.prevBtn}
                      onPress={() => setStep(step - 1)}
                    >
                      <Text style={styles.prevBtnText}>← Back</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.nextBtn, { flex: step === 1 ? 1 : 0.6 }]}
                    onPress={handleNextStep}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.nextBtnText}>
                        {step === 3 ? "Submit Onboarding Intake" : "Continue to Step " + (step + 1) + " →"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Intake Completed View */
              <View style={styles.completedBox}>
                <View style={styles.completedIconBadge}>
                  <CheckCircle2 size={48} color="#10B981" />
                </View>
                <Text style={styles.completedTitle}>Property Intake Received!</Text>
                <Text style={styles.completedText}>
                  Thank you, <Text style={{ fontWeight: "700" }}>{ownerName}</Text>. We have registered <Text style={{ fontWeight: "600" }}>{propertyAddress}, {city}</Text> into our onboarding system.
                </Text>

                <View style={styles.checklistSummaryBox}>
                  <Text style={styles.checkSummaryHeading}>Required Documents for Launch:</Text>
                  <Text style={styles.checkItem}>1. Copy of recorded Deed or Settlement Statement</Text>
                  <Text style={styles.checkItem}>2. Landlord Hazard & Liability Insurance Dec Page (Fair Deal Realty Inc. as additional interest)</Text>
                  <Text style={styles.checkItem}>3. HOA Bylaws and Rental Restriction Verification</Text>
                  <Text style={styles.checkItem}>4. Signed Texas REALTORS® Property Management Agreement</Text>
                </View>

                <TouchableOpacity
                  style={styles.doneIntakeBtn}
                  onPress={() => {
                    setIntakeCompleted(false);
                    setStep(1);
                  }}
                >
                  <Text style={styles.doneIntakeBtnText}>Submit Another Property</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* 3. Owner Operational FAQs & Standards */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>OWNER POLICIES</Text>
            <Text style={styles.sectionTitle}>Frequently Asked Owner Questions</Text>
            <Text style={styles.sectionSubtitle}>
              Clear operating answers on spending limits, statements, and tenant placements.
            </Text>
          </View>

          <View style={styles.faqList}>
            <View style={styles.faqCard}>
              <Text style={styles.faqQ}>What is the standard maintenance spending authorization limit?</Text>
              <Text style={styles.faqA}>
                In our Texas REALTORS® management agreement, our default non-emergency repair authority limit is $350–$500. Any repair estimated above this threshold requires explicit owner approval via email or the AppFolio owner portal, except in life-safety emergencies (active flooding, freeze protection, gas leak).
              </Text>
            </View>

            <View style={styles.faqCard}>
              <Text style={styles.faqQ}>When are owner statements and ACH funds disbursed?</Text>
              <Text style={styles.faqA}>
                Rent is due from tenants on the 1st of each month and considered late after the 3rd. After rent clears our broker trust account, owner ACH disbursements are processed directly to your bank account between the 10th and 12th of each month, accompanied by an itemized cash-flow statement.
              </Text>
            </View>

            <View style={styles.faqCard}>
              <Text style={styles.faqQ}>How are tenant security deposits handled?</Text>
              <Text style={styles.faqA}>
                Under Texas law and TREC rules, tenant security deposits must be held in a dedicated, broker-supervised escrow trust account managed by Fair Deal Realty Inc. Security deposits are never commingled with operating funds.
              </Text>
            </View>

            <View style={styles.faqCard}>
              <Text style={styles.faqQ}>Can I use my own home warranty or contractors?</Text>
              <Text style={styles.faqA}>
                Yes. If you have an active home warranty or preferred vendor, you can specify this during onboarding. However, for emergencies, if the warranty dispatch cannot respond within 4 hours, KeyNest will dispatch our licensed vendors to protect your asset.
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
    backgroundColor: "#164E3A",
    paddingVertical: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#1D644B",
  },
  innerContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 16,
  },
  badgePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#103C2D",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E5642",
    marginBottom: 12,
  },
  badgePillText: {
    color: "#D1FAE5",
    fontSize: 12.5,
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#D1D5DB",
    lineHeight: 24,
    maxWidth: 720,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 64,
  },
  sectionLight: {
    backgroundColor: "#F8FAF9",
    paddingVertical: 56,
  },
  portalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#10B981",
    padding: 28,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    shadowColor: "#059669",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  portalTag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  portalTagText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#065F46",
    letterSpacing: 0.5,
  },
  portalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  portalDesc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
  },
  portalPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  portalPill: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
    backgroundColor: "#F0FDF4",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  portalActionCol: {
    gap: 10,
    minWidth: 260,
  },
  openPortalPrimaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#164E3A",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  openPortalPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  helpPortalBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  helpPortalText: {
    color: "#164E3A",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionHeaderCentered: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 36,
    gap: 8,
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F261E",
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: "#4B5563",
    maxWidth: 680,
    textAlign: "center",
    lineHeight: 22,
  },
  intakeCard: {
    maxWidth: 720,
    width: "100%",
    marginHorizontal: "auto",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  stepProgressBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 16,
  },
  stepProgressItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    backgroundColor: "#164E3A",
  },
  stepCircleDone: {
    backgroundColor: "#10B981",
  },
  stepNum: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  stepNumActive: {
    color: "#FFFFFF",
  },
  stepProgressLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#6B7280",
  },
  stepProgressLabelActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  stepFormContent: {
    gap: 16,
  },
  formFieldsBlock: {
    gap: 14,
  },
  stepHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  chipBtnActive: {
    borderColor: "#164E3A",
    backgroundColor: "#ECFDF5",
  },
  chipBtnText: {
    fontSize: 12.5,
    color: "#4B5563",
  },
  chipBtnTextActive: {
    color: "#164E3A",
    fontWeight: "700",
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
    marginTop: 4,
  },
  routingNoticeText: {
    fontSize: 11.5,
    color: "#065F46",
    flex: 1,
  },
  formNavButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  prevBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  prevBtnText: {
    color: "#4B5563",
    fontSize: 13.5,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  completedBox: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 14,
  },
  completedIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  completedTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#164E3A",
  },
  completedText: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 21,
  },
  checklistSummaryBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  checkSummaryHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  checkItem: {
    fontSize: 12.5,
    color: "#374151",
    lineHeight: 18,
  },
  doneIntakeBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 6,
  },
  doneIntakeBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  faqList: {
    gap: 16,
    maxWidth: 900,
    marginHorizontal: "auto",
    width: "100%",
  },
  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    gap: 8,
  },
  faqQ: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  faqA: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 21,
  },
});
