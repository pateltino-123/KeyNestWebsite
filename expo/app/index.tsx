import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  ShieldCheck,
  Key,
  Calendar,
  Search,
  CheckCircle2,
  MapPin,
  FileCheck,
  Wrench,
  DollarSign,
  ClipboardList,
  ChevronRight,
  Calculator,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import {
  SERVICE_CITIES,
  FEATURED_RENTALS,
} from "@/constants/keynestData";

export default function HomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1080;
  const isTablet = width >= 720 && width < 1080;
  const { openRentalAnalysis, openConsultation } = useWebsiteModals();

  // Interactive Live Rent Estimator in Hero
  const [heroCity, setHeroCity] = useState("The Colony");
  const [heroBeds, setHeroBeds] = useState("4");
  const [heroRent, setHeroRent] = useState("2700");

  // Interactive FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const rentVal = parseFloat(heroRent) || 2700;
  const mgmtFee = Math.round(rentVal * 0.089);
  const netDisbursement = Math.round(rentVal - mgmtFee);
  const annualNet = Math.round(netDisbursement * 12);

  const serviceSummaries = [
    {
      title: "Strategic Leasing",
      icon: Key,
      desc: "Comprehensive market pricing, professional HD photography, syndication across MLS, Zillow & Realtor.com, and agent-accompanied showings.",
      link: "/services",
    },
    {
      title: "Objective Screening",
      icon: FileCheck,
      desc: "Fair Housing-compliant criteria verifying household income (3x rent), credit history, nationwide criminal background, and past rental performance.",
      link: "/services",
    },
    {
      title: "Rent & Trust Accounting",
      icon: DollarSign,
      desc: "Convenient tenant portal collections, prompt owner ACH distributions around the 10th, monthly cash-flow ledgers, and year-end 1099 tax packages.",
      link: "/services",
    },
    {
      title: "Maintenance Coordination",
      icon: Wrench,
      desc: "24/7 intake with 3-tier triage (Emergency, Urgent, Routine), insured local trade vendors, and strict adherence to owner authorization limits.",
      link: "/services",
    },
    {
      title: "Systematic Inspections",
      icon: ClipboardList,
      desc: "Move-in checklists, periodic mid-lease condition audits, and detailed move-out documentation with high-resolution photo archives.",
      link: "/services",
    },
    {
      title: "Broker Compliance",
      icon: ShieldCheck,
      desc: "Brokerage supervision under Fair Deal Realty Inc., broker escrow trust accounts for security deposits, and TREC-approved legal forms.",
      link: "/services",
    },
  ];

  const advantages = [
    {
      title: "Single Point of Owner Contact",
      desc: "Direct access to dedicated local decision-makers (Dinesh Donthula & Purvang Patel) rather than being bounced around call centers.",
    },
    {
      title: "Documented Operating Workflows",
      desc: "Standard operating procedures for leasing, inspections, turnarounds, and vendor triage that eliminate guesswork.",
    },
    {
      title: "AppFolio-Supported Portals",
      desc: "Transparent financial reporting, direct deposit disbursements, 24/7 maintenance tracking, and digital lease archives.",
    },
    {
      title: "Vetted Local Contractor Network",
      desc: "Established relationships with licensed and insured North Texas technicians who provide prompt service at exact invoiced cost.",
    },
    {
      title: "Broker-Supervised Fiduciary Standard",
      desc: "Fair Deal Realty Inc. provides strict TREC regulatory oversight, trust account compliance, and standardized Texas real estate agreements.",
    },
  ];

  const faqs = [
    {
      q: "Do you charge management fees while the home is vacant?",
      a: "No. KeyNest maintains a strict $0 vacant management fee policy. We only earn our management retainer when your property is actively leased and rent is collected.",
    },
    {
      q: "How are maintenance requests and repair invoices handled?",
      a: "We maintain a $350 owner authorization threshold. Any routine repair below that amount is handled quickly with vetted, insured vendors. For repairs exceeding $350, you receive competitive quotes and photo documentation for approval before work begins. We never add markups to vendor invoices.",
    },
    {
      q: "When and how do owners receive rental disbursements?",
      a: "Tenants pay rent on the 1st via AppFolio zero-fee ACH. Once funds clear our broker trust escrow account, owner disbursements are directly ACH deposited into your bank account around the 10th of every month, alongside itemized statements.",
    },
    {
      q: "What areas of North Texas do you actively cover?",
      a: "We actively manage single-family and townhome rentals in The Colony, Frisco, Plano, McKinney, Allen, Prosper, and Carrollton.",
    },
  ];

  return (
    <WebsiteLayout>
      {/* 1. Hero Section */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroContainer}>
          <View style={[styles.heroRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            {/* Hero Left Copy */}
            <View style={[styles.heroTextCol, { width: isDesktop ? "54%" : "100%" }]}>
              <View style={styles.badgePill}>
                <ShieldCheck size={14} color="#38BDF8" />
                <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
              </View>

              <Text style={styles.heroHeadline}>
                North Texas Property{"\n"}
                <Text style={styles.heroHeadlineHighlight}>Management Made Simple</Text>
              </Text>

              <Text style={styles.heroSubhead}>
                Reliable leasing, consistent rent collection, and transparent communication for rental owners across approved North Texas communities.
              </Text>

              {/* Three Calls to Action */}
              <View style={styles.heroCtaGroup}>
                <TouchableOpacity
                  style={styles.primaryHeroBtn}
                  onPress={() => openRentalAnalysis(heroCity)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryHeroBtnText}>Get a Free Rental Analysis</Text>
                  <ArrowRight size={17} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryHeroBtn}
                  onPress={openConsultation}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                >
                  <Calendar size={16} color="#0F172A" />
                  <Text style={styles.secondaryHeroBtnText}>Schedule Consultation</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.tertiaryHeroBtn}
                  onPress={() => router.push("/rentals" as never)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                >
                  <Search size={16} color="#94A3B8" />
                  <Text style={styles.tertiaryHeroBtnText}>Browse Available Rentals</Text>
                </TouchableOpacity>
              </View>

              {/* Trust badges */}
              <View style={styles.trustBadgesRow}>
                <View style={styles.trustBadgeItem}>
                  <CheckCircle2 size={16} color="#38BDF8" />
                  <Text style={styles.trustBadgeText}>TREC Licensed & Supervised</Text>
                </View>
                <View style={styles.trustBadgeItem}>
                  <CheckCircle2 size={16} color="#38BDF8" />
                  <Text style={styles.trustBadgeText}>Zero Management Fee When Vacant</Text>
                </View>
                <View style={styles.trustBadgeItem}>
                  <CheckCircle2 size={16} color="#38BDF8" />
                  <Text style={styles.trustBadgeText}>AppFolio Modern Portal</Text>
                </View>
              </View>
            </View>

            {/* Hero Right: Live Interactive Rent & Cash-Flow Calculator */}
            <View style={[styles.heroCardCol, { width: isDesktop ? "43%" : "100%" }]}>
              <View style={styles.calculatorCard}>
                <View style={styles.calcHeaderRow}>
                  <View style={styles.calcIconBox}>
                    <Calculator size={18} color="#2563EB" />
                  </View>
                  <View>
                    <Text style={styles.calcCardTitle}>Instant Rent & Return Estimator</Text>
                    <Text style={styles.calcCardSub}>Interactive North Texas Market Model</Text>
                  </View>
                </View>

                {/* City Chips */}
                <View style={styles.calcFieldGroup}>
                  <Text style={styles.calcFieldLabel}>Select City:</Text>
                  <View style={styles.calcChipsRow}>
                    {["The Colony", "Frisco", "Plano", "McKinney"].map((c) => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.calcChip, heroCity === c && styles.calcChipActive]}
                        onPress={() => setHeroCity(c)}
                      >
                        <Text style={[styles.calcChipText, heroCity === c && styles.calcChipTextActive]}>
                          {c}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Beds Chips & Monthly Rent Selector */}
                <View style={styles.calcFieldRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.calcFieldLabel}>Bedrooms:</Text>
                    <View style={styles.calcChipsRow}>
                      {["3", "4", "5+"].map((b) => (
                        <TouchableOpacity
                          key={b}
                          style={[styles.calcChip, heroBeds === b && styles.calcChipActive]}
                          onPress={() => setHeroBeds(b)}
                        >
                          <Text style={[styles.calcChipText, heroBeds === b && styles.calcChipTextActive]}>
                            {b}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={{ flex: 1.2 }}>
                    <Text style={styles.calcFieldLabel}>Target Rent ($/mo):</Text>
                    <TextInput
                      style={styles.calcInput}
                      value={heroRent}
                      onChangeText={setHeroRent}
                      keyboardType="numeric"
                      placeholder="2700"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                {/* Live Computed Results */}
                <View style={styles.calcResultsBox}>
                  <View style={styles.calcResultRow}>
                    <Text style={styles.calcResultLabel}>Projected Monthly Rent</Text>
                    <Text style={styles.calcResultValue}>${rentVal.toLocaleString()}/mo</Text>
                  </View>
                  <View style={styles.calcResultRow}>
                    <Text style={styles.calcResultLabel}>Full-Service Fee (8.9%)</Text>
                    <Text style={styles.calcResultFee}>-${mgmtFee.toLocaleString()}/mo</Text>
                  </View>
                  <View style={styles.calcDivider} />
                  <View style={styles.calcResultRow}>
                    <Text style={styles.calcNetLabel}>Net Monthly to Owner</Text>
                    <Text style={styles.calcNetValue}>${netDisbursement.toLocaleString()}/mo</Text>
                  </View>
                  <Text style={styles.calcAnnualNote}>
                    Annual Projected Net: ${annualNet.toLocaleString()}/yr • $0 during vacancy
                  </Text>
                </View>

                {/* Working Actions */}
                <View style={styles.calcActionRow}>
                  <TouchableOpacity
                    style={styles.calcActionBtn}
                    onPress={() => openRentalAnalysis(heroCity)}
                  >
                    <Text style={styles.calcActionBtnText}>Get Formal Valuation Report →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Six Service Summaries */}
      <View style={styles.sectionContainer}>
        <View style={styles.innerSection}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>FULL-SERVICE LIFECYCLE</Text>
            <Text style={styles.sectionTitle}>Everything Your Rental Property Needs</Text>
            <Text style={styles.sectionSubtitle}>
              From initial readiness review and professional photography to tenant screening, rent collection, and maintenance escalation.
            </Text>
          </View>

          <View
            style={[
              styles.cardsGrid,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            {serviceSummaries.map((svc, index) => {
              const Icon = svc.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.serviceSummaryCard,
                    { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                  ]}
                  onPress={() => router.push(svc.link as never)}
                  activeOpacity={0.85}
                >
                  <View style={styles.svcIconBox}>
                    <Icon size={22} color="#2563EB" />
                  </View>
                  <Text style={styles.svcTitle}>{svc.title}</Text>
                  <Text style={styles.svcDesc}>{svc.desc}</Text>
                  <View style={styles.svcLearnMore}>
                    <Text style={styles.svcLearnMoreText}>Explore Service</Text>
                    <ChevronRight size={15} color="#2563EB" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.lifecycleCtaBox}>
            <Text style={styles.lifecycleCtaText}>
              Want to review our full 7-stage property management lifecycle with owner approval gates?
            </Text>
            <TouchableOpacity
              style={styles.lifecycleCtaBtn}
              onPress={() => router.push("/services" as never)}
            >
              <Text style={styles.lifecycleCtaBtnText}>View Documented Workflow →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. KeyNest Advantages */}
      <View style={styles.altSectionContainer}>
        <View style={styles.innerSection}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>THE KEYNEST DIFFERENCE</Text>
            <Text style={styles.sectionTitle}>Built on Process Discipline, Not Empty Promises</Text>
            <Text style={styles.sectionSubtitle}>
              We do not make unsupported hype claims. Instead, we deliver rigorous operational execution, fair pricing, and responsive owner communication.
            </Text>
          </View>

          <View style={styles.advantagesList}>
            {advantages.map((adv, index) => (
              <View key={index} style={styles.advantageRow}>
                <View style={styles.advantageNumberBox}>
                  <Text style={styles.advantageNumberText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.advantageTitle}>{adv.title}</Text>
                  <Text style={styles.advantageDesc}>{adv.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.governanceQuoteBox}>
            <ShieldCheck size={26} color="#2563EB" />
            <View style={{ flex: 1 }}>
              <Text style={styles.governanceQuoteTitle}>Brokerage Oversight Guarantee</Text>
              <Text style={styles.governanceQuoteText}>
                {"\""}KeyNest Realty operates under the direct brokerage supervision of Fair Deal Realty Inc. All management agreements, trust accounts, advertising, and regulated property-management activities are reviewed by licensed Texas real estate professionals.{"\""}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 4. Service Area Preview */}
      <View style={styles.sectionContainer}>
        <View style={styles.innerSection}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>LOCAL NORTH TEXAS EXPERTISE</Text>
            <Text style={styles.sectionTitle}>Where We Actively Manage Homes</Text>
            <Text style={styles.sectionSubtitle}>
              Targeted North Texas territory centered around our headquarters in The Colony.
            </Text>
          </View>

          <View
            style={[
              styles.cityGrid,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            {SERVICE_CITIES.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={[
                  styles.cityCard,
                  { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                ]}
                onPress={() => router.push(`/contact` as never)}
                activeOpacity={0.85}
              >
                <View style={styles.cityCardTop}>
                  <View style={styles.cityPinBadge}>
                    <MapPin size={16} color="#2563EB" />
                  </View>
                  <Text style={styles.cityName}>{city.name}</Text>
                </View>
                <Text style={styles.cityTagline}>{city.tagline}</Text>
                <View style={styles.cityStatsRow}>
                  <Text style={styles.cityStatItem}>
                    Median Rent: <Text style={{ fontWeight: "700", color: "#0F172A" }}>{city.medianRent}</Text>
                  </Text>
                  <Text style={styles.cityStatItem}>
                    Avg Days: <Text style={{ fontWeight: "700", color: "#0F172A" }}>{city.avgDaysOnMarket}</Text>
                  </Text>
                </View>
                <Text style={styles.cityContextSnippet} numberOfLines={2}>
                  {city.ownerContext}
                </Text>
                <View style={styles.cityCardAction}>
                  <Text style={styles.cityActionText}>View Local Market Details →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.viewAllCitiesRow}>
            <TouchableOpacity
              style={styles.viewAllCitiesBtn}
              onPress={() => router.push("/contact" as never)}
            >
              <Text style={styles.viewAllCitiesBtnText}>Explore All 7 Service Territory Profiles</Text>
              <ArrowRight size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 5. Featured Rentals Preview */}
      <View style={styles.altSectionContainer}>
        <View style={styles.innerSection}>
          <View style={styles.sectionHeaderSplit}>
            <View>
              <Text style={styles.sectionOverline}>CURRENT AVAILABILITY</Text>
              <Text style={styles.sectionTitle}>Featured Rental Properties</Text>
              <Text style={styles.sectionSubtitle}>
                Well-maintained single-family and townhome rentals in premier North Texas communities.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.browseAllRentalsBtn}
              onPress={() => router.push("/rentals" as never)}
            >
              <Text style={styles.browseAllRentalsText}>View All Rentals ({FEATURED_RENTALS.length})</Text>
              <ArrowRight size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.rentalsGrid,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            {FEATURED_RENTALS.slice(0, 3).map((item) => (
              <View
                key={item.id}
                style={[
                  styles.rentalCard,
                  { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" },
                ]}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.rentalImage} />
                <View style={styles.rentalPriceTag}>
                  <Text style={styles.rentalPriceText}>${item.price.toLocaleString()}/mo</Text>
                </View>
                <View style={styles.rentalCardBody}>
                  <Text style={styles.rentalCityTag}>{item.city}, TX</Text>
                  <Text style={styles.rentalTitle}>{item.title}</Text>
                  <Text style={styles.rentalAddress}>{item.address}</Text>

                  <View style={styles.rentalSpecsRow}>
                    <Text style={styles.rentalSpec}>{item.beds} Beds</Text>
                    <Text style={styles.specDot}>•</Text>
                    <Text style={styles.rentalSpec}>{item.baths} Baths</Text>
                    <Text style={styles.specDot}>•</Text>
                    <Text style={styles.rentalSpec}>{item.sqft.toLocaleString()} Sq Ft</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.viewRentalBtn}
                    onPress={() => router.push("/rentals" as never)}
                  >
                    <Text style={styles.viewRentalBtnText}>View Details & Criteria</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 6. Transparent Fee Callout */}
      <View style={styles.pricingBanner}>
        <View style={styles.innerSection}>
          <View style={[styles.pricingBannerRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pricingBannerOverline}>TRANSPARENT FEE STRUCTURE</Text>
              <Text style={styles.pricingBannerTitle}>No Hidden Fees. Aligned Incentives.</Text>
              <Text style={styles.pricingBannerSubtitle}>
                Choose between Full-Service Percentage Management (8.9%), Flat Monthly Fee ($129/mo), or Placement-Only Leasing (85%). Zero management fee during vacancy.
              </Text>
            </View>
            <View style={styles.pricingBannerButtons}>
              <TouchableOpacity
                style={styles.pricingPrimaryBtn}
                onPress={() => router.push("/pricing" as never)}
              >
                <Text style={styles.pricingPrimaryBtnText}>Compare Pricing & Calculate ROI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.pricingSecondaryBtn}
                onPress={openConsultation}
              >
                <Text style={styles.pricingSecondaryBtnText}>Speak with Dinesh or Purvang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 7. Interactive FAQ Accordion */}
      <View style={styles.sectionContainer}>
        <View style={styles.innerSection}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>COMMON QUESTIONS</Text>
            <Text style={styles.sectionTitle}>Frequently Asked by North Texas Owners</Text>
            <Text style={styles.sectionSubtitle}>
              Clear, straightforward answers about our policies, fee structures, and broker oversight.
            </Text>
          </View>

          <View style={styles.faqList}>
            {faqs.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <View key={index} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => setExpandedFaq(isExpanded ? null : index)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    {isExpanded ? (
                      <ChevronUp size={20} color="#2563EB" />
                    ) : (
                      <ChevronDown size={20} color="#64748B" />
                    )}
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.faqBody}>
                      <Text style={styles.faqAnswer}>{faq.a}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    backgroundColor: "#0B1120",
    paddingVertical: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  heroContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
  },
  heroRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 40,
  },
  heroTextCol: {
    gap: 20,
  },
  badgePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1E293B",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  badgePillText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
  heroHeadline: {
    fontSize: 44,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 52,
    letterSpacing: -1.2,
  },
  heroHeadlineHighlight: {
    color: "#60A5FA",
  },
  heroSubhead: {
    fontSize: 17,
    color: "#94A3B8",
    lineHeight: 26,
  },
  heroCtaGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 4,
  },
  primaryHeroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryHeroBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryHeroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  secondaryHeroBtnText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "700",
  },
  tertiaryHeroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "transparent",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  tertiaryHeroBtnText: {
    color: "#CBD5E1",
    fontSize: 14.5,
    fontWeight: "600",
  },
  trustBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 8,
  },
  trustBadgeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustBadgeText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "500",
  },
  heroCardCol: {
    alignItems: "center",
  },
  calculatorCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  calcHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  calcIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  calcCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  calcCardSub: {
    fontSize: 12,
    color: "#64748B",
  },
  calcFieldGroup: {
    gap: 6,
  },
  calcFieldLabel: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#334155",
  },
  calcChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  calcChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  calcChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  calcChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  calcChipTextActive: {
    color: "#FFFFFF",
  },
  calcFieldRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
  },
  calcInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  calcResultsBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  calcResultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calcResultLabel: {
    fontSize: 13,
    color: "#64748B",
  },
  calcResultValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  calcResultFee: {
    fontSize: 13,
    fontWeight: "700",
    color: "#EF4444",
  },
  calcDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  calcNetLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  calcNetValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2563EB",
  },
  calcAnnualNote: {
    fontSize: 11.5,
    color: "#64748B",
    marginTop: 2,
  },
  calcActionRow: {
    marginTop: 4,
  },
  calcActionBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  calcActionBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 80,
  },
  altSectionContainer: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 80,
  },
  innerSection: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 20,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    marginBottom: 48,
    textAlign: "center",
  },
  sectionHeaderSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 40,
    flexWrap: "wrap",
    gap: 16,
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
  cardsGrid: {
    gap: 24,
    justifyContent: "space-between",
  },
  serviceSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    gap: 12,
  },
  svcIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  svcTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  svcDesc: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
    flex: 1,
  },
  svcLearnMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  svcLearnMoreText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  lifecycleCtaBox: {
    marginTop: 40,
    backgroundColor: "#EFF6FF",
    padding: 24,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  lifecycleCtaText: {
    fontSize: 15,
    color: "#1E40AF",
    fontWeight: "600",
    flex: 1,
  },
  lifecycleCtaBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  lifecycleCtaBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  advantagesList: {
    gap: 16,
    marginBottom: 36,
  },
  advantageRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  advantageNumberBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  advantageNumberText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2563EB",
  },
  advantageTitle: {
    fontSize: 16.5,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  advantageDesc: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  governanceQuoteBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  governanceQuoteTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  governanceQuoteText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
    fontStyle: "italic",
  },
  cityGrid: {
    gap: 20,
    justifyContent: "space-between",
  },
  cityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  cityCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cityPinBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  cityTagline: {
    fontSize: 12.5,
    color: "#64748B",
  },
  cityStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  cityStatItem: {
    fontSize: 12,
    color: "#64748B",
  },
  cityContextSnippet: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
  cityCardAction: {
    marginTop: 4,
  },
  cityActionText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#2563EB",
  },
  viewAllCitiesRow: {
    marginTop: 36,
    alignItems: "center",
  },
  viewAllCitiesBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  viewAllCitiesBtnText: {
    color: "#1E40AF",
    fontSize: 14,
    fontWeight: "700",
  },
  browseAllRentalsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  browseAllRentalsText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  rentalsGrid: {
    gap: 24,
    justifyContent: "space-between",
  },
  rentalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rentalImage: {
    width: "100%",
    height: 190,
    resizeMode: "cover",
  },
  rentalPriceTag: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#0F172A",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  rentalPriceText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  rentalCardBody: {
    padding: 20,
    gap: 6,
  },
  rentalCityTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 0.8,
  },
  rentalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  rentalAddress: {
    fontSize: 13,
    color: "#64748B",
  },
  rentalSpecsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 6,
  },
  rentalSpec: {
    fontSize: 12.5,
    color: "#475569",
    fontWeight: "500",
  },
  specDot: {
    color: "#CBD5E1",
  },
  viewRentalBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
  },
  viewRentalBtnText: {
    color: "#0F172A",
    fontSize: 13,
    fontWeight: "700",
  },
  pricingBanner: {
    backgroundColor: "#0B1120",
    paddingVertical: 56,
  },
  pricingBannerRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 32,
  },
  pricingBannerOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#60A5FA",
    letterSpacing: 1,
    marginBottom: 6,
  },
  pricingBannerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  pricingBannerSubtitle: {
    fontSize: 15,
    color: "#94A3B8",
    lineHeight: 23,
    maxWidth: 640,
  },
  pricingBannerButtons: {
    gap: 12,
  },
  pricingPrimaryBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 8,
    alignItems: "center",
  },
  pricingPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  pricingSecondaryBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#334155",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  pricingSecondaryBtnText: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
  },
  faqList: {
    maxWidth: 840,
    width: "100%",
    marginHorizontal: "auto",
    gap: 12,
  },
  faqItem: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 12,
  },
  faqBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 4,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
});
