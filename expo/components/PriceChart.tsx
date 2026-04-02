import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PricePoint } from "@/mocks/priceData";
import { useTheme } from "@/contexts/ThemeContext";

const CHART_HEIGHT = 160;
const CHART_PADDING = 8;

interface PriceChartProps {
  priceHistory: PricePoint[];
  retailer?: string;
  targetPrice?: number;
}

export default function PriceChart({ priceHistory, retailer, targetPrice }: PriceChartProps) {
  const { colors } = useTheme();
  const chartWidth = Dimensions.get("window").width - 80;

  const { points, minPrice, maxPrice, dateLabels } = useMemo(() => {
    let filtered = priceHistory;
    if (retailer) {
      filtered = priceHistory.filter((p) => p.retailer === retailer);
    } else {
      const dateMap = new Map<string, number>();
      priceHistory.forEach((p) => {
        const existing = dateMap.get(p.date);
        if (!existing || p.price < existing) {
          dateMap.set(p.date, p.price);
        }
      });
      filtered = Array.from(dateMap.entries()).map(([date, price]) => ({
        date,
        price,
        retailer: "Lowest",
      }));
    }

    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const prices = filtered.map((p) => p.price);
    const min = Math.min(...prices) * 0.95;
    const max = Math.max(...prices) * 1.05;

    const totalPoints = filtered.length;
    const mapped = filtered.map((p, i) => ({
      x: CHART_PADDING + (i / Math.max(totalPoints - 1, 1)) * (chartWidth - CHART_PADDING * 2),
      y: CHART_PADDING + (1 - (p.price - min) / (max - min || 1)) * (CHART_HEIGHT - CHART_PADDING * 2),
      price: p.price,
      date: p.date,
    }));

    const labels: string[] = [];
    if (filtered.length > 0) {
      labels.push(formatDate(filtered[0].date));
      if (filtered.length > 1) {
        const midIdx = Math.floor(filtered.length / 2);
        labels.push(formatDate(filtered[midIdx].date));
        labels.push(formatDate(filtered[filtered.length - 1].date));
      }
    }

    return { points: mapped, minPrice: min, maxPrice: max, dateLabels: labels };
  }, [priceHistory, retailer, chartWidth]);

  const targetY = useMemo(() => {
    if (!targetPrice || maxPrice === minPrice) return null;
    return CHART_PADDING + (1 - (targetPrice - minPrice) / (maxPrice - minPrice)) * (CHART_HEIGHT - CHART_PADDING * 2);
  }, [targetPrice, minPrice, maxPrice]);

  if (points.length < 2) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <Text style={[styles.noDataText, { color: colors.textMuted }]}>Not enough price data</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.yAxis}>
        <Text style={[styles.axisLabel, { color: colors.textMuted }]}>${Math.round(maxPrice)}</Text>
        <Text style={[styles.axisLabel, { color: colors.textMuted }]}>${Math.round((maxPrice + minPrice) / 2)}</Text>
        <Text style={[styles.axisLabel, { color: colors.textMuted }]}>${Math.round(minPrice)}</Text>
      </View>
      <View style={[styles.chartArea, { width: chartWidth }]}>
        <View style={{ width: chartWidth, height: CHART_HEIGHT }}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <View
              key={ratio}
              style={[
                styles.gridLine,
                {
                  top: CHART_PADDING + ratio * (CHART_HEIGHT - CHART_PADDING * 2),
                  backgroundColor: colors.border,
                },
              ]}
            />
          ))}

          {targetY !== null && targetY >= 0 && targetY <= CHART_HEIGHT && (
            <View
              style={[
                styles.targetLine,
                { top: targetY, backgroundColor: colors.accent },
              ]}
            >
              <View style={[styles.targetLabel, { backgroundColor: colors.accent }]}>
                <Text style={styles.targetLabelText}>${targetPrice}</Text>
              </View>
            </View>
          )}

          {points.map((point, i) => {
            if (i === 0) return null;
            const prev = points[i - 1];
            const isDown = point.price < prev.price;
            const lineColor = isDown ? colors.accent : colors.error;
            const dx = point.x - prev.x;
            const dy = point.y - prev.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            return (
              <View
                key={`line-${i}`}
                style={{
                  position: "absolute",
                  left: prev.x,
                  top: prev.y,
                  width: length,
                  height: 2,
                  backgroundColor: lineColor,
                  transform: [{ rotate: `${angle}deg` }],
                  transformOrigin: "left center",
                }}
              />
            );
          })}

          {points.map((point, i) => (
            <View
              key={`dot-${i}`}
              style={[
                styles.dot,
                {
                  left: point.x - 3,
                  top: point.y - 3,
                  backgroundColor: i === points.length - 1 ? colors.primary : colors.textMuted,
                  borderColor: colors.surface,
                },
                i === points.length - 1 && styles.dotLast,
              ]}
            />
          ))}
        </View>

        <View style={styles.xAxis}>
          {dateLabels.map((label, i) => (
            <Text key={i} style={[styles.axisLabel, { color: colors.textMuted }]}>
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  yAxis: {
    width: 40,
    height: CHART_HEIGHT,
    justifyContent: "space-between",
    paddingVertical: CHART_PADDING,
  },
  chartArea: {
    flex: 1,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: CHART_PADDING,
  },
  axisLabel: {
    fontSize: 10,
    fontWeight: "500" as const,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.3,
  },
  targetLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1.5,
    opacity: 0.8,
  },
  targetLabel: {
    position: "absolute",
    right: 0,
    top: -10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  targetLabelText: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
  },
  dotLast: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  noDataText: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 40,
  },
});
