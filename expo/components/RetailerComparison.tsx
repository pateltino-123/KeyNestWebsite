import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { ExternalLink, Check, X as XIcon, ShoppingBag } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { RetailerPrice } from "@/mocks/priceData";
import { useTheme } from "@/contexts/ThemeContext";

interface RetailerComparisonProps {
  retailers: RetailerPrice[];
}

export default function RetailerComparison({ retailers }: RetailerComparisonProps) {
  const { colors } = useTheme();

  const lowestPrice = Math.min(
    ...retailers.filter((r) => r.inStock).map((r) => r.currentPrice)
  );

  const handleOpenLink = useCallback(async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error("[RetailerComparison] Error opening URL:", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      {retailers.map((retailer, index) => {
        const isBest = retailer.inStock && retailer.currentPrice === lowestPrice;
        const savings = retailer.originalPrice - retailer.currentPrice;

        return (
          <Pressable
            key={index}
            style={[
              styles.retailerCard,
              {
                backgroundColor: colors.surface,
                borderColor: isBest ? colors.accent : colors.border,
                borderWidth: isBest ? 2 : 1,
              },
            ]}
            onPress={() => handleOpenLink(retailer.url)}
          >
            {isBest && (
              <View style={[styles.bestBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.bestBadgeText}>Best Price</Text>
              </View>
            )}
            <View style={styles.retailerHeader}>
              <View style={[styles.retailerIcon, { backgroundColor: colors.surfaceAlt }]}>
                <ShoppingBag size={20} color={colors.primary} />
              </View>
              <View style={styles.retailerInfo}>
                <Text style={[styles.retailerName, { color: colors.text }]}>{retailer.retailer}</Text>
                <Text style={[styles.retailerAuth, { color: colors.textMuted }]}>{retailer.authenticity}</Text>
              </View>
              <View style={styles.priceSection}>
                <Text style={[styles.currentPrice, { color: isBest ? colors.accent : colors.text }]}>
                  ${retailer.currentPrice}
                </Text>
                {savings > 0 && (
                  <Text style={[styles.savings, { color: colors.accent }]}>
                    Save ${savings}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.retailerMeta}>
              <View style={styles.metaItem}>
                {retailer.inStock ? (
                  <Check size={12} color={colors.accent} />
                ) : (
                  <XIcon size={12} color={colors.error} />
                )}
                <Text style={[styles.metaText, { color: retailer.inStock ? colors.accent : colors.error }]}>
                  {retailer.inStock ? "In Stock" : "Out of Stock"}
                </Text>
              </View>
              <Text style={[styles.metaText, { color: colors.textMuted }]}>{retailer.shipping}</Text>
              <ExternalLink size={14} color={colors.textMuted} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  retailerCard: {
    borderRadius: 14,
    padding: 14,
    overflow: "hidden",
  },
  bestBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  bestBadgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  retailerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  retailerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  retailerInfo: {
    flex: 1,
  },
  retailerName: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  retailerAuth: {
    fontSize: 11,
    marginTop: 1,
  },
  priceSection: {
    alignItems: "flex-end",
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "800" as const,
  },
  savings: {
    fontSize: 11,
    fontWeight: "600" as const,
    marginTop: 1,
  },
  retailerMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.15)",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
});
