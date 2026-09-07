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
  Calendar,
  Info,
  DollarSign,
} from "lucide-react-native";
import WebsiteLayout, { useWebsiteModals } from "@/components/keynest/WebsiteLayout";
import {
  PRICING_PLANS,
  ADD_ON_FEES,
} from "@/constants/keynestData";

export default function PricingPage() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  const { openRentalAnalysis, openConsultation } = useWebsiteModals();

  // Interactive Fee Calculator State
  const [calcMonthlyRent, setCalcMonthlyRent] = useState("2600");
  const rentNumber = parseFloat(calcMonthlyRent) || 2600;

  // Percentage Plan Cost (8.9%)
  const percentageCost = Math.round(rentNumber * 0.089);
  const percentageNet = Math.round(rentNumber - percentageCost);

  // Flat Fee Cost ($129)
  const flatFeeCost = 129;
  const flatFeeNet = Math.round(rentNumber - flatFeeCost);

  // Leasing Only (85% one-time placement, amortized over 12 months for comparison)
  const placementFee = Math.round(rentNumber * 0.85);
  const placementMonthlyAmortized = Math.round(placementFee / 12);

  return (
    <WebsiteLayout>
      {/* Hero Header */}
      <View style={styles.headerHero}>
        <View style={styles.innerContainer}>
          <View style={styles.badgePill}>
            <ShieldCheck size={14} color="#10B981" />
            <Text style={styles.badgePillText}>Under the Brokerage of Fair Deal Realty Inc.</Text>
          </View>
          <Text style={styles.pageTitle}>Simple, Transparent Pricing</Text>
          <Text style={styles.pageSubtitle}>
            No hidden markups. No setup penalties. Aligned incentives where you pay zero management fee when your property is vacant.
          </Text>
        </View>
      </View>

      {/* 1. The Three Core Plans (Slide 14 requirements) */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>SELECT YOUR SERVICE MODEL</Text>
            <Text style={styles.sectionTitle}>Choose the Plan That Fits Your Goals</Text>
            <Text style={styles.sectionSubtitle}>
              Whether you want full-service operational peace of mind or professional placement for self-management, our pricing is straightforward and transparent.
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

                <View style={styles.planBestForBox}>
                  <Text style={styles.bestForHeading}>Best For:</Text>
                  <Text style={styles.bestForText}>{plan.bestFor}</Text>
                </View>

                <View style={styles.featuresList}>
                  <Text style={styles.featuresHeading}>WHAT’S INCLUDED:</Text>
                  {plan.features.map((feat, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <CheckCircle2 size={15} color="#059669" />
                      <Text style={styles.featureText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.selectPlanBtn,
                    plan.highlighted && styles.selectPlanBtnHighlighted,
                  ]}
                  onPress={() => openRentalAnalysis()}
                >
                  <Text
                    style={[
                      styles.selectPlanBtnText,
                      plan.highlighted && styles.selectPlanBtnTextHighlighted,
                    ]}
                  >
                    Select Model & Get Analysis
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 2. Interactive Fee & Net Proceeds ROI Calculator */}
      <View style={styles.sectionLight}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>INTERACTIVE ESTIMATOR</Text>
            <Text style={styles.sectionTitle}>Calculate Your Management Proceeds</Text>
            <Text style={styles.sectionSubtitle}>
              Slide or enter your anticipated monthly rent to compare estimated monthly management costs and net distributions.
            </Text>
          </View>

          <View style={styles.calculatorCard}>
            <View style={styles.calcInputSection}>
              <Text style={styles.calcInputLabel}>Enter Estimated Monthly Rent ($):</Text>
              <View style={styles.rentInputBox}>
                <DollarSign size={20} color="#164E3A" />
                <TextInput
                  style={styles.rentTextInput}
                  value={calcMonthlyRent}
                  onChangeText={setCalcMonthlyRent}
                  keyboardType="numeric"
                  placeholder="2600"
                />
              </View>

              {/* Quick Rent Preset Chips */}
              <View style={styles.presetChipsRow}>
                {["2200", "2600", "3000", "3500", "4200"].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[styles.presetChip, calcMonthlyRent === amt && styles.presetChipActive]}
                    onPress={() => setCalcMonthlyRent(amt)}
                  >
                    <Text style={[styles.presetChipText, calcMonthlyRent === amt && styles.presetChipTextActive]}>
                      ${amt}/mo
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.calcDivider} />

            {/* Side-by-side comparison */}
            <View
              style={[
                styles.comparisonRow,
                { flexDirection: isDesktop ? "row" : isTablet ? "row" : "column" },
              ]}
            >
              {/* Percentage Col */}
              <View style={styles.comparisonCol}>
                <View style={styles.comparisonHeader}>
                  <Text style={styles.compPlanTitle}>Full Service (8.9%)</Text>
                  <Text style={styles.compBadgeGreen}>Most Popular</Text>
                </View>
                <Text style={styles.compFeeAmt}>${percentageCost} / mo</Text>
                <Text style={styles.compFeeSub}>Management Fee</Text>

                <View style={styles.compProceedsBox}>
                  <Text style={styles.compProceedsLabel}>ESTIMATED NET TO OWNER</Text>
                  <Text style={styles.compProceedsAmt}>${percentageNet.toLocaleString()} / mo</Text>
                </View>
                <Text style={styles.compNote}>$0 fee during vacancy. Includes full 24/7 maintenance triage.</Text>
              </View>

              {/* Flat Fee Col */}
              <View style={styles.comparisonCol}>
                <View style={styles.comparisonHeader}>
                  <Text style={styles.compPlanTitle}>Flat Monthly Fee</Text>
                  <Text style={styles.compBadgeAmber}>Fixed Dollar</Text>
                </View>
                <Text style={styles.compFeeAmt}>${flatFeeCost} / mo</Text>
                <Text style={styles.compFeeSub}>Fixed Regardless of Rent</Text>

                <View style={styles.compProceedsBox}>
                  <Text style={styles.compProceedsLabel}>ESTIMATED NET TO OWNER</Text>
                  <Text style={styles.compProceedsAmt}>${flatFeeNet.toLocaleString()} / mo</Text>
                </View>
                <Text style={styles.compNote}>Significant savings on rents above $2,500/mo.</Text>
              </View>

              {/* Leasing Only Col */}
              <View style={styles.comparisonCol}>
                <View style={styles.comparisonHeader}>
                  <Text style={styles.compPlanTitle}>Leasing Only (85%)</Text>
                  <Text style={styles.compBadgeGray}>One-Time</Text>
                </View>
                <Text style={styles.compFeeAmt}>${placementFee}</Text>
                <Text style={styles.compFeeSub}>One-Time Placement Fee</Text>

                <View style={styles.compProceedsBox}>
                  <Text style={styles.compProceedsLabel}>12-MO AMORTIZED COST</Text>
                  <Text style={styles.compProceedsAmt}>~${placementMonthlyAmortized} / mo</Text>
                </View>
                <Text style={styles.compNote}>Owner manages ongoing repairs and rent collection.</Text>
              </View>
            </View>

            <View style={styles.calcFooterCta}>
              <TouchableOpacity style={styles.calcCtaBtn} onPress={openConsultation}>
                <Calendar size={16} color="#FFFFFF" />
                <Text style={styles.calcCtaBtnText}>Review These Numbers with Dinesh or Purvang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Add-On Fee Schedule (Slide 14 required itemization) */}
      <View style={styles.sectionWhite}>
        <View style={styles.innerContainer}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionOverline}>FULL TRANSPARENCY</Text>
            <Text style={styles.sectionTitle}>Add-On Fee Schedule</Text>
            <Text style={styles.sectionSubtitle}>
              Every potential fee is disclosed up front. All fees match the broker-approved Texas REALTORS® Property Management Agreement.
            </Text>
          </View>

          <View style={styles.addOnTable}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.thCell, { width: "32%" }]}>SERVICE TYPE</Text>
              <Text style={[styles.thCell, { width: "24%" }]}>APPROVED FEE</Text>
              <Text style={[styles.thCell, { width: "44%" }]}>DESCRIPTION & POLICY</Text>
            </View>

            {ADD_ON_FEES.map((item, idx) => (
              <View key={idx} style={[styles.tableBodyRow, idx % 2 === 1 && styles.tableBodyRowAlt]}>
                <Text style={[styles.tdCellBold, { width: "32%" }]}>{item.service}</Text>
                <Text style={[styles.tdCellPrice, { width: "24%" }]}>{item.fee}</Text>
                <Text style={[styles.tdCellDesc, { width: "44%" }]}>{item.description}</Text>
              </View>
            ))}
          </View>

          {/* Important Footnote from Slide 14 */}
          <View style={styles.feeNoticeBox}>
            <Info size={18} color="#164E3A" />
            <Text style={styles.feeNoticeText}>
              <Text style={{ fontWeight: "700" }}>Zero Maintenance Markups:</Text> We do not add hidden 10%–20% surcharges to contractor bills. We pass through licensed vendor invoices at exact cost. All fees remain governed by broker-approved agreements under Fair Deal Realty Inc.
            </Text>
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
    paddingVertical: 60,
  },
  sectionHeaderCentered: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 40,
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
  plansGrid: {
    justifyContent: "space-between",
    gap: 24,
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 26,
    position: "relative",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  planCardHighlighted: {
    borderColor: "#164E3A",
    borderWidth: 2,
    shadowColor: "#164E3A",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  planBadgeWrap: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    marginBottom: 4,
  },
  planBadgeText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#065F46",
    letterSpacing: 0.6,
  },
  planName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  planRate: {
    fontSize: 26,
    fontWeight: "900",
    color: "#164E3A",
  },
  planVacancy: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  planDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 6,
  },
  planSummary: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
  planBestForBox: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 6,
    gap: 2,
  },
  bestForHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
  },
  bestForText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 16,
  },
  featuresList: {
    gap: 8,
    marginVertical: 8,
  },
  featuresHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  featureText: {
    fontSize: 12.5,
    color: "#374151",
    lineHeight: 17,
    flex: 1,
  },
  selectPlanBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  selectPlanBtnHighlighted: {
    backgroundColor: "#164E3A",
  },
  selectPlanBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#1F2937",
  },
  selectPlanBtnTextHighlighted: {
    color: "#FFFFFF",
  },
  calculatorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 28,
    gap: 20,
    maxWidth: 960,
    marginHorizontal: "auto",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  calcInputSection: {
    alignItems: "center",
    gap: 12,
  },
  calcInputLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  rentInputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#164E3A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  rentTextInput: {
    fontSize: 24,
    fontWeight: "800",
    color: "#164E3A",
    minWidth: 100,
    textAlign: "center",
  },
  presetChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  presetChipActive: {
    backgroundColor: "#164E3A",
  },
  presetChipText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#4B5563",
  },
  presetChipTextActive: {
    color: "#FFFFFF",
  },
  calcDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  comparisonRow: {
    justifyContent: "space-between",
    gap: 16,
  },
  comparisonCol: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  comparisonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  compPlanTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  compBadgeGreen: {
    fontSize: 10,
    fontWeight: "700",
    color: "#065F46",
    backgroundColor: "#D1FAE5",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  compBadgeAmber: {
    fontSize: 10,
    fontWeight: "700",
    color: "#92400E",
    backgroundColor: "#FEF3C7",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  compBadgeGray: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4B5563",
    backgroundColor: "#E5E7EB",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  compFeeAmt: {
    fontSize: 22,
    fontWeight: "900",
    color: "#164E3A",
  },
  compFeeSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: -4,
  },
  compProceedsBox: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 2,
    marginVertical: 4,
  },
  compProceedsLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
    letterSpacing: 0.5,
  },
  compProceedsAmt: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  compNote: {
    fontSize: 11.5,
    color: "#6B7280",
    lineHeight: 16,
  },
  calcFooterCta: {
    alignItems: "center",
    marginTop: 8,
  },
  calcCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  calcCtaBtnText: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "700",
  },
  addOnTable: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
    maxWidth: 960,
    marginHorizontal: "auto",
    width: "100%",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#164E3A",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  thCell: {
    color: "#FFFFFF",
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  tableBodyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  tableBodyRowAlt: {
    backgroundColor: "#F9FAFB",
  },
  tdCellBold: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#111827",
  },
  tdCellPrice: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#059669",
  },
  tdCellDesc: {
    fontSize: 12.5,
    color: "#4B5563",
    lineHeight: 17,
  },
  feeNoticeBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#F0FDF4",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginTop: 24,
    maxWidth: 960,
    marginHorizontal: "auto",
    width: "100%",
  },
  feeNoticeText: {
    fontSize: 12.5,
    color: "#166534",
    lineHeight: 18,
    flex: 1,
  },
});
