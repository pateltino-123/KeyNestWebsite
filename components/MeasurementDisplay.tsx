import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ruler, ArrowLeftRight, Mountain } from "lucide-react-native";
import Colors from "@/constants/colors";
import { FootMeasurements } from "@/contexts/UserContext";

interface MeasurementDisplayProps {
  measurements: FootMeasurements;
  compact?: boolean;
}

export default function MeasurementDisplay({ measurements, compact = false }: MeasurementDisplayProps) {
  const averageLength = ((measurements.leftLength + measurements.rightLength) / 2).toFixed(1);
  const averageWidth = ((measurements.leftWidth + measurements.rightWidth) / 2).toFixed(1);

  const archTypeLabel = {
    flat: "Flat Arch",
    neutral: "Neutral Arch",
    high: "High Arch",
  };

  const footTypeLabel = {
    narrow: "Narrow",
    normal: "Normal",
    wide: "Wide",
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactItem}>
          <Text style={styles.compactValue}>US {measurements.recommendedSize}</Text>
          <Text style={styles.compactLabel}>Size</Text>
        </View>
        <View style={styles.compactDivider} />
        <View style={styles.compactItem}>
          <Text style={styles.compactValue}>{footTypeLabel[measurements.footType]}</Text>
          <Text style={styles.compactLabel}>Width</Text>
        </View>
        <View style={styles.compactDivider} />
        <View style={styles.compactItem}>
          <Text style={styles.compactValue}>{archTypeLabel[measurements.archType].split(" ")[0]}</Text>
          <Text style={styles.compactLabel}>Arch</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sizeCard}>
        <Text style={styles.sizeLabel}>Recommended Size</Text>
        <Text style={styles.sizeValue}>US {measurements.recommendedSize}</Text>
      </View>

      <View style={styles.measurementsGrid}>
        <View style={styles.measurementItem}>
          <View style={styles.iconContainer}>
            <Ruler size={18} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.measurementLabel}>Length</Text>
            <Text style={styles.measurementValue}>{averageLength} cm</Text>
          </View>
        </View>

        <View style={styles.measurementItem}>
          <View style={styles.iconContainer}>
            <ArrowLeftRight size={18} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.measurementLabel}>Width</Text>
            <Text style={styles.measurementValue}>{averageWidth} cm</Text>
          </View>
        </View>

        <View style={styles.measurementItem}>
          <View style={styles.iconContainer}>
            <Mountain size={18} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.measurementLabel}>Arch Type</Text>
            <Text style={styles.measurementValue}>{archTypeLabel[measurements.archType]}</Text>
          </View>
        </View>

        <View style={styles.measurementItem}>
          <View style={[styles.iconContainer, { backgroundColor: Colors.accentLight }]}>
            <Text style={styles.footTypeIcon}>{measurements.footType === "wide" ? "W" : measurements.footType === "narrow" ? "N" : "M"}</Text>
          </View>
          <View>
            <Text style={styles.measurementLabel}>Foot Type</Text>
            <Text style={styles.measurementValue}>{footTypeLabel[measurements.footType]}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  sizeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  sizeLabel: {
    fontSize: 13,
    color: Colors.accentLight,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sizeValue: {
    fontSize: 36,
    color: Colors.white,
    fontWeight: "700",
    marginTop: 4,
  },
  measurementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  measurementItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  measurementLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  measurementValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "600",
    marginTop: 2,
  },
  footTypeIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.accentDark,
  },
  compactContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  compactItem: {
    flex: 1,
    alignItems: "center",
  },
  compactDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 8,
  },
  compactValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "700",
  },
  compactLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
