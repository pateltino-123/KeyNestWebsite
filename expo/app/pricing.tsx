import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import {
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import {
  PRICING_PLANS,
  ADD_ON_FEES,
} from "@/constants/keynestData";

export default function PricingPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { openRentalAnalysis, openConsultation } = useWebsiteModals();

  // Interactive Fee Calculator State
  const [calcMonthlyRent, setCalcMonthlyRent] = useState("2600");
  const [expandedAddon, setExpandedAddon] = useState<number | null>(null);

  const rentNumber = parseFloat(calcMonthlyRent) || 2600;

  // Percentage Plan Cost (8.9%)
  const percentageCost = Math.round(rentNumber * 0.089);
  const percentageNet = Math.round(rentNumber - percentageCost);

  // Flat Fee Cost ($129)
  const flatFeeCost = 129;
  const flatFeeNet = Math.round(rentNumber - flatFeeCost);

  // Leasing Only (85% one-time placement, amortized over 12 months for comparison)
  const placementFee = Math.round(rentNumber * 0.85);

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#3B6E99" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Simple, Transparent Pricing</Text>
          <Text style={styles.pageSubtitle}>
            No hidden markups. No setup penalties. Aligned incentives where you pay zero management fee when your property is vacant.
          </Text>
        </View>
      </View>

      {/* 1. The Three Core Plans */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>SELECT YOUR SERVICE MODEL</Text>
            <Text style={styles.sectionTitle}>Choose the Plan That Fits Your Goals</Text>
            <Text style={styles.sectionSubtitle}>
              Whether you want full-service operational peace of mind or professional tenant placement for self-management, our pricing is transparent and aligned.
            </Text>
          </View>

          <View
            style={[
              styles.plansGrid,
              { flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "stretch" : "center" },
            ]}
          >
            {PRICING_PLANS.map((plan) => (
              <View
                key={plan.id}
                style={[
                  styles.planCard,
                  plan.highlighted && styles.planCardHighlighted,
                  { width: isDesktop ? "31.5%" : "100%", maxWidth: isDesktop ? undefined : 480 },
                ]}
              >
                {plan.badge && (
                  <View style={styles.planBadgeWrap}>
                    <Text style={styles.planBadgeText}>{plan.badge.toUpperCase()}</Text>
                  </View>
                )}

                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planRate}>{plan.rateDescription}</Text>
                <Text style={styles.planVacancy}>{plan.vacancyCharge}</Text>

                <View style={styles.planDivider} />

                <Text style={styles.planSummary}>{plan.summary}</Text>

                <View style={styles.planFeaturesList}>
                  {plan.features.map((feat, idx) => (
                    <View key={idx} style={styles.planFeatureRow}>
                      <CheckCircle2 size={16} color="#3B6E99" style={{ marginTop: 2 }} />
                      <Text style={styles.planFeatureText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.planCtaBtn,
                    plan.highlighted && styles.planCtaBtnHighlighted,
                  ]}
                  onPress={openConsultation}
                >
                  <Text
                    style={[
                      styles.planCtaBtnText,
                      plan.highlighted && styles.planCtaBtnTextHighlighted,
                    ]}
                  >
                    Select {plan.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 2. Interactive ROI & Fee Comparison Tool */}
      <View style={styles.sectionAlt}>
        <View style={styles.innerContainer}>
          <View style={styles.calculatorWrapper}>
            <View style={styles.calcTitleRow}>
              <View style={styles.calcIconBadge}>
                <DollarSign size={20} color="#3B6E99" />
              </View>
              <View>
                <Text style={styles.calcHeading}>Interactive Fee Comparison Tool</Text>
                <Text style={styles.calcSub}>
                  Adjust the monthly rent to compare exact fees and your projected net disbursement
                </Text>
              </View>
            </View>

            <View style={styles.calcInputRow}>
              <Text style={styles.calcInputLabel}>Monthly Rental Rate:</Text>
              <View style={styles.inputWithPrefix}>
                <Text style={styles.currencyPrefix}>$</Text>
                <TextInput
                  style={styles.calcInputField}
                  value={calcMonthlyRent}
                  onChangeText={setCalcMonthlyRent}
                  keyboardType="numeric"
                  placeholder="2600"
                  placeholderTextColor="#94A3B8"
                />
                <Text style={styles.currencySuffix}>/mo</Text>
              </View>
              <View style={styles.quickRentPills}>
                {["2200", "2600", "3000", "3500"].map((rent) => (
                  <TouchableOpacity
                    key={rent}
                    style={[styles.quickRentBtn, calcMonthlyRent === rent && styles.quickRentBtnActive]}
                    onPress={() => setCalcMonthlyRent(rent)}
                  >
                    <Text style={[styles.quickRentText, calcMonthlyRent === rent && styles.quickRentTextActive]}>
                      ${rent}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comparison Cards Grid */}
            <View
              style={[
                styles.comparisonGrid,
                { flexDirection: isDesktop ? "row" : "column" },
              ]}
            >
              {/* Card 1: Percentage */}
              <View style={[styles.compareCard, styles.compareCardHighlighted]}>
                <View style={styles.compareBadge}>
                  <Text style={styles.compareBadgeText}>RECOMMENDED</Text>
                </View>
                <Text style={styles.compareTitle}>Full-Service Percentage</Text>
                <Text style={styles.compareRateText}>8.9% of collected rent</Text>
                <View style={styles.compareDivider} />
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>Monthly Fee:</Text>
                  <Text style={styles.compareMetricVal}>${percentageCost}/mo</Text>
                </View>
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>Net to Owner:</Text>
                  <Text style={styles.compareNetVal}>${percentageNet}/mo</Text>
                </View>
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>Annual Net:</Text>
                  <Text style={styles.compareAnnualVal}>${(percentageNet * 12).toLocaleString()}/yr</Text>
                </View>
                <Text style={styles.compareNote}>✓ $0 during vacancy • Includes all 7 lifecycle stages</Text>
              </View>

              {/* Card 2: Flat Fee */}
              <View style={styles.compareCard}>
                <Text style={styles.compareTitle}>Predictable Flat Fee</Text>
                <Text style={styles.compareRateText}>$129/mo fixed</Text>
                <View style={styles.compareDivider} />
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>Monthly Fee:</Text>
                  <Text style={styles.compareMetricVal}>${flatFeeCost}/mo</Text>
                </View>
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>Net to Owner:</Text>
                  <Text style={styles.compareNetVal}>${flatFeeNet}/mo</Text>
                </View>
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>Annual Net:</Text>
                  <Text style={styles.compareAnnualVal}>${(flatFeeNet * 12).toLocaleString()}/yr</Text>
                </View>
                <Text style={styles.compareNote}>✓ Best for rents &gt;$2,800/mo seeking cost certainty</Text>
              </View>

              {/* Card 3: Placement Only */}
              <View style={styles.compareCard}>
                <Text style={styles.compareTitle}>Leasing & Placement</Text>
                <Text style={styles.compareRateText}>85% of 1st Month (One-Time)</Text>
                <View style={styles.compareDivider} />
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>One-Time Placement:</Text>
                  <Text style={styles.compareMetricVal}>${placementFee}</Text>
                </View>
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>Ongoing Monthly:</Text>
                  <Text style={styles.compareNetVal}>$0/mo</Text>
                </View>
                <View style={styles.compareMetricRow}>
                  <Text style={styles.compareMetricLabel}>Annual Gross Net:</Text>
                  <Text style={styles.compareAnnualVal}>${((rentNumber * 12) - placementFee).toLocaleString()}/yr</Text>
                </View>
                <Text style={styles.compareNote}>✓ You handle ongoing tenant calls and maintenance</Text>
              </View>
            </View>

            <View style={styles.calcActionRow}>
              <TouchableOpacity style={styles.calcCtaBtn} onPress={() => openRentalAnalysis()}>
                <Text style={styles.calcCtaBtnText}>Request Complete Rental Analysis for Your Address</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Published Add-On Fee Schedule */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>FULL TRANSPARENCY</Text>
            <Text style={styles.sectionTitle}>Published Add-On Fee Schedule</Text>
            <Text style={styles.sectionSubtitle}>
              Every fee is disclosed upfront. No hidden onboarding setup costs, no vendor invoice markups.
            </Text>
          </View>

          <View style={styles.addonsList}>
            {ADD_ON_FEES.map((fee, idx) => {
              const isExpanded = expandedAddon === idx;
              return (
                <View key={idx} style={styles.addonItem}>
                  <TouchableOpacity
                    style={styles.addonHeader}
                    onPress={() => setExpandedAddon(isExpanded ? null : idx)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.addonName}>{fee.service}</Text>
                      <Text style={styles.addonCost}>{fee.fee}</Text>
                    </View>
                    {isExpanded ? (
                      <ChevronUp size={20} color="#3B6E99" />
                    ) : (
                      <ChevronDown size={20} color="#737B85" />
                    )}
                  </TouchableOpacity>
                  {isExpanded && (
                    <View style={styles.addonBody}>
                      <Text style={styles.addonDesc}>{fee.description}</Text>
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
    backgroundColor: "#EBF2F7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C8D9E8",
    marginBottom: 16,
  },
  badgePillText: {
    color: "#2E567A",
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
  sectionAlt: {
    backgroundColor: "#F7F3EB",
    paddingVertical: 72,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    marginBottom: 48,
    textAlign: "center",
  },
  sectionOverline: {
    fontSize: 12,
    fontWeight: "800",
    color: "#3B6E99",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#22252A",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#4A515A",
    maxWidth: 720,
    textAlign: "center",
    lineHeight: 24,
  },
  plansGrid: {
    gap: 24,
    justifyContent: "space-between",
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    padding: 28,
    gap: 12,
    shadowColor: "#22252A",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  planCardHighlighted: {
    borderColor: "#3B6E99",
    borderWidth: 2,
    shadowColor: "#3B6E99",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  planBadgeWrap: {
    alignSelf: "flex-start",
    backgroundColor: "#3B6E99",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  planBadgeText: {
    color: "#FFFFFF",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  planName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#22252A",
  },
  planRate: {
    fontSize: 26,
    fontWeight: "900",
    color: "#3B6E99",
  },
  planVacancy: {
    fontSize: 13,
    color: "#166534",
    fontWeight: "700",
  },
  planDivider: {
    height: 1,
    backgroundColor: "#E8E2D5",
    marginVertical: 4,
  },
  planSummary: {
    fontSize: 13.5,
    color: "#4A515A",
    lineHeight: 20,
  },
  planFeaturesList: {
    gap: 10,
    marginVertical: 8,
  },
  planFeatureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  planFeatureText: {
    fontSize: 13,
    color: "#4A515A",
    lineHeight: 18,
    flex: 1,
  },
  planCtaBtn: {
    backgroundColor: "#FAF7F0",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  planCtaBtnHighlighted: {
    backgroundColor: "#3B6E99",
    borderColor: "#3B6E99",
  },
  planCtaBtnText: {
    color: "#22252A",
    fontSize: 14,
    fontWeight: "700",
  },
  planCtaBtnTextHighlighted: {
    color: "#FFFFFF",
  },
  calculatorWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 24,
    shadowColor: "#22252A",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  calcTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  calcIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#EBF2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  calcHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#22252A",
  },
  calcSub: {
    fontSize: 13.5,
    color: "#737B85",
  },
  calcInputRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    backgroundColor: "#FAF7F0",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  calcInputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22252A",
  },
  inputWithPrefix: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2D5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#737B85",
    marginRight: 4,
  },
  calcInputField: {
    fontSize: 16,
    fontWeight: "800",
    color: "#22252A",
    paddingVertical: 8,
    width: 90,
  },
  currencySuffix: {
    fontSize: 13,
    color: "#737B85",
  },
  quickRentPills: {
    flexDirection: "row",
    gap: 6,
  },
  quickRentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E2D5",
  },
  quickRentBtnActive: {
    backgroundColor: "#3B6E99",
    borderColor: "#3B6E99",
  },
  quickRentText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A515A",
  },
  quickRentTextActive: {
    color: "#FFFFFF",
  },
  comparisonGrid: {
    gap: 16,
  },
  compareCard: {
    flex: 1,
    backgroundColor: "#FAF7F0",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    gap: 10,
  },
  compareCardHighlighted: {
    backgroundColor: "#EBF2F7",
    borderColor: "#C8D9E8",
  },
  compareBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#3B6E99",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  compareBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  compareTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#22252A",
  },
  compareRateText: {
    fontSize: 13,
    color: "#3B6E99",
    fontWeight: "600",
  },
  compareDivider: {
    height: 1,
    backgroundColor: "#E8E2D5",
    marginVertical: 4,
  },
  compareMetricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  compareMetricLabel: {
    fontSize: 13,
    color: "#737B85",
  },
  compareMetricVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#22252A",
  },
  compareNetVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3B6E99",
  },
  compareAnnualVal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
  },
  compareNote: {
    fontSize: 11.5,
    color: "#737B85",
    marginTop: 4,
  },
  calcActionRow: {
    alignItems: "center",
  },
  calcCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3B6E99",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  calcCtaBtnText: {
    color: "#FFFFFF",
    fontSize: 14.5,
    fontWeight: "700",
  },
  addonsList: {
    maxWidth: 880,
    width: "100%",
    marginHorizontal: "auto",
    gap: 12,
  },
  addonItem: {
    backgroundColor: "#FAF7F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E2D5",
    overflow: "hidden",
  },
  addonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  addonName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#22252A",
  },
  addonCost: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3B6E99",
    marginTop: 2,
  },
  addonBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  addonDesc: {
    fontSize: 13.5,
    color: "#4A515A",
    lineHeight: 20,
  },
});
