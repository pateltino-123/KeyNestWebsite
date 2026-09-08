import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useWindowDimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Send,
  Building,
  CheckCircle2,
} from "lucide-react-native";
import WebsiteLayout from "@/components/keynest/WebsiteLayout";
import {
  KEYNEST_INFO,
  SERVICE_CITIES,
} from "@/constants/keynestData";

export default function ContactPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;

  const [activeCityId, setActiveCityId] = useState(SERVICE_CITIES[0].id);
  const selectedCity = SERVICE_CITIES.find((c) => c.id === activeCityId) || SERVICE_CITIES[0];

  // Contact Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("Property Owner");
  const [formAddress, setFormAddress] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      alert("Please enter your name, email, and phone number.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const callPhone = (num: string) => {
    Linking.openURL(`tel:${num.replace(/[^0-9]/g, "")}`).catch(() => {});
  };

  const emailAddress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#38BDF8" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Service Territory & Contact</Text>
          <Text style={styles.pageSubtitle}>
            Serving North Texas rental owners across 7 core communities. Reach our leadership team directly at our The Colony headquarters.
          </Text>
        </View>
      </View>

      {/* 1. Quick Office Information Bar */}
      <View style={styles.officeBar}>
        <View style={styles.innerContainer}>
          <View
            style={[
              styles.officeBarRow,
              { flexDirection: isDesktop ? "row" : "column" },
            ]}
          >
            <View style={styles.officeBarItem}>
              <View style={styles.iconCircle}>
                <Building size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.officeItemLabel}>Corporate Headquarters</Text>
                <Text style={styles.officeItemVal}>{KEYNEST_INFO.officeAddress}</Text>
                <Text style={styles.officeItemSub}>Under Fair Deal Realty Inc.</Text>
              </View>
            </View>

            <View style={styles.officeBarItem}>
              <View style={styles.iconCircle}>
                <Phone size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.officeItemLabel}>Direct Phone Lines</Text>
                <TouchableOpacity onPress={() => callPhone(KEYNEST_INFO.phone)}>
                  <Text style={styles.officePhoneLink}>{KEYNEST_INFO.phone}</Text>
                </TouchableOpacity>
                <Text style={styles.officeItemSub}>Hours: {KEYNEST_INFO.hours}</Text>
              </View>
            </View>

            <View style={styles.officeBarItem}>
              <View style={styles.iconCircle}>
                <Mail size={20} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.officeItemLabel}>Email Inquiries</Text>
                <TouchableOpacity onPress={() => emailAddress(KEYNEST_INFO.email)}>
                  <Text style={styles.officeEmailLink}>{KEYNEST_INFO.email}</Text>
                </TouchableOpacity>
                <Text style={styles.officeItemSub}>Response within 2 hours</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Interactive 7-City Service Territory Spotlight */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>LOCAL EXPERTISE</Text>
            <Text style={styles.sectionTitle}>Seven Approved North Texas Markets</Text>
            <Text style={styles.sectionSubtitle}>
              Click any city tab below to review median rental statistics, average days on market, school ratings, and local investor notes.
            </Text>
          </View>

          {/* City Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cityTabsScroll}
          >
            {SERVICE_CITIES.map((city) => {
              const isActive = city.id === activeCityId;
              return (
                <TouchableOpacity
                  key={city.id}
                  style={[styles.cityTabBtn, isActive && styles.cityTabBtnActive]}
                  onPress={() => setActiveCityId(city.id)}
                >
                  <MapPin size={14} color={isActive ? "#FFFFFF" : "#2563EB"} />
                  <Text style={[styles.cityTabText, isActive && styles.cityTabTextActive]}>
                    {city.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Active City Spotlight Card */}
          <View style={styles.citySpotlightCard}>
            <View style={styles.spotlightHeaderRow}>
              <View>
                <Text style={styles.spotlightCityName}>{selectedCity.name}, TX</Text>
                <Text style={styles.spotlightTagline}>{selectedCity.tagline}</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>ACTIVE COVERAGE</Text>
              </View>
            </View>

            <View
              style={[
                styles.cityStatsGrid,
                { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column" },
              ]}
            >
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Median Rent</Text>
                <Text style={styles.statVal}>{selectedCity.medianRent}</Text>
                <Text style={styles.statSub}>Single Family & Townhome</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Avg Days on Market</Text>
                <Text style={styles.statVal}>{selectedCity.avgDaysOnMarket}</Text>
                <Text style={styles.statSub}>MLS Closed Leasing</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Primary County</Text>
                <Text style={styles.statVal}>{selectedCity.county}</Text>
                <Text style={styles.statSub}>North Texas Region</Text>
              </View>
            </View>

            <View style={styles.cityContextWrap}>
              <Text style={styles.cityContextHeading}>North Texas Investor Market Context</Text>
              <Text style={styles.cityContextText}>{selectedCity.ownerContext}</Text>
            </View>

            <View style={styles.zipCodesRow}>
              <Text style={styles.zipCodesLabel}>Zip Codes Served:</Text>
              <Text style={styles.zipCodesList}>{selectedCity.zipCodes.join(", ")}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Interactive Contact Form & Managers */}
      <View style={styles.sectionAlt}>
        <View style={styles.innerContainer}>
          <View style={[styles.contactRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            {/* Form Column */}
            <View style={[styles.formCol, { width: isDesktop ? "56%" : "100%" }]}>
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>Send a Direct Message</Text>
                <Text style={styles.formSub}>
                  Inquiries are routed directly to Dinesh Donthula and Purvang Patel.
                </Text>

                {!submitted ? (
                  <View style={styles.formBody}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Your Full Name *</Text>
                      <TextInput
                        style={styles.inputField}
                        placeholder="e.g. Michael Miller"
                        placeholderTextColor="#94A3B8"
                        value={formName}
                        onChangeText={setFormName}
                      />
                    </View>

                    <View style={styles.inputRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Email Address *</Text>
                        <TextInput
                          style={styles.inputField}
                          placeholder="michael@example.com"
                          placeholderTextColor="#94A3B8"
                          value={formEmail}
                          onChangeText={setFormEmail}
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
                          value={formPhone}
                          onChangeText={setFormPhone}
                          keyboardType="phone-pad"
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>I am a:</Text>
                      <View style={styles.roleChipsRow}>
                        {["Property Owner", "Current Resident", "Prospective Tenant", "Vendor"].map((role) => (
                          <TouchableOpacity
                            key={role}
                            style={[styles.roleChip, formRole === role && styles.roleChipActive]}
                            onPress={() => setFormRole(role)}
                          >
                            <Text style={[styles.roleChipText, formRole === role && styles.roleChipTextActive]}>
                              {role}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Property Address (If Applicable)</Text>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Street address in North Texas"
                        placeholderTextColor="#94A3B8"
                        value={formAddress}
                        onChangeText={setFormAddress}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>How Can We Help You?</Text>
                      <TextInput
                        style={[styles.inputField, { height: 90, textAlignVertical: "top" }]}
                        placeholder="Tell us about your management needs or questions..."
                        placeholderTextColor="#94A3B8"
                        value={formMessage}
                        onChangeText={setFormMessage}
                        multiline
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
                        <>
                          <Send size={16} color="#FFFFFF" />
                          <Text style={styles.submitBtnText}>Submit Message</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.successFormWrap}>
                    <CheckCircle2 size={40} color="#10B981" />
                    <Text style={styles.successFormTitle}>Message Received!</Text>
                    <Text style={styles.successFormSub}>
                      Thank you, {formName}. Your inquiry has been forwarded to Dinesh Donthula and Purvang Patel. We will be in touch shortly.
                    </Text>
                    <TouchableOpacity
                      style={styles.resetFormBtn}
                      onPress={() => {
                        setSubmitted(false);
                        setFormMessage("");
                      }}
                    >
                      <Text style={styles.resetFormBtnText}>Send Another Message</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Leadership Contact Cards Column */}
            <View style={[styles.sidebarCol, { width: isDesktop ? "40%" : "100%" }]}>
              <View style={styles.sidebarCard}>
                <Text style={styles.sidebarTitle}>Direct Management Leadership</Text>
                <Text style={styles.sidebarSub}>
                  No call center delays. Reach our authorized managers directly:
                </Text>

                {KEYNEST_INFO.authorizedManagers.map((leader, idx) => (
                  <View key={idx} style={styles.managerCard}>
                    <Text style={styles.managerName}>{leader.name}</Text>
                    <Text style={styles.managerRole}>{leader.title}</Text>
                    <Text style={styles.managerBroker}>Fair Deal Realty Inc.</Text>
                    <View style={styles.managerActions}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => callPhone(KEYNEST_INFO.phone)}
                      >
                        <Phone size={13} color="#2563EB" />
                        <Text style={styles.actionBtnText}>Call Office</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => emailAddress(KEYNEST_INFO.email)}
                      >
                        <Mail size={13} color="#2563EB" />
                        <Text style={styles.actionBtnText}>Email Direct</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <View style={styles.trecNoteCard}>
                  <ShieldCheck size={16} color="#2563EB" />
                  <Text style={styles.trecNoteText}>
                    Texas Real Estate Commission Consumer Notice: Real estate licensees are required to provide the TREC Information About Brokerage Services (IABS) to all prospective clients.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  headerHero: {
    backgroundColor: "#0B1120",
    paddingVertical: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
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
    backgroundColor: "#1E293B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 16,
  },
  badgePillText: {
    color: "#E2E8F0",
    fontSize: 12.5,
    fontWeight: "600",
  },
  pageTitle: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -1,
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 16.5,
    color: "#94A3B8",
    maxWidth: 760,
    lineHeight: 25,
  },
  officeBar: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  officeBarRow: {
    justifyContent: "space-between",
    gap: 24,
  },
  officeBarItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  officeItemLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  officeItemVal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  officePhoneLink: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2563EB",
  },
  officeEmailLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
  },
  officeItemSub: {
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 2,
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 72,
  },
  sectionAlt: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 72,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    marginBottom: 36,
    textAlign: "center",
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#64748B",
    maxWidth: 720,
    textAlign: "center",
    lineHeight: 24,
  },
  cityTabsScroll: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 16,
    justifyContent: "center",
  },
  cityTabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cityTabBtnActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  cityTabText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#334155",
  },
  cityTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  citySpotlightCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 20,
    marginTop: 12,
  },
  spotlightHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightCityName: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
  },
  spotlightTagline: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: "#D1FAE5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  activeBadgeText: {
    color: "#065F46",
    fontSize: 11,
    fontWeight: "800",
  },
  cityStatsGrid: {
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  statVal: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  statSub: {
    fontSize: 11.5,
    color: "#94A3B8",
  },
  cityContextWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  cityContextHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  cityContextText: {
    fontSize: 13.5,
    color: "#475569",
    lineHeight: 21,
  },
  zipCodesRow: {
    flexDirection: "row",
    gap: 8,
  },
  zipCodesLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  zipCodesList: {
    fontSize: 13,
    color: "#64748B",
  },
  contactRow: {
    justifyContent: "space-between",
    gap: 36,
  },
  formCol: {
    alignItems: "center",
  },
  formCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  formSub: {
    fontSize: 13.5,
    color: "#64748B",
    marginTop: -8,
  },
  formBody: {
    gap: 14,
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
    color: "#334155",
  },
  inputField: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0F172A",
  },
  roleChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roleChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  roleChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  roleChipTextActive: {
    color: "#FFFFFF",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  successFormWrap: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  successFormTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
  },
  successFormSub: {
    fontSize: 13.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 400,
  },
  resetFormBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 8,
  },
  resetFormBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "600",
  },
  sidebarCol: {
    alignItems: "center",
  },
  sidebarCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 16,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  sidebarSub: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 19,
    marginTop: -6,
  },
  managerCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  managerName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  managerRole: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  managerBroker: {
    fontSize: 11.5,
    color: "#64748B",
  },
  managerActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E40AF",
  },
  trecNoteCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  trecNoteText: {
    fontSize: 11.5,
    color: "#1E40AF",
    lineHeight: 16,
    flex: 1,
  },
});
