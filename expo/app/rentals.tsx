import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
  useWindowDimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ShieldCheck,
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  ExternalLink,
  CheckCircle2,
  X,
  Check,
  Eye,
} from "lucide-react-native";
import WebsiteLayout from "@/components/keynest/WebsiteLayout";
import {
  FEATURED_RENTALS,
  RentalProperty,
} from "@/constants/keynestData";

export default function AvailableRentalsPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;

  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedBeds, setSelectedBeds] = useState("Any");
  const [petFilter, setPetFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Selected property for modal view & inquiry
  const [selectedProperty, setSelectedProperty] = useState<RentalProperty | null>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("Schedule a Showing");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const citiesList = ["All Cities", "The Colony", "Frisco", "Plano", "McKinney", "Allen", "Prosper"];

  const filteredProperties = useMemo(() => {
    return FEATURED_RENTALS.filter((prop) => {
      if (selectedCity !== "All Cities" && prop.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      if (selectedBeds !== "Any") {
        const requiredBeds = parseInt(selectedBeds);
        if (prop.beds < requiredBeds) return false;
      }
      if (petFilter && !prop.petsAllowed) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(query);
        const matchAddr = prop.address.toLowerCase().includes(query);
        const matchCity = prop.city.toLowerCase().includes(query);
        if (!matchTitle && !matchAddr && !matchCity) return false;
      }
      return true;
    });
  }, [selectedCity, selectedBeds, petFilter, searchQuery]);

  const openAppFolioApply = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const handleInquirySubmit = () => {
    if (!inquiryName.trim() || !inquiryEmail.trim() || !inquiryPhone.trim()) {
      alert("Please enter your name, email, and phone number.");
      return;
    }
    setIsSubmittingInquiry(true);
    setTimeout(() => {
      setIsSubmittingInquiry(false);
      setInquirySuccess(true);
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
          <Text style={styles.pageTitle}>Available North Texas Rentals</Text>
          <Text style={styles.pageSubtitle}>
            Browse meticulously maintained single-family homes and luxury townhomes across The Colony, Frisco, Plano, McKinney, Allen, and Prosper.
          </Text>
        </View>
      </View>

      {/* Filter Bar Section */}
      <View style={styles.filterSection}>
        <View style={styles.innerContainer}>
          <View style={styles.filterCard}>
            <View style={styles.filterRow}>
              {/* Search input */}
              <View style={styles.searchBox}>
                <Search size={18} color="#9CA3AF" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by neighborhood, street, or city..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <X size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>

              {/* City Filter Chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cityChipsRow}
              >
                {citiesList.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.cityChip, selectedCity === c && styles.cityChipActive]}
                    onPress={() => setSelectedCity(c)}
                  >
                    <Text
                      style={[
                        styles.cityChipText,
                        selectedCity === c && styles.cityChipTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Sub-Filters: Beds & Pet-Friendly */}
            <View style={styles.subFiltersRow}>
              <View style={styles.bedFiltersGroup}>
                <Text style={styles.subFilterLabel}>Min Bedrooms:</Text>
                {["Any", "3+", "4+", "5+"].map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.bedChip, selectedBeds === b && styles.bedChipActive]}
                    onPress={() => setSelectedBeds(b)}
                  >
                    <Text
                      style={[
                        styles.bedChipText,
                        selectedBeds === b && styles.bedChipTextActive,
                      ]}
                    >
                      {b}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.petToggle, petFilter && styles.petToggleActive]}
                onPress={() => setPetFilter(!petFilter)}
              >
                <View style={[styles.checkbox, petFilter && styles.checkboxActive]}>
                  {petFilter && <Check size={12} color="#FFFFFF" />}
                </View>
                <Text style={[styles.petToggleText, petFilter && styles.petToggleTextActive]}>
                  Pet-Friendly Only
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Rentals Grid Listing */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.resultsCountRow}>
            <Text style={styles.resultsCountText}>
              Showing <Text style={{ fontWeight: "800", color: "#164E3A" }}>{filteredProperties.length}</Text> available properties
            </Text>
            <TouchableOpacity onPress={() => router.push("/tenants" as never)}>
              <Text style={styles.criteriaLink}>View Published Rental Criteria →</Text>
            </TouchableOpacity>
          </View>

          {filteredProperties.length > 0 ? (
            <View
              style={[
                styles.propertiesGrid,
                { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
              ]}
            >
              {filteredProperties.map((prop) => (
                <View
                  key={prop.id}
                  style={[
                    styles.propertyCard,
                    { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                  ]}
                >
                  <View style={styles.cardImageWrap}>
                    <Image source={{ uri: prop.imageUrl }} style={styles.propImage} />
                    <View style={styles.pricePill}>
                      <Text style={styles.pricePillText}>${prop.price.toLocaleString()} / mo</Text>
                    </View>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{prop.propertyType}</Text>
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.cityRow}>
                      <MapPin size={13} color="#059669" />
                      <Text style={styles.cityText}>{prop.city}, TX {prop.zip}</Text>
                    </View>

                    <Text style={styles.propertyTitle}>{prop.title}</Text>
                    <Text style={styles.propertyAddress}>{prop.address}</Text>

                    {/* Specs */}
                    <View style={styles.specsRow}>
                      <View style={styles.specItem}>
                        <Bed size={15} color="#4B5563" />
                        <Text style={styles.specText}>{prop.beds} Beds</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Bath size={15} color="#4B5563" />
                        <Text style={styles.specText}>{prop.baths} Baths</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Maximize2 size={14} color="#4B5563" />
                        <Text style={styles.specText}>{prop.sqft.toLocaleString()} Sq Ft</Text>
                      </View>
                    </View>

                    <View style={styles.availabilityRow}>
                      <Calendar size={13} color="#6B7280" />
                      <Text style={styles.availText}>Available: {prop.availableDate}</Text>
                    </View>

                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity
                        style={styles.detailsBtn}
                        onPress={() => setSelectedProperty(prop)}
                      >
                        <Eye size={14} color="#164E3A" />
                        <Text style={styles.detailsBtnText}>View Details</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => openAppFolioApply(prop.appFolioApplyUrl)}
                      >
                        <Text style={styles.applyBtnText}>Apply Now</Text>
                        <ExternalLink size={13} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateBox}>
              <Search size={40} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No rental properties match your search</Text>
              <Text style={styles.emptyStateSub}>
                Try resetting your city or bedroom filters, or contact our leasing department directly.
              </Text>
              <TouchableOpacity
                style={styles.resetFiltersBtn}
                onPress={() => {
                  setSelectedCity("All Cities");
                  setSelectedBeds("Any");
                  setPetFilter(false);
                  setSearchQuery("");
                }}
              >
                <Text style={styles.resetFiltersBtnText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Property Detail & Tenant Inquiry Modal */}
      {selectedProperty && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setSelectedProperty(null);
            setInquirySuccess(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { maxWidth: isDesktop ? 720 : "94%" }]}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalPropertyTitle}>{selectedProperty.title}</Text>
                  <Text style={styles.modalPropertyAddress}>
                    {selectedProperty.address}, {selectedProperty.city}, TX {selectedProperty.zip}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedProperty(null);
                    setInquirySuccess(false);
                  }}
                  style={styles.modalCloseBtn}
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 20, gap: 16 }}>
                {/* Image */}
                <Image source={{ uri: selectedProperty.imageUrl }} style={styles.modalImage} />

                {/* Key Specs Bar */}
                <View style={styles.modalSpecsBar}>
                  <View style={styles.modalPriceBlock}>
                    <Text style={styles.modalPriceValue}>${selectedProperty.price.toLocaleString()}</Text>
                    <Text style={styles.modalPriceSub}>/ month</Text>
                  </View>
                  <View style={styles.modalDivider} />
                  <View style={styles.modalSpecItem}>
                    <Text style={styles.modalSpecNum}>{selectedProperty.beds}</Text>
                    <Text style={styles.modalSpecLbl}>Beds</Text>
                  </View>
                  <View style={styles.modalSpecItem}>
                    <Text style={styles.modalSpecNum}>{selectedProperty.baths}</Text>
                    <Text style={styles.modalSpecLbl}>Baths</Text>
                  </View>
                  <View style={styles.modalSpecItem}>
                    <Text style={styles.modalSpecNum}>{selectedProperty.sqft.toLocaleString()}</Text>
                    <Text style={styles.modalSpecLbl}>Sq Ft</Text>
                  </View>
                  <View style={styles.modalSpecItem}>
                    <Text style={styles.modalSpecNum}>${selectedProperty.deposit.toLocaleString()}</Text>
                    <Text style={styles.modalSpecLbl}>Deposit</Text>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionHeading}>Property Overview</Text>
                  <Text style={styles.modalDescriptionText}>{selectedProperty.description}</Text>
                </View>

                {/* Features & Amenities */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionHeading}>Features & Community Amenities</Text>
                  <View style={styles.featuresList}>
                    {selectedProperty.features.map((feat, i) => (
                      <View key={i} style={styles.featurePill}>
                        <CheckCircle2 size={14} color="#059669" />
                        <Text style={styles.featurePillText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Pet Policy */}
                <View style={styles.petPolicyBox}>
                  <Text style={styles.petPolicyHeading}>Pet Policy & Guidelines:</Text>
                  <Text style={styles.petPolicyText}>{selectedProperty.petTerms}</Text>
                </View>

                {/* Tenant Inquiry Form (Slide 9 routing: Leasing Queue) */}
                <View style={styles.inquiryFormCard}>
                  <Text style={styles.inquiryCardTitle}>Inquire About This Home</Text>
                  <Text style={styles.inquiryCardSub}>
                    Routed directly to the KeyNest Leasing Team under Fair Deal Realty Inc.
                  </Text>

                  {!inquirySuccess ? (
                    <View style={styles.inquiryFields}>
                      <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                          <Text style={styles.label}>Your Name *</Text>
                          <TextInput
                            style={styles.input}
                            value={inquiryName}
                            onChangeText={setInquiryName}
                            placeholder="Full Name"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                          <Text style={styles.label}>Phone Number *</Text>
                          <TextInput
                            style={styles.input}
                            value={inquiryPhone}
                            onChangeText={setInquiryPhone}
                            placeholder="(972) 000-0000"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="phone-pad"
                          />
                        </View>
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address *</Text>
                        <TextInput
                          style={styles.input}
                          value={inquiryEmail}
                          onChangeText={setInquiryEmail}
                          placeholder="name@domain.com"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Inquiry Type</Text>
                        <View style={styles.chipsRow}>
                          {["Schedule a Showing", "Application Question", "Move-In Date Question"].map((t) => (
                            <TouchableOpacity
                              key={t}
                              style={[styles.chip, inquiryType === t && styles.chipActive]}
                              onPress={() => setInquiryType(t)}
                            >
                              <Text style={[styles.chipText, inquiryType === t && styles.chipTextActive]}>
                                {t}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>Message or Preferred Tour Times (Optional)</Text>
                        <TextInput
                          style={[styles.input, styles.textArea]}
                          multiline
                          numberOfLines={3}
                          value={inquiryMessage}
                          onChangeText={setInquiryMessage}
                          placeholder="Questions about move-in timing, schools, or showing availability..."
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>

                      <TouchableOpacity
                        style={styles.submitInquiryBtn}
                        onPress={handleInquirySubmit}
                        disabled={isSubmittingInquiry}
                      >
                        {isSubmittingInquiry ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <Text style={styles.submitInquiryBtnText}>Submit to Leasing Queue</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.inquirySuccessBox}>
                      <CheckCircle2 size={40} color="#10B981" />
                      <Text style={styles.inquirySuccessTitle}>Inquiry Sent to Leasing Queue!</Text>
                      <Text style={styles.inquirySuccessText}>
                        Thank you, {inquiryName}. A leasing coordinator will contact you via email or phone within 4 business hours to answer your questions or confirm showing access.
                      </Text>
                    </View>
                  )}
                </View>

                {/* Direct AppFolio Apply CTA */}
                <TouchableOpacity
                  style={styles.modalApplyPrimary}
                  onPress={() => openAppFolioApply(selectedProperty.appFolioApplyUrl)}
                >
                  <Text style={styles.modalApplyPrimaryText}>Apply for This Property on AppFolio</Text>
                  <ExternalLink size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
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
  filterSection: {
    backgroundColor: "#F8FAF9",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    gap: 14,
  },
  filterRow: {
    gap: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  cityChipsRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  cityChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cityChipActive: {
    backgroundColor: "#164E3A",
    borderColor: "#164E3A",
  },
  cityChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#4B5563",
  },
  cityChipTextActive: {
    color: "#FFFFFF",
  },
  subFiltersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  bedFiltersGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subFilterLabel: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#4B5563",
  },
  bedChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  bedChipActive: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  bedChipText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  bedChipTextActive: {
    color: "#065F46",
    fontWeight: "800",
  },
  petToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  petToggleActive: {
    backgroundColor: "#ECFDF5",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  petToggleText: {
    fontSize: 12.5,
    color: "#4B5563",
    fontWeight: "500",
  },
  petToggleTextActive: {
    color: "#065F46",
    fontWeight: "700",
  },
  sectionWhite: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 48,
  },
  resultsCountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  resultsCountText: {
    fontSize: 15,
    color: "#4B5563",
  },
  criteriaLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#164E3A",
    textDecorationLine: "underline",
  },
  propertiesGrid: {
    gap: 24,
    justifyContent: "space-between",
  },
  propertyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  cardImageWrap: {
    position: "relative",
  },
  propImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E7EB",
  },
  pricePill: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(22, 78, 58, 0.95)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  pricePillText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "800",
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#164E3A",
  },
  cardContent: {
    padding: 16,
    gap: 8,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#059669",
  },
  propertyTitle: {
    fontSize: 16.5,
    fontWeight: "700",
    color: "#111827",
  },
  propertyAddress: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: -2,
  },
  specsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
    marginVertical: 4,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  specText: {
    fontSize: 12.5,
    color: "#4B5563",
    fontWeight: "600",
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  availText: {
    fontSize: 12,
    color: "#6B7280",
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  detailsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  detailsBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#164E3A",
  },
  applyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#164E3A",
    paddingVertical: 10,
    borderRadius: 6,
  },
  applyBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyStateBox: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  emptyStateSub: {
    fontSize: 13.5,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 420,
  },
  resetFiltersBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginTop: 6,
  },
  resetFiltersBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
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
  modalPropertyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  modalPropertyAddress: {
    fontSize: 12.5,
    color: "#6B7280",
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalImage: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  modalSpecsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalPriceBlock: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  modalPriceValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#164E3A",
  },
  modalPriceSub: {
    fontSize: 12,
    color: "#6B7280",
  },
  modalDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#D1D5DB",
  },
  modalSpecItem: {
    alignItems: "center",
  },
  modalSpecNum: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  modalSpecLbl: {
    fontSize: 11,
    color: "#6B7280",
  },
  modalSection: {
    gap: 8,
  },
  modalSectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  modalDescriptionText: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
  },
  featuresList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  featurePillText: {
    fontSize: 12,
    color: "#166534",
    fontWeight: "500",
  },
  petPolicyBox: {
    backgroundColor: "#FFFBEB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
    gap: 4,
  },
  petPolicyHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  petPolicyText: {
    fontSize: 12.5,
    color: "#B45309",
    lineHeight: 17,
  },
  inquiryFormCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  inquiryCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  inquiryCardSub: {
    fontSize: 11.5,
    color: "#6B7280",
    marginTop: -8,
  },
  inquiryFields: {
    gap: 10,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    borderColor: "#164E3A",
    backgroundColor: "#ECFDF5",
  },
  chipText: {
    fontSize: 11.5,
    color: "#4B5563",
  },
  chipTextActive: {
    color: "#164E3A",
    fontWeight: "700",
  },
  submitInquiryBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 11,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 4,
  },
  submitInquiryBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  inquirySuccessBox: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 8,
  },
  inquirySuccessTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#164E3A",
  },
  inquirySuccessText: {
    fontSize: 12.5,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 18,
  },
  modalApplyPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#059669",
    paddingVertical: 13,
    borderRadius: 8,
    marginTop: 4,
  },
  modalApplyPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
