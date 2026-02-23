import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  X,
  Camera,
  CreditCard,
  Check,
  ChevronRight,
  Footprints,
  RefreshCw,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { useUser, FootMeasurements } from "@/contexts/UserContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type ScanStep = "intro" | "left" | "right" | "processing" | "results";

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const { setMeasurements } = useUser();
  const [step, setStep] = useState<ScanStep>("intro");
  const [measurements, setLocalMeasurements] = useState<FootMeasurements | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === "processing") {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }).start(() => {
        const generatedMeasurements = generateMockMeasurements();
        setLocalMeasurements(generatedMeasurements);
        setStep("results");
      });
    }
  }, [step, progressAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const generateMockMeasurements = (): FootMeasurements => {
    const baseLength = 25 + Math.random() * 4;
    const baseWidth = 9 + Math.random() * 2;
    const archTypes: ("flat" | "neutral" | "high")[] = ["flat", "neutral", "high"];
    const footTypes: ("narrow" | "normal" | "wide")[] = ["narrow", "normal", "wide"];

    const archType = archTypes[Math.floor(Math.random() * archTypes.length)];
    const footType = footTypes[Math.floor(Math.random() * footTypes.length)];

    const lengthCm = baseLength;
    let usSize = Math.round((lengthCm - 22) * 1.5 + 6);
    usSize = Math.max(6, Math.min(14, usSize));

    return {
      leftLength: Math.round(baseLength * 10) / 10,
      leftWidth: Math.round(baseWidth * 10) / 10,
      rightLength: Math.round((baseLength + (Math.random() * 0.4 - 0.2)) * 10) / 10,
      rightWidth: Math.round((baseWidth + (Math.random() * 0.2 - 0.1)) * 10) / 10,
      archType,
      footType,
      recommendedSize: usSize,
      lastScanned: new Date().toISOString(),
    };
  };

  const handleCapture = useCallback((foot: "left" | "right") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    if (foot === "left") {
      setTimeout(() => setStep("right"), 500);
    } else {
      setTimeout(() => setStep("processing"), 500);
    }
  }, [slideAnim]);

  const handleSave = useCallback(() => {
    if (measurements) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMeasurements(measurements);
      router.back();
    }
  }, [measurements, setMeasurements]);

  const handleRescan = useCallback(() => {
    setLocalMeasurements(null);
    progressAnim.setValue(0);
    setStep("intro");
  }, [progressAnim]);

  const renderIntro = () => (
    <View style={styles.stepContainer}>
      <View style={styles.introContent}>
        <Animated.View
          style={[
            styles.introIconContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Footprints size={64} color={Colors.accent} />
        </Animated.View>
        <Text style={styles.introTitle}>Scan Your Feet</Text>
        <Text style={styles.introSubtitle}>
          Get accurate measurements for perfect shoe recommendations
        </Text>

        <View style={styles.instructionsList}>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Place a credit card next to your foot for scale
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Stand on a flat, well-lit surface
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              We will scan both feet and recommend based on the larger one
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() => setStep("left")}
      >
        <Text style={styles.primaryButtonText}>Start Scanning</Text>
        <ChevronRight size={20} color={Colors.white} />
      </Pressable>
    </View>
  );

  const renderScanStep = (foot: "left" | "right") => (
    <View style={styles.stepContainer}>
      <View style={styles.scanContent}>
        <View style={styles.cameraPlaceholder}>
          <View style={styles.cameraFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            <View style={styles.footOutline}>
              <Footprints
                size={120}
                color={Colors.accentLight}
                style={foot === "right" ? { transform: [{ scaleX: -1 }] } : undefined}
              />
            </View>

            <View style={styles.referenceCard}>
              <CreditCard size={24} color={Colors.textMuted} />
              <Text style={styles.referenceText}>Place card here</Text>
            </View>
          </View>
        </View>

        <Text style={styles.scanTitle}>
          Position your {foot} foot
        </Text>
        <Text style={styles.scanSubtitle}>
          Align your foot with the outline and place a credit card beside it
        </Text>
      </View>

      <Pressable
        style={styles.captureButton}
        onPress={() => handleCapture(foot)}
      >
        <View style={styles.captureButtonInner}>
          <Camera size={28} color={Colors.white} />
        </View>
      </Pressable>
    </View>
  );

  const renderProcessing = () => (
    <View style={[styles.stepContainer, styles.centerContent]}>
      <Animated.View
        style={[
          styles.processingIconContainer,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Footprints size={48} color={Colors.accent} />
      </Animated.View>

      <Text style={styles.processingTitle}>Analyzing your feet...</Text>
      <Text style={styles.processingSubtitle}>
        Our AI is measuring your foot dimensions
      </Text>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );

  const renderResults = () => {
    if (!measurements) return null;

    const archLabel = {
      flat: "Flat Arch",
      neutral: "Neutral Arch",
      high: "High Arch",
    };

    const footLabel = {
      narrow: "Narrow",
      normal: "Normal",
      wide: "Wide",
    };

    return (
      <View style={styles.stepContainer}>
        <View style={styles.resultsContent}>
          <View style={styles.successIcon}>
            <Check size={32} color={Colors.white} />
          </View>
          <Text style={styles.resultsTitle}>Scan Complete!</Text>

          <View style={styles.sizeCard}>
            <Text style={styles.sizeLabel}>Your Recommended Size</Text>
            <Text style={styles.sizeValue}>US {measurements.recommendedSize}</Text>
          </View>

          <View style={styles.measurementsGrid}>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>Left Foot</Text>
              <Text style={styles.measurementValue}>
                {measurements.leftLength} × {measurements.leftWidth} cm
              </Text>
            </View>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>Right Foot</Text>
              <Text style={styles.measurementValue}>
                {measurements.rightLength} × {measurements.rightWidth} cm
              </Text>
            </View>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>Arch Type</Text>
              <Text style={styles.measurementValue}>
                {archLabel[measurements.archType]}
              </Text>
            </View>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>Foot Width</Text>
              <Text style={styles.measurementValue}>
                {footLabel[measurements.footType]}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.resultsButtons}>
          <Pressable style={styles.secondaryButton} onPress={handleRescan}>
            <RefreshCw size={18} color={Colors.text} />
            <Text style={styles.secondaryButtonText}>Rescan</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.primaryButtonText}>Save Results</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={Colors.text} />
        </Pressable>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step !== "intro" && styles.stepDotActive]} />
          <View style={[styles.stepDot, (step === "right" || step === "processing" || step === "results") && styles.stepDotActive]} />
          <View style={[styles.stepDot, (step === "processing" || step === "results") && styles.stepDotActive]} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      {step === "intro" && renderIntro()}
      {step === "left" && renderScanStep("left")}
      {step === "right" && renderScanStep("right")}
      {step === "processing" && renderProcessing()}
      {step === "results" && renderResults()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  stepIndicator: {
    flexDirection: "row",
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  stepDotActive: {
    backgroundColor: Colors.accent,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  introContent: {
    flex: 1,
    justifyContent: "center",
  },
  introIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 28,
    color: Colors.text,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  instructionsList: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionNumberText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: "700",
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
  },
  primaryButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "700",
  },
  scanContent: {
    flex: 1,
    justifyContent: "center",
  },
  cameraPlaceholder: {
    aspectRatio: 3 / 4,
    maxHeight: "60%",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    alignSelf: "center",
    width: SCREEN_WIDTH - 80,
  },
  cameraFrame: {
    flex: 1,
    margin: 20,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.accent,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  footOutline: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  referenceCard: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  referenceText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  scanTitle: {
    fontSize: 22,
    color: Colors.text,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  scanSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  processingIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  processingTitle: {
    fontSize: 22,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 8,
  },
  processingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  progressContainer: {
    width: "80%",
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  resultsContent: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 24,
  },
  sizeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 48,
    alignItems: "center",
    marginBottom: 24,
  },
  sizeLabel: {
    fontSize: 13,
    color: Colors.accentLight,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sizeValue: {
    fontSize: 42,
    color: Colors.white,
    fontWeight: "800",
    marginTop: 4,
  },
  measurementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
  },
  measurementCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  measurementLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "600",
  },
  resultsButtons: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 16,
    paddingVertical: 18,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "600",
  },
});
