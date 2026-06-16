import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  Bell,
  BellOff,
  TrendingDown,
  Zap,
  ChevronRight,
  Flame,
  Clock,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useUser, useWishlistedShoes } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { shoes } from "@/mocks/shoes";
import { generateDealInfo, getDealScoreLabel } from "@/mocks/priceData";
import DealScoreBadge from "@/components/DealScoreBadge";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop";

type DealFilter = "all" | "alerts" | "drops" | "best";

export default function DealsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { priceAlerts, getPriceAlert } = useUser();
  const wishlistedItems = useWishlistedShoes(shoes);
  const [filter, setFilter] = useState<DealFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const dealsData = useMemo(() => {
    const allDeals = shoes.slice(0, 30).map((shoe) => {
      const deal = generateDealInfo(shoe.id, shoe.price);
      const alert = getPriceAlert(shoe.id);
      return { shoe, deal, alert };
    });

    return allDeals.sort((a, b) => b.deal.dealScore - a.deal.dealScore);
  }, [getPriceAlert]);

  const filteredDeals = useMemo(() => {
    switch (filter) {
      case "alerts":
        return dealsData.filter((d) => d.alert?.isActive);
      case "drops":
        return dealsData.filter((d) => d.deal.priceChange30d < -5);
      case "best":
        return dealsData.filter((d) => d.deal.dealScore >= 60);
      default:
        return dealsData;
    }
  }, [dealsData, filter]);

  const topDeals = useMemo(() => {
    return dealsData
      .filter((d) => d.deal.dealScore >= 70)
      .slice(0, 5);
  }, [dealsData]);

  const alertCount = priceAlerts.filter((a) => a.isActive).length;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filterOptions: { value: DealFilter; label: string; icon: React.ReactNode }[] = [
    { value: "all", label: "All Deals", icon: <Zap size={14} color={filter === "all" ? "#FFF" : colors.textSecondary} /> },
    { value: "best", label: "Best Deals", icon: <Flame size={14} color={filter === "best" ? "#FFF" : colors.textSecondary} /> },
    { value: "drops", label: "Price Drops", icon: <TrendingDown size={14} color={filter === "drops" ? "#FFF" : colors.textSecondary} /> },
    { value: "alerts", label: `Alerts${alertCount > 0 ? ` (${alertCount})` : ""}`, icon: <Bell size={14} color={filter === "alerts" ? "#FFF" : colors.textSecondary} /> },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>Deals</Text>
        <View style={[styles.alertCountBadge, { backgroundColor: colors.surfaceAlt }]}>
          <Bell size={16} color={colors.accent} />
          <Text style={[styles.alertCountText, { color: colors.accent }]}>{alertCount}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
      >
        {filterOptions.map((opt) => (
          <Pressable
            key={opt.value}
            style={[
              styles.filterChip,
              { backgroundColor: colors.surface, borderColor: colors.border },
              filter === opt.value && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              setFilter(opt.value);
            }}
          >
            {opt.icon}
            <Text
              style={[
                styles.filterText,
                { color: colors.textSecondary },
                filter === opt.value && { color: "#FFFFFF" },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {filter === "all" && topDeals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Flame size={18} color={colors.warning} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Hot Deals</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hotDealsScroll}
            >
              {topDeals.map(({ shoe, deal }) => (
                <HotDealCard
                  key={shoe.id}
                  shoe={shoe}
                  dealScore={deal.dealScore}
                  currentLowest={deal.currentLowest}
                  retailPrice={deal.retailPrice}
                  priceChange={deal.priceChange30d}
                  isNewLow={deal.isNewLow}
                  colors={colors}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color={colors.textMuted} />
            <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
              {filteredDeals.length} {filter === "all" ? "tracked prices" : "results"}
            </Text>
          </View>

          {filteredDeals.length === 0 ? (
            <View style={styles.emptyState}>
              {filter === "alerts" ? (
                <BellOff size={48} color={colors.textMuted} />
              ) : (
                <TrendingDown size={48} color={colors.textMuted} />
              )}
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {filter === "alerts" ? "No active alerts" : "No deals match this filter"}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                {filter === "alerts"
                  ? "Set price alerts on shoes you're watching"
                  : "Try a different filter or check back later"}
              </Text>
              {filter === "alerts" && (
                <Pressable
                  style={[styles.browseCta, { backgroundColor: colors.primary }]}
                  onPress={() => router.push("/browse")}
                >
                  <Text style={styles.browseCtaText}>Browse Shoes</Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View style={styles.dealsList}>
              {filteredDeals.map(({ shoe, deal, alert }) => (
                <DealListItem
                  key={shoe.id}
                  shoe={shoe}
                  deal={deal}
                  alert={alert}
                  colors={colors}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

interface HotDealCardProps {
  shoe: typeof shoes[0];
  dealScore: number;
  currentLowest: number;
  retailPrice: number;
  priceChange: number;
  isNewLow: boolean;
  colors: any;
}

function HotDealCard({ shoe, dealScore, currentLowest, retailPrice, priceChange, isNewLow, colors }: HotDealCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const { label, color } = getDealScoreLabel(dealScore);
  const savings = retailPrice - currentLowest;

  return (
    <Animated.View style={[styles.hotDealCard, { transform: [{ scale: scaleAnim }], backgroundColor: colors.surface }]}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          router.push(`/shoe/${shoe.id}` as never);
        }}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      >
        <View style={styles.hotDealImageWrap}>
          <Image
            source={{ uri: shoe.images[0] || FALLBACK_IMAGE }}
            style={[styles.hotDealImage, { backgroundColor: colors.surfaceAlt }]}
            contentFit="cover"
            transition={200}
          />
          {isNewLow && (
            <View style={[styles.newLowBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.newLowText}>NEW LOW</Text>
            </View>
          )}
          <View style={[styles.hotScoreBadge, { backgroundColor: `${color}20` }]}>
            <View style={[styles.hotScoreDot, { backgroundColor: color }]} />
            <Text style={[styles.hotScoreText, { color }]}>{dealScore}</Text>
          </View>
        </View>
        <View style={styles.hotDealContent}>
          <Text style={[styles.hotDealBrand, { color: colors.textSecondary }]}>{shoe.brand}</Text>
          <Text style={[styles.hotDealName, { color: colors.text }]} numberOfLines={1}>{shoe.name}</Text>
          <View style={styles.hotDealPriceRow}>
            <Text style={[styles.hotDealPrice, { color: colors.accent }]}>${currentLowest}</Text>
            {savings > 0 && (
              <Text style={[styles.hotDealRetail, { color: colors.textMuted }]}>
                ${retailPrice}
              </Text>
            )}
          </View>
          {priceChange < 0 && (
            <View style={styles.hotDealTrend}>
              <TrendingDown size={12} color={colors.accent} />
              <Text style={[styles.hotDealTrendText, { color: colors.accent }]}>
                {Math.abs(priceChange)}% in 30d
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

interface DealListItemProps {
  shoe: typeof shoes[0];
  deal: ReturnType<typeof generateDealInfo>;
  alert: ReturnType<ReturnType<typeof useUser>["getPriceAlert"]>;
  colors: any;
}

function DealListItem({ shoe, deal, alert, colors }: DealListItemProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const savings = deal.retailPrice - deal.currentLowest;
  const savingsPercent = deal.retailPrice > 0
    ? Math.round((savings / deal.retailPrice) * 100)
    : 0;

  return (
    <Animated.View style={[styles.dealItem, { transform: [{ scale: scaleAnim }], backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable
        style={styles.dealItemPressable}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          router.push(`/shoe/${shoe.id}` as never);
        }}
        onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
      >
        <Image
          source={{ uri: shoe.images[0] || FALLBACK_IMAGE }}
          style={[styles.dealItemImage, { backgroundColor: colors.surfaceAlt }]}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.dealItemContent}>
          <View style={styles.dealItemTop}>
            <View style={styles.dealItemInfo}>
              <Text style={[styles.dealItemBrand, { color: colors.textSecondary }]}>{shoe.brand}</Text>
              <Text style={[styles.dealItemName, { color: colors.text }]} numberOfLines={1}>{shoe.name}</Text>
            </View>
            <DealScoreBadge score={deal.dealScore} compact />
          </View>
          <View style={styles.dealItemBottom}>
            <View style={styles.dealItemPrices}>
              <Text style={[styles.dealItemLowest, { color: colors.accent }]}>${deal.currentLowest}</Text>
              {savings > 0 && (
                <View style={styles.dealItemSavingsRow}>
                  <Text style={[styles.dealItemRetail, { color: colors.textMuted }]}>${deal.retailPrice}</Text>
                  <View style={[styles.savingsBadge, { backgroundColor: `${colors.accent}15` }]}>
                    <Text style={[styles.savingsText, { color: colors.accent }]}>-{savingsPercent}%</Text>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.dealItemMeta}>
              {alert?.isActive && (
                <View style={[styles.alertIndicator, { backgroundColor: `${colors.warning}20` }]}>
                  <Bell size={12} color={colors.warning} />
                </View>
              )}
              {deal.isNewLow && (
                <View style={[styles.newLowSmall, { backgroundColor: `${colors.accent}20` }]}>
                  <Text style={[styles.newLowSmallText, { color: colors.accent }]}>Low</Text>
                </View>
              )}
              <ChevronRight size={16} color={colors.textMuted} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
  },
  alertCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  alertCountText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  filterBar: {
    maxHeight: 48,
    marginBottom: 4,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  hotDealsScroll: {
    gap: 12,
  },
  hotDealCard: {
    width: 180,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  hotDealImageWrap: {
    position: "relative",
  },
  hotDealImage: {
    width: 180,
    height: 120,
  },
  newLowBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newLowText: {
    fontSize: 9,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  hotScoreBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hotScoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  hotScoreText: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  hotDealContent: {
    padding: 12,
  },
  hotDealBrand: {
    fontSize: 10,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  hotDealName: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginTop: 2,
  },
  hotDealPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  hotDealPrice: {
    fontSize: 16,
    fontWeight: "800" as const,
  },
  hotDealRetail: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  hotDealTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  hotDealTrendText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  dealsList: {
    gap: 10,
  },
  dealItem: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
  },
  dealItemPressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  dealItemImage: {
    width: 90,
    height: 90,
  },
  dealItemContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dealItemTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  dealItemInfo: {
    flex: 1,
  },
  dealItemBrand: {
    fontSize: 10,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dealItemName: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginTop: 2,
  },
  dealItemBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dealItemPrices: {
    gap: 2,
  },
  dealItemLowest: {
    fontSize: 16,
    fontWeight: "800" as const,
  },
  dealItemSavingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dealItemRetail: {
    fontSize: 11,
    textDecorationLine: "line-through",
  },
  savingsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: "700" as const,
  },
  dealItemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  alertIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  newLowSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newLowSmallText: {
    fontSize: 9,
    fontWeight: "700" as const,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  browseCta: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  browseCtaText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
