import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TrendingDown, TrendingUp, Minus } from "lucide-react-native";
import { getDealScoreLabel } from "@/mocks/priceData";
import { useTheme } from "@/contexts/ThemeContext";

interface DealScoreBadgeProps {
  score: number;
  priceChange30d?: number;
  compact?: boolean;
}

export default function DealScoreBadge({ score, priceChange30d, compact = false }: DealScoreBadgeProps) {
  const { colors } = useTheme();
  const { label, color } = getDealScoreLabel(score);

  if (compact) {
    return (
      <View style={[styles.compactBadge, { backgroundColor: `${color}20` }]}>
        <View style={[styles.compactDot, { backgroundColor: color }]} />
        <Text style={[styles.compactScore, { color }]}>{score}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.scoreSection}>
        <View style={[styles.scoreCircle, { borderColor: color }]}>
          <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={[styles.scoreLabel, { color }]}>{label}</Text>
          <Text style={[styles.scoreDesc, { color: colors.textMuted }]}>Deal Score</Text>
        </View>
      </View>
      {priceChange30d !== undefined && (
        <View style={styles.trendSection}>
          {priceChange30d < 0 ? (
            <TrendingDown size={16} color={colors.accent} />
          ) : priceChange30d > 0 ? (
            <TrendingUp size={16} color={colors.error} />
          ) : (
            <Minus size={16} color={colors.textMuted} />
          )}
          <Text
            style={[
              styles.trendText,
              {
                color: priceChange30d < 0 ? colors.accent : priceChange30d > 0 ? colors.error : colors.textMuted,
              },
            ]}
          >
            {priceChange30d > 0 ? "+" : ""}{priceChange30d}% 30d
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  scoreSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 18,
    fontWeight: "800" as const,
  },
  scoreInfo: {
    gap: 2,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  scoreDesc: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
  trendSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  compactBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  compactDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  compactScore: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
});
