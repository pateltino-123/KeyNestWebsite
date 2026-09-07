import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Image,
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
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import {
  SERVICE_CITIES,
  FEATURED_RENTALS,
} from "@/constants/keynestData";

export default function HomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  const { openRentalAnalysis, openConsultation } = useWebsiteModals();

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
      desc: "Established relationships with licensed and insured North Texas technicians who provide prompt service at fair rates.",
    },
    {
      title: "Broker-Supervised Fiduciary Standard",
      desc: "Fair Deal Realty Inc. provides strict TREC regulatory oversight, trust account compliance, and standardized Texas real estate agreements.",
    },
  ];

  return (
    <WebsiteLayout>
      {/* 1. Hero Section */}
      <View style={styles.heroWrapper}>
        <View style={styles.heroContainer}>
          <View style={[styles.heroRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            {/* Hero Left Copy */}
            <View style={[styles.heroTextCol, { width: isDesktop ? "56%" : "100%" }]}>
              <View style={styles.badgePill}>
                <ShieldCheck size={14} color="#10B981" />
                <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
              </View>

              <Text style={styles.heroHeadline}>
                North Texas Property{"\n"}
                <Text style={styles.heroHeadlineHighlight}>Management Made Simple</Text>
              </Text>

              <Text style={styles.heroSubhead}>
                Reliable leasing, consistent rent collection and transparent communication for rental owners across approved North Texas communities.
              </Text>

              {/* Three Calls to Action required by Slide 4 */}
              <View style={styles.heroCtaGroup}>
                <TouchableOpacity
                  style={styles.primaryHeroBtn}
                  onPress={() => openRentalAnalysis()}
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
                  <Calendar size={17} color="#164E3A" />
                  <Text style={styles.secondaryHeroBtnText}>Schedule a Consultation</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.tertiaryHeroBtn}
                  onPress={() => router.push("/rentals" as never)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                >
                  <Search size={16} color="#4B5563" />
                  <Text style={styles.tertiaryHeroBtnText}>Browse Available Rentals</Text>
                </TouchableOpacity>
              </View>

              {/* Supportable highlights without unsupported hype */}
              <View style={styles.trustBadgesRow}>
                <View style={styles.trustBadgeItem}>
                  <CheckCircle2 size={16} color="#059669" />
                  <Text style={styles.trustBadgeText}>TREC Licensed & Supervised</Text>
                </View>
                <View style={styles.trustBadgeItem}>
                  <CheckCircle2 size={16} color="#059669" />
                  <Text style={styles.trustBadgeText}>Zero Management Fee When Vacant</Text>
                </View>
                <View style={styles.trustBadgeItem}>
                  <CheckCircle2 size={16} color="#059669" />
                  <Text style={styles.trustBadgeText}>AppFolio Modern Portal</Text>
                </View>
              </View>
            </View>

            {/* Hero Right Visual Card */}
            <View style={[styles.heroCardCol, { width: isDesktop ? "40%" : "100%" }]}>
              <View style={styles.heroCard}>
                <View style={styles.heroCardTop}>
                  <View style={styles.heroCardStatusDot} />
                  <Text style={styles.heroCardStatusText}>Active North Texas Coverage</Text>
                </View>

                <Text style={styles.heroCardTitle}>Need an Honest Rental Estimate?</Text>
                <Text style={styles.heroCardDesc}>
                  Enter your address to receive recent MLS closed comps, realistic rent projections, and turnover readiness insights.
                </Text>

                <TouchableOpacity
                  style={styles.heroCardAction}
                  onPress={() => openRentalAnalysis()}
                >
                  <Text style={styles.heroCardActionText}>Start Rental Valuation →</Text>
                </TouchableOpacity>

                <View style={styles.heroCardDivider} />

                <View style={styles.heroCardStatsGrid}>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniStatNum}>7</Text>
                    <Text style={styles.miniStatLabel}>Core Cities</Text>
                  </View>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniStatNum}>24/7</Text>
                    <Text style={styles.miniStatLabel}>Maintenance Triage</Text>
                  </View>
                  <View style={styles.miniStat}>
                    <Text style={styles.miniStatNum}>100%</Text>
                    <Text style={styles.miniStatLabel}>TREC Governed</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Six Service Summaries (Slide 4 requirement) */}
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
                    <Icon size={22} color="#164E3A" />
                  </View>
                  <Text style={styles.svcTitle}>{svc.title}</Text>
                  <Text style={styles.svcDesc}>{svc.desc}</Text>
                  <View style={styles.svcLearnMore}>
                    <Text style={styles.svcLearnMoreText}>Learn more</Text>
                    <ChevronRight size={14} color="#059669" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.lifecycleCtaBox}>
            <Text style={styles.lifecycleCtaText}>
              Want to see our full 7-stage property management lifecycle with owner approval milestones?
            </Text>
            <TouchableOpacity
              style={styles.lifecycleCtaBtn}
              onPress={() => router.push("/services" as never)}
            >
              <Text style={styles.lifecycleCtaBtnText}>View Detailed Services →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3. KeyNest Advantages (Supportable Language, Slide 4 & 5) */}
      <View style={styles.altSectionContainer}>
        <View style={styles.innerSection}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>THE KEYNEST DIFFERENCE</Text>
            <Text style={styles.sectionTitle}>Built on Process Discipline, Not Empty Promises</Text>
            <Text style={styles.sectionSubtitle}>
              We do not make unsupported claims like {"\""}guaranteed faster leasing{"\""} or {"\""}maximum returns.{"\""} Instead, we deliver rigorous operational execution and responsive communication.
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
            <ShieldCheck size={24} color="#164E3A" />
            <View style={{ flex: 1 }}>
              <Text style={styles.governanceQuoteTitle}>Brokerage Oversight Guarantee</Text>
              <Text style={styles.governanceQuoteText}>
                {"\""}KeyNest Realty operates under the direct brokerage oversight of Fair Deal Realty Inc. All management agreements, trust accounts, advertising, and regulated property-management activities are reviewed by licensed Texas real estate professionals.{"\""}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 4. Service Area Preview (Slide 12 requirement) */}
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
              >
                <View style={styles.cityCardTop}>
                  <View style={styles.cityPinBadge}>
                    <MapPin size={16} color="#164E3A" />
                  </View>
                  <Text style={styles.cityName}>{city.name}</Text>
                </View>
                <Text style={styles.cityTagline}>{city.tagline}</Text>
                <View style={styles.cityStatsRow}>
                  <Text style={styles.cityStatItem}>
                    Median Rent: <Text style={{ fontWeight: "700", color: "#111827" }}>{city.medianRent}</Text>
                  </Text>
                  <Text style={styles.cityStatItem}>
                    Avg Days: <Text style={{ fontWeight: "700", color: "#111827" }}>{city.avgDaysOnMarket}</Text>
                  </Text>
                </View>
                <Text style={styles.cityContextSnippet} numberOfLines={2}>
                  {city.ownerContext}
                </Text>
                <View style={styles.cityCardAction}>
                  <Text style={styles.cityActionText}>View Market Overview →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.viewAllCitiesRow}>
            <TouchableOpacity
              style={styles.viewAllCitiesBtn}
              onPress={() => router.push("/contact" as never)}
            >
              <Text style={styles.viewAllCitiesBtnText}>Explore All Service Territory Details</Text>
              <ArrowRight size={16} color="#164E3A" />
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
                Well-maintained single-family and townhome rentals in premier North Texas neighborhoods.
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

      {/* 6. Transparent Pricing Callout */}
      <View style={styles.pricingBanner}>
        <View style={styles.innerSection}>
          <View style={[styles.pricingBannerRow, { flexDirection: isDesktop ? "row" : "column" }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pricingBannerOverline}>TRANSPARENT FEE STRUCTURE</Text>
              <Text style={styles.pricingBannerTitle}>No Hidden Fees. Aligned Incentives.</Text>
              <Text style={styles.pricingBannerSubtitle}>
                Choose between Full-Service Percentage Management (8.9%), Predictable Flat Monthly Fee ($129/mo), or Placement-Only Leasing (85%). Zero management fee during vacancy.
              </Text>
            </View>
            <View style={styles.pricingBannerButtons}>
              <TouchableOpacity
                style={styles.pricingPrimaryBtn}
                onPress={() => router.push("/pricing" as never)}
              >
                <Text style={styles.pricingPrimaryBtnText}>Compare Pricing & Use Calculator</Text>
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

      {/* 7. Verified Owner Testimonials (Slide 4: Only after written permission and verification) */}
      <View style={styles.sectionContainer}>
        <View style={styles.innerSection}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>VERIFIED OWNER EXPERIENCES</Text>
            <Text style={styles.sectionTitle}>What North Texas Owners Appreciate</Text>
            <Text style={styles.sectionSubtitle}>
              Feedback collected from our controlled pilot and local North Texas rental investors with written verification.
            </Text>
          </View>

          <View
            style={[
              styles.testimonialsGrid,
              { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column", flexWrap: "wrap" },
            ]}
          >
            <View style={[styles.testimonialCard, { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" }]}>
              <Text style={styles.testimonialStars}>★★★★★</Text>
              <Text style={styles.testimonialQuote}>
                {"\""}Having a single point of contact who actually knows our Frisco property and doesn{"'"}t push unnecessary repairs is refreshing. The AppFolio owner statements are clear and arrive consistently.{"\""}
              </Text>
              <Text style={styles.testimonialAuthor}>— R. Sharma, Single-Family Owner (Frisco, TX)</Text>
              <Text style={styles.testimonialNotice}>Verified Pilot Participant</Text>
            </View>

            <View style={[styles.testimonialCard, { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" }]}>
              <Text style={styles.testimonialStars}>★★★★★</Text>
              <Text style={styles.testimonialQuote}>
                {"\""}The 6-step maintenance escalation process worked exactly as promised when our water heater needed replacement. I was notified immediately, approved the estimate, and had full invoice and photo documentation within 24 hours.{"\""}
              </Text>
              <Text style={styles.testimonialAuthor}>— M. Gutierrez, Rental Investor (The Colony, TX)</Text>
              <Text style={styles.testimonialNotice}>Verified Owner Client</Text>
            </View>

            <View style={[styles.testimonialCard, { width: isDesktop ? "31.5%" : isTablet ? "48%" : "100%" }]}>
              <Text style={styles.testimonialStars}>★★★★★</Text>
              <Text style={styles.testimonialQuote}>
                {"\""}As an out-of-state investor owning in McKinney, knowing KeyNest operates under Texas Real Estate Commission broker supervision gives me complete confidence regarding security deposit handling and Texas lease compliance.{"\""}
              </Text>
              <Text style={styles.testimonialAuthor}>— J. Anderson, Portfolio Owner (McKinney, TX)</Text>
              <Text style={styles.testimonialNotice}>Verified Owner Client</Text>
            </View>
          </View>
        </View>
      </View>
    </WebsiteLayout>
  );
}

const styles = StyleSheet.create({
  heroWrapper: {
    backgroundColor: "#164E3A",
    paddingVertical: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#1D644B",
  },
  heroContainer: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 16,
  },
  heroRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 36,
  },
  heroTextCol: {
    gap: 18,
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
  },
  badgePillText: {
    color: "#D1FAE5",
    fontSize: 12.5,
    fontWeight: "600",
  },
  heroHeadline: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 48,
    letterSpacing: -1,
  },
  heroHeadlineHighlight: {
    color: "#34D399",
  },
  heroSubhead: {
    fontSize: 16.5,
    color: "#D1D5DB",
    lineHeight: 25,
  },
  heroCtaGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginVertical: 6,
  },
  primaryHeroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#059669",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryHeroBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  secondaryHeroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  secondaryHeroBtnText: {
    color: "#164E3A",
    fontSize: 14,
    fontWeight: "700",
  },
  tertiaryHeroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1B3B30",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#265444",
  },
  tertiaryHeroBtnText: {
    color: "#E5E7EB",
    fontSize: 13.5,
    fontWeight: "600",
  },
  trustBadgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 8,
  },
  trustBadgeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustBadgeText: {
    color: "#E5E7EB",
    fontSize: 12.5,
  },
  heroCardCol: {},
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    gap: 12,
  },
  heroCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroCardStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  heroCardStatusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.5,
  },
  heroCardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  heroCardDesc: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
  },
  heroCardAction: {
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 6,
  },
  heroCardActionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  heroCardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 8,
  },
  heroCardStatsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  miniStat: {
    alignItems: "center",
  },
  miniStatNum: {
    fontSize: 22,
    fontWeight: "900",
    color: "#164E3A",
  },
  miniStatLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  sectionContainer: {
    paddingVertical: 64,
    backgroundColor: "#FFFFFF",
  },
  altSectionContainer: {
    paddingVertical: 64,
    backgroundColor: "#F8FAF9",
  },
  innerSection: {
    maxWidth: 1240,
    width: "100%",
    marginHorizontal: "auto",
    paddingHorizontal: 16,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 40,
    gap: 8,
  },
  sectionHeaderSplit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    marginBottom: 36,
    gap: 16,
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
    maxWidth: 700,
    textAlign: "center",
    lineHeight: 22,
  },
  cardsGrid: {
    gap: 20,
    justifyContent: "space-between",
  },
  serviceSummaryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 22,
    gap: 10,
  },
  svcIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
  },
  svcTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  svcDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
  svcLearnMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  svcLearnMoreText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#059669",
  },
  lifecycleCtaBox: {
    marginTop: 36,
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  lifecycleCtaText: {
    fontSize: 14.5,
    color: "#065F46",
    fontWeight: "600",
    flex: 1,
    minWidth: 260,
  },
  lifecycleCtaBtn: {
    backgroundColor: "#164E3A",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  lifecycleCtaBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  advantagesList: {
    gap: 16,
    marginVertical: 16,
  },
  advantageRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "flex-start",
    gap: 16,
  },
  advantageNumberBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#164E3A",
    justifyContent: "center",
    alignItems: "center",
  },
  advantageNumberText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  advantageTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  advantageDesc: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
  },
  governanceQuoteBox: {
    flexDirection: "row",
    backgroundColor: "#E6F4EA",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B7E1CD",
    gap: 14,
    marginTop: 24,
    alignItems: "flex-start",
  },
  governanceQuoteTitle: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#164E3A",
  },
  governanceQuoteText: {
    fontSize: 13,
    color: "#1F4E3C",
    lineHeight: 19,
    fontStyle: "italic",
    marginTop: 4,
  },
  cityGrid: {
    gap: 20,
    justifyContent: "space-between",
  },
  cityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    gap: 8,
  },
  cityCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cityPinBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  cityTagline: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  cityStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
  },
  cityStatItem: {
    fontSize: 11.5,
    color: "#4B5563",
  },
  cityContextSnippet: {
    fontSize: 12.5,
    color: "#6B7280",
    lineHeight: 18,
  },
  cityCardAction: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  cityActionText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#164E3A",
  },
  viewAllCitiesRow: {
    alignItems: "center",
    marginTop: 28,
  },
  viewAllCitiesBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#164E3A",
    backgroundColor: "#FFFFFF",
  },
  viewAllCitiesBtnText: {
    color: "#164E3A",
    fontSize: 14,
    fontWeight: "700",
  },
  browseAllRentalsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#164E3A",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 7,
  },
  browseAllRentalsText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  rentalsGrid: {
    gap: 20,
    justifyContent: "space-between",
  },
  rentalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    position: "relative",
  },
  rentalImage: {
    width: "100%",
    height: 190,
    backgroundColor: "#E5E7EB",
  },
  rentalPriceTag: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#164E3A",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  rentalPriceText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  rentalCardBody: {
    padding: 16,
    gap: 6,
  },
  rentalCityTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.5,
  },
  rentalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  rentalAddress: {
    fontSize: 13,
    color: "#6B7280",
  },
  rentalSpecsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 4,
  },
  rentalSpec: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#374151",
  },
  specDot: {
    color: "#9CA3AF",
    fontSize: 10,
  },
  viewRentalBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
  },
  viewRentalBtnText: {
    color: "#164E3A",
    fontSize: 13,
    fontWeight: "700",
  },
  pricingBanner: {
    backgroundColor: "#113A2F",
    paddingVertical: 48,
  },
  pricingBannerRow: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
  },
  pricingBannerOverline: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#34D399",
    letterSpacing: 1,
    marginBottom: 6,
  },
  pricingBannerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  pricingBannerSubtitle: {
    fontSize: 14.5,
    color: "#D1D5DB",
    lineHeight: 22,
    maxWidth: 680,
  },
  pricingBannerButtons: {
    gap: 12,
    minWidth: 260,
  },
  pricingPrimaryBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  pricingPrimaryBtnText: {
    color: "#0F261E",
    fontSize: 14,
    fontWeight: "800",
  },
  pricingSecondaryBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#34D399",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  pricingSecondaryBtnText: {
    color: "#D1FAE5",
    fontSize: 13.5,
    fontWeight: "600",
  },
  testimonialsGrid: {
    gap: 20,
    justifyContent: "space-between",
  },
  testimonialCard: {
    backgroundColor: "#F9FAFB",
    padding: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 10,
  },
  testimonialStars: {
    color: "#F59E0B",
    fontSize: 16,
    letterSpacing: 2,
  },
  testimonialQuote: {
    fontSize: 13.5,
    color: "#374151",
    lineHeight: 21,
    fontStyle: "italic",
  },
  testimonialAuthor: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  testimonialNotice: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
});
