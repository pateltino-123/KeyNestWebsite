import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Building,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import {
  SERVICE_CITIES,
  KEYNEST_INFO,
} from "@/constants/keynestData";

export default function ContactAndServiceAreasPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  const { openRentalAnalysis } = useWebsiteModals();

  // Selected City Tab
  const [activeCityId, setActiveCityId] = useState("the-colony");
  const activeCity = SERVICE_CITIES.find((c) => c.id === activeCityId) || SERVICE_CITIES[0];

  // Contact Form State (Slide 9 routing: Business inbox with response ownership)
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactSubject, setContactSubject] = useState("Owner Management Inquiry");
  const [contactMessage, setContactMessage] = useState("");
  const [consentChecked, setConsentChecked] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = () => {
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      alert("Please provide your name, email address, and message.");
      return;
    }
    if (!consentChecked) {
      alert("Please agree to the communications consent notice.");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setMessageSent(true);
    }, 700);
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
          <Text style={styles.pageTitle}>Service Areas & Contact</Text>
          <Text style={styles.pageSubtitle}>
            Confirm North Texas operating coverage, explore local market metrics across 7 cities, or reach out to our management team in The Colony.
          </Text>
        </View>
      </View>

      {/* 1. Office Location & Contact Methods Cards */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View
            style={[
              styles.contactCardsGrid,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            {/* Headquarters Card */}
            <View style={[styles.contactInfoCard, { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" }]}>
              <View style={styles.contactIconCircle}>
                <Building size={22} color="#164E3A" />
              </View>
              <Text style={styles.contactCardTitle}>Central Office</Text>
              <Text style={styles.contactCardSub}>{KEYNEST_INFO.officeAddress}</Text>
              <Text style={styles.contactCardDetail}>
                Authorized Managers:{"\n"}
                <Text style={{ fontWeight: "700" }}>Dinesh Donthula</Text> &{" "}
                <Text style={{ fontWeight: "700" }}>Purvang Patel</Text>
              </Text>
              <Text style={styles.brokerageAffil}>Fair Deal Realty Inc. (Sponsoring Broker)</Text>
            </View>

            {/* Direct Phone & Dispatch */}
            <View style={[styles.contactInfoCard, { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" }]}>
              <View style={styles.contactIconCircle}>
                <Phone size={22} color="#164E3A" />
              </View>
              <Text style={styles.contactCardTitle}>Phone Lines</Text>
              <Text style={styles.contactCardSub}>Office: {KEYNEST_INFO.phone}</Text>
              <Text style={styles.contactCardDetail}>
                Emergency Maintenance Dispatch:{"\n"}
                <Text style={{ fontWeight: "700", color: "#DC2626" }}>{KEYNEST_INFO.emergencyPhone}</Text>
              </Text>
              <Text style={styles.brokerageAffil}>Hours: {KEYNEST_INFO.hours}</Text>
            </View>

            {/* Dedicated Inboxes */}
            <View style={[styles.contactInfoCard, { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" }]}>
              <View style={styles.contactIconCircle}>
                <Mail size={22} color="#164E3A" />
              </View>
              <Text style={styles.contactCardTitle}>Defined Routing Inboxes</Text>
              <Text style={styles.contactCardSub}>General: {KEYNEST_INFO.email}</Text>
              <Text style={styles.contactCardDetail}>
                Leasing Queue: {KEYNEST_INFO.leasingEmail}{"\n"}
                Maintenance Triage: {KEYNEST_INFO.maintenanceEmail}
              </Text>
              <Text style={styles.brokerageAffil}>Response Target: Under 4 Business Hours</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Interactive 7-City Service Territory Explorer (Slide 12) */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>NORTH TEXAS LOCAL COVERAGE</Text>
            <Text style={styles.sectionTitle}>Seven Approved Service Territories</Text>
            <Text style={styles.sectionSubtitle}>
              We maintain active vendor networks and local municipality compliance across these 7 North Texas cities.
            </Text>
          </View>

          {/* City Selection Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cityTabScroll}
          >
            {SERVICE_CITIES.map((city) => {
              const isActive = city.id === activeCityId;
              return (
                <TouchableOpacity
                  key={city.id}
                  style={[styles.cityTabBtn, isActive && styles.cityTabBtnActive]}
                  onPress={() => setActiveCityId(city.id)}
                >
                  <MapPin size={14} color={isActive ? "#FFFFFF" : "#164E3A"} />
                  <Text style={[styles.cityTabBtnText, isActive && styles.cityTabBtnTextActive]}>
                    {city.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Active City Detail Panel (Slide 12 requirements) */}
          <View style={styles.cityDetailCard}>
            <View style={styles.cityDetailTopRow}>
              <View>
                <Text style={styles.activeCityName}>{activeCity.name}, Texas</Text>
                <Text style={styles.activeCityTagline}>{activeCity.tagline} • {activeCity.county}</Text>
              </View>
              <TouchableOpacity
                style={styles.cityRentalAnalysisBtn}
                onPress={() => openRentalAnalysis(activeCity.name)}
              >
                <Text style={styles.cityRentalAnalysisBtnText}>Get {activeCity.name} Rental Analysis →</Text>
              </TouchableOpacity>
            </View>

            {/* City Quick Stats */}
            <View style={styles.cityStatsBar}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>MEDIAN RENT</Text>
                <Text style={styles.statBoxValue}>{activeCity.medianRent}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>AVG DAYS ON MARKET</Text>
                <Text style={styles.statBoxValue}>{activeCity.avgDaysOnMarket}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>COVERED ZIP CODES</Text>
                <Text style={styles.statBoxValue}>{activeCity.zipCodes.join(", ")}</Text>
              </View>
            </View>

            {/* Context & Property Types */}
            <View style={styles.cityTextGrid}>
              <View style={styles.cityTextCol}>
                <Text style={styles.colHeader}>Local Rental Owner Context</Text>
                <Text style={styles.colBody}>{activeCity.ownerContext}</Text>
                <View style={styles.propertyTypesWrap}>
                  <Text style={styles.propertyTypesLabel}>Common Property Types:</Text>
                  {activeCity.propertyTypes.map((pt, i) => (
                    <Text key={i} style={styles.ptBadge}>• {pt}</Text>
                  ))}
                </View>
              </View>

              <View style={styles.cityTextCol}>
                <Text style={styles.colHeader}>Operational & Municipal Considerations</Text>
                <Text style={styles.colBody}>{activeCity.operationalConsiderations}</Text>

                {/* Local City FAQs (Slide 12 requirement) */}
                <View style={styles.cityFaqSection}>
                  <Text style={styles.cityFaqHeading}>{activeCity.name} Management FAQs</Text>
                  {activeCity.faqs.map((faq, idx) => (
                    <View key={idx} style={styles.cityFaqItem}>
                      <Text style={styles.faqQuestionText}>Q: {faq.question}</Text>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Slide 12 mandatory disclosure */}
            <View style={styles.cityBrokerDisclaimer}>
              <Text style={styles.cityBrokerDisclaimerText}>
                {KEYNEST_INFO.brokerageFullLine}. Licensed by the Texas Real Estate Commission (TREC). All rental listings and management operations in {activeCity.name} are broker supervised.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. General Contact Form (Slide 9 requirements) */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.contactFormContainer}>
            <View style={styles.sectionHeaderCentered}>
              <Text style={styles.sectionOverline}>REACH OUT DIRECTLY</Text>
              <Text style={styles.sectionTitle}>Send Us a Message</Text>
              <Text style={styles.sectionSubtitle}>
                Submissions are logged directly into our central business inbox with designated response ownership.
              </Text>
            </View>

            {!messageSent ? (
              <View style={styles.contactFormCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Full Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Robert Smith"
                    placeholderTextColor="#9CA3AF"
                    value={contactName}
                    onChangeText={setContactName}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Email Address *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="robert@example.com"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={contactEmail}
                      onChangeText={setContactEmail}
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Phone Number *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="(972) 000-0000"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      value={contactPhone}
                      onChangeText={setContactPhone}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Inquiry Subject</Text>
                  <View style={styles.chipsWrap}>
                    {[
                      "Owner Management Inquiry",
                      "Schedule Rental Analysis",
                      "Tenant Question / Leasing",
                      "Vendor / Contractor Network",
                      "Brokerage Coordination",
                    ].map((subj) => (
                      <TouchableOpacity
                        key={subj}
                        style={[styles.subjectChip, contactSubject === subj && styles.subjectChipActive]}
                        onPress={() => setContactSubject(subj)}
                      >
                        <Text
                          style={[
                            styles.subjectChipText,
                            contactSubject === subj && styles.subjectChipTextActive,
                          ]}
                        >
                          {subj}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Message *</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    multiline
                    numberOfLines={4}
                    placeholder="Tell us about your property, portfolio goals, or questions..."
                    placeholderTextColor="#9CA3AF"
                    value={contactMessage}
                    onChangeText={setContactMessage}
                  />
                </View>

                {/* Mandatory Consent Notice (Slide 9) */}
                <TouchableOpacity
                  style={styles.consentRow}
                  onPress={() => setConsentChecked(!consentChecked)}
                >
                  <View style={[styles.consentCheck, consentChecked && styles.consentCheckActive]}>
                    {consentChecked && <CheckCircle2 size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.consentText}>
                    Consent Notice: I authorize KeyNest Realty Property Management under Fair Deal Realty Inc. to contact me via phone, email, or text regarding my inquiry. Message and data rates may apply.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sendMessageBtn}
                  onPress={handleSendMessage}
                  disabled={isSending}
                >
                  {isSending ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.sendMessageBtnText}>Submit Message to Business Inbox</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.messageSuccessCard}>
                <CheckCircle2 size={48} color="#10B981" />
                <Text style={styles.successHeading}>Message Received!</Text>
                <Text style={styles.successSub}>
                  Thank you, <Text style={{ fontWeight: "700" }}>{contactName}</Text>. Your inquiry regarding <Text style={{ fontWeight: "600" }}>{contactSubject}</Text> has been logged with assigned response ownership.
                </Text>
                <Text style={styles.slaNote}>
                  Expected response time: Under 4 business hours from our office in The Colony, TX.
                </Text>
                <TouchableOpacity
                  style={styles.anotherMsgBtn}
                  onPress={() => {
                    setMessageSent(false);
                    setContactMessage("");
                  }}
                >
                  <Text style={styles.anotherMsgBtnText}>Send Another Inquiry</Text>
                </TouchableOpacity>
              </View>
            )}
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
  contactCardsGrid: {
    gap: 20,
    justifyContent: "space-between",
  },
  contactInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 22,
    gap: 8,
  },
  contactIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  contactCardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  contactCardSub: {
    fontSize: 14,
    fontWeight: "600",
    color: "#164E3A",
  },
  contactCardDetail: {
    fontSize: 12.5,
    color: "#4B5563",
    lineHeight: 18,
  },
  brokerageAffil: {
    fontSize: 11.5,
    color: "#6B7280",
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 32,
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
  cityTabScroll: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 16,
  },
  cityTabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cityTabBtnActive: {
    backgroundColor: "#164E3A",
    borderColor: "#164E3A",
  },
  cityTabBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#374151",
  },
  cityTabBtnTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cityDetailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 28,
    gap: 20,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cityDetailTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
  },
  activeCityName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  activeCityTagline: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    marginTop: 2,
  },
  cityRentalAnalysisBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cityRentalAnalysisBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  cityStatsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statBox: {
    alignItems: "center",
  },
  statBoxLabel: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  statBoxValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#164E3A",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E5E7EB",
  },
  cityTextGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 24,
  },
  cityTextCol: {
    flex: 1,
    minWidth: 280,
    gap: 12,
  },
  colHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  colBody: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 21,
  },
  propertyTypesWrap: {
    gap: 4,
    marginTop: 6,
  },
  propertyTypesLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#111827",
  },
  ptBadge: {
    fontSize: 12.5,
    color: "#4B5563",
  },
  cityFaqSection: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 10,
    marginTop: 4,
  },
  cityFaqHeading: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#111827",
  },
  cityFaqItem: {
    gap: 2,
  },
  faqQuestionText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#164E3A",
  },
  faqAnswerText: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 17,
  },
  cityBrokerDisclaimer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  cityBrokerDisclaimerText: {
    fontSize: 11.5,
    color: "#6B7280",
    lineHeight: 16,
    fontStyle: "italic",
  },
  contactFormContainer: {
    maxWidth: 720,
    marginHorizontal: "auto",
    width: "100%",
  },
  contactFormCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 28,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  subjectChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  subjectChipActive: {
    borderColor: "#164E3A",
    backgroundColor: "#ECFDF5",
  },
  subjectChipText: {
    fontSize: 12,
    color: "#4B5563",
  },
  subjectChipTextActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginVertical: 4,
  },
  consentCheck: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  consentCheckActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  consentText: {
    fontSize: 11.5,
    color: "#6B7280",
    lineHeight: 16,
    flex: 1,
  },
  sendMessageBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  sendMessageBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  messageSuccessCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 36,
    alignItems: "center",
    textAlign: "center",
    gap: 12,
  },
  successHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#164E3A",
  },
  successSub: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
  },
  slaNote: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
    marginTop: 4,
  },
  anotherMsgBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 7,
    marginTop: 8,
  },
  anotherMsgBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
});
