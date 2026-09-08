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
import {
  ShieldCheck,
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ExternalLink,
  CheckCircle2,
  X,
  Check,
  Eye,
  ArrowRight,
} from "lucide-react-native";
import WebsiteLayout from "@/components/keynest/WebsiteLayout";
import {
  FEATURED_RENTALS,
  RentalProperty,
} from "@/constants/keynestData";

export default function AvailableRentalsPage() {
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
    }, 600);
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
          <Text style={styles.pageTitle}>Available North Texas Rentals</Text>
          <Text style={styles.pageSubtitle}>
            Browse verified single-family and townhome residences managed under high fiduciary standards across North Texas.
          </Text>
        </View>
      </View>

      {/* Filter & Search Bar */}
      <View style={styles.filterSection}>
        <View style={styles.innerContainer}>
          <View style={styles.filterCard}>
            {/* Search Input */}
            <View style={styles.searchBarRow}>
              <View style={styles.searchInputBox}>
                <Search size={18} color="#64748B" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by neighborhood, street, or city..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <X size={16} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* City Pills Row */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupLabel}>City Filter:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
                {citiesList.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.filterPill, selectedCity === c && styles.filterPillActive]}
                    onPress={() => setSelectedCity(c)}
                  >
                    <Text style={[styles.filterPillText, selectedCity === c && styles.filterPillTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Bedroom & Pet Filters */}
            <View style={styles.secondaryFiltersRow}>
              <View style={styles.bedFiltersGroup}>
                <Text style={styles.filterGroupLabel}>Min Beds:</Text>
                {["Any", "3", "4", "5"].map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.miniFilterPill, selectedBeds === b && styles.miniFilterPillActive]}
                    onPress={() => setSelectedBeds(b)}
                  >
                    <Text style={[styles.miniFilterPillText, selectedBeds === b && styles.miniFilterPillTextActive]}>
                      {b === "Any" ? "Any" : `${b}+ Beds`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.petToggle, petFilter && styles.petToggleActive]}
                onPress={() => setPetFilter(!petFilter)}
              >
                <Check size={14} color={petFilter ? "#FFFFFF" : "#64748B"} />
                <Text style={[styles.petToggleText, petFilter && styles.petToggleTextActive]}>
                  Pets Allowed Only
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Property Cards Grid */}
      <View style={styles.resultsSection}>
        <View style={styles.innerContainer}>
          <View style={styles.resultsCountRow}>
            <Text style={styles.resultsCountText}>
              Showing <Text style={{ fontWeight: "800", color: "#0F172A" }}>{filteredProperties.length}</Text> available properties
            </Text>
          </View>

          {filteredProperties.length > 0 ? (
            <View
              style={[
                styles.propertiesGrid,
                { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
              ]}
            >
              {filteredProperties.map((property) => (
                <View
                  key={property.id}
                  style={[
                    styles.propertyCard,
                    { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                  ]}
                >
                  <View style={styles.imageWrap}>
                    <Image source={{ uri: property.imageUrl }} style={styles.propertyImg} />
                    <View style={styles.pricePill}>
                      <Text style={styles.pricePillText}>${property.price.toLocaleString()}/mo</Text>
                    </View>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>{(property.status || property.availableDate).toUpperCase()}</Text>
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.cityLocationRow}>
                      <MapPin size={13} color="#2563EB" />
                      <Text style={styles.cityLocationText}>{property.city}, TX {property.zip}</Text>
                    </View>

                    <Text style={styles.cardPropertyTitle} numberOfLines={1}>{property.title}</Text>
                    <Text style={styles.cardAddress} numberOfLines={1}>{property.address}</Text>

                    <View style={styles.specsRow}>
                      <View style={styles.specItem}>
                        <Bed size={14} color="#64748B" />
                        <Text style={styles.specVal}>{property.beds} Beds</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Bath size={14} color="#64748B" />
                        <Text style={styles.specVal}>{property.baths} Baths</Text>
                      </View>
                      <View style={styles.specItem}>
                        <Maximize2 size={14} color="#64748B" />
                        <Text style={styles.specVal}>{property.sqft.toLocaleString()} Sq Ft</Text>
                      </View>
                    </View>

                    <View style={styles.cardButtonsRow}>
                      <TouchableOpacity
                        style={styles.detailsBtn}
                        onPress={() => {
                          setSelectedProperty(property);
                          setInquirySuccess(false);
                        }}
                      >
                        <Eye size={14} color="#0F172A" />
                        <Text style={styles.detailsBtnText}>View Details</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.applyBtn}
                        onPress={() => openAppFolioApply(property.appFolioApplyUrl)}
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
            <View style={styles.noResultsBox}>
              <Text style={styles.noResultsTitle}>No properties match your current filters.</Text>
              <Text style={styles.noResultsSub}>Try clearing search terms or selecting All Cities.</Text>
              <TouchableOpacity
                style={styles.clearFiltersBtn}
                onPress={() => {
                  setSelectedCity("All Cities");
                  setSelectedBeds("Any");
                  setPetFilter(false);
                  setSearchQuery("");
                }}
              >
                <Text style={styles.clearFiltersText}>Reset All Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Property Details & Tour Scheduling Modal */}
      {selectedProperty && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedProperty(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { maxWidth: isDesktop ? 680 : "94%" }]}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalPropTitle}>{selectedProperty.title}</Text>
                  <Text style={styles.modalPropAddress}>
                    {selectedProperty.address}, {selectedProperty.city}, TX {selectedProperty.zip}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedProperty(null)}
                  style={styles.modalCloseBtn}
                >
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 24, gap: 16 }}>
                <Image source={{ uri: selectedProperty.imageUrl }} style={styles.modalPropImage} />

                <View style={styles.modalPriceHighlight}>
                  <View>
                    <Text style={styles.modalPriceLabel}>Monthly Rent</Text>
                    <Text style={styles.modalPriceVal}>${selectedProperty.price.toLocaleString()} / mo</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalApplyNowBtn}
                    onPress={() => openAppFolioApply(selectedProperty.appFolioApplyUrl)}
                  >
                    <Text style={styles.modalApplyNowText}>Apply via AppFolio</Text>
                    <ExternalLink size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalSpecsGrid}>
                  <View style={styles.modalSpecBox}>
                    <Text style={styles.modalSpecLabel}>Bedrooms</Text>
                    <Text style={styles.modalSpecVal}>{selectedProperty.beds} Beds</Text>
                  </View>
                  <View style={styles.modalSpecBox}>
                    <Text style={styles.modalSpecLabel}>Bathrooms</Text>
                    <Text style={styles.modalSpecVal}>{selectedProperty.baths} Baths</Text>
                  </View>
                  <View style={styles.modalSpecBox}>
                    <Text style={styles.modalSpecLabel}>Square Feet</Text>
                    <Text style={styles.modalSpecVal}>{selectedProperty.sqft.toLocaleString()} Sq Ft</Text>
                  </View>
                  <View style={styles.modalSpecBox}>
                    <Text style={styles.modalSpecLabel}>School District</Text>
                    <Text style={styles.modalSpecVal}>{selectedProperty.schoolDistrict || `${selectedProperty.city} ISD`}</Text>
                  </View>
                </View>

                {/* Amenities */}
                <View style={styles.amenitiesSection}>
                  <Text style={styles.amenitiesHeading}>Key Home Amenities</Text>
                  <View style={styles.amenitiesGrid}>
                    {selectedProperty.features.map((feat, idx) => (
                      <View key={idx} style={styles.amenityItem}>
                        <CheckCircle2 size={15} color="#2563EB" />
                        <Text style={styles.amenityText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Tour & Inquiry Form */}
                <View style={styles.inquiryBox}>
                  <Text style={styles.inquiryTitle}>Schedule an Agent-Accompanied Showing</Text>
                  <Text style={styles.inquirySub}>
                    Directly connected to Dinesh Donthula and Purvang Patel at KeyNest Realty.
                  </Text>

                  {!inquirySuccess ? (
                    <View style={{ gap: 10, marginTop: 10 }}>
                      <TextInput
                        style={styles.inquiryInput}
                        placeholder="Your Full Name *"
                        placeholderTextColor="#94A3B8"
                        value={inquiryName}
                        onChangeText={setInquiryName}
                      />
                      <View style={{ flexDirection: "row", gap: 10 }}>
                        <TextInput
                          style={[styles.inquiryInput, { flex: 1 }]}
                          placeholder="Email Address *"
                          placeholderTextColor="#94A3B8"
                          value={inquiryEmail}
                          onChangeText={setInquiryEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                        <TextInput
                          style={[styles.inquiryInput, { flex: 1 }]}
                          placeholder="Phone Number *"
                          placeholderTextColor="#94A3B8"
                          value={inquiryPhone}
                          onChangeText={setInquiryPhone}
                          keyboardType="phone-pad"
                        />
                      </View>
                      <TextInput
                        style={[styles.inquiryInput, { height: 60, textAlignVertical: "top" }]}
                        placeholder="Preferred showing date and time or questions..."
                        placeholderTextColor="#94A3B8"
                        value={inquiryMessage}
                        onChangeText={setInquiryMessage}
                        multiline
                      />
                      <TouchableOpacity
                        style={styles.inquirySubmitBtn}
                        onPress={handleInquirySubmit}
                        disabled={isSubmittingInquiry}
                      >
                        {isSubmittingInquiry ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <>
                            <Text style={styles.inquirySubmitText}>Send Tour Request</Text>
                            <ArrowRight size={15} color="#FFFFFF" />
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.inquirySuccessBox}>
                      <CheckCircle2 size={32} color="#10B981" />
                      <Text style={styles.inquirySuccessTitle}>Showing Request Received!</Text>
                      <Text style={styles.inquirySuccessSub}>
                        Thank you, {inquiryName}. An agent will contact you within 2 business hours to confirm your showing.
                      </Text>
                    </View>
                  )}
                </View>
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
  filterSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filterCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 14,
  },
  searchBarRow: {
    flexDirection: "row",
    gap: 12,
  },
  searchInputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  filterGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterGroupLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  pillsScroll: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  filterPillActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterPillText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#334155",
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },
  secondaryFiltersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  bedFiltersGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniFilterPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  miniFilterPillActive: {
    backgroundColor: "#0F172A",
    borderColor: "#0F172A",
  },
  miniFilterPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  miniFilterPillTextActive: {
    color: "#FFFFFF",
  },
  petToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  petToggleActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  petToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  petToggleTextActive: {
    color: "#FFFFFF",
  },
  resultsSection: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 48,
  },
  resultsCountRow: {
    marginBottom: 24,
  },
  resultsCountText: {
    fontSize: 14,
    color: "#64748B",
  },
  propertiesGrid: {
    gap: 24,
    justifyContent: "space-between",
  },
  propertyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  propertyImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pricePill: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "#0F172A",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  pricePillText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  statusPill: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusPillText: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
  },
  cardContent: {
    padding: 18,
    gap: 8,
  },
  cityLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityLocationText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "700",
  },
  cardPropertyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  cardAddress: {
    fontSize: 13,
    color: "#64748B",
  },
  specsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specVal: {
    fontSize: 12.5,
    color: "#334155",
    fontWeight: "600",
  },
  cardButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  detailsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingVertical: 10,
    borderRadius: 8,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  applyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  noResultsBox: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  noResultsSub: {
    fontSize: 14,
    color: "#64748B",
  },
  clearFiltersBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 8,
  },
  clearFiltersText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
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
    maxHeight: "92%",
    shadowColor: "#0F172A",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  modalPropTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  modalPropAddress: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 8,
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalPropImage: {
    width: "100%",
    height: 240,
    borderRadius: 12,
  },
  modalPriceHighlight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  modalPriceLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1E40AF",
    letterSpacing: 0.8,
  },
  modalPriceVal: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1D4ED8",
  },
  modalApplyNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalApplyNowText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  modalSpecsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  modalSpecBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalSpecLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  modalSpecVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },
  amenitiesSection: {
    gap: 8,
  },
  amenitiesHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  amenitiesGrid: {
    gap: 6,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amenityText: {
    fontSize: 13,
    color: "#334155",
  },
  inquiryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inquiryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  inquirySub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  inquiryInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#0F172A",
  },
  inquirySubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  inquirySubmitText: {
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
    color: "#0F172A",
  },
  inquirySuccessSub: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
  },
});
