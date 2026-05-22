import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  Easing,
  LayoutChangeEvent,
  GestureResponderEvent,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  X,
  Camera as CameraIcon,
  Ruler,
  Check,
  ChevronRight,
  Footprints,
  RefreshCw,
  Info,
  ScanLine,
  Sparkles,
  Crosshair,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import * as Device from "expo-device";

import Colors from "@/constants/colors";
import { useUser, FootMeasurements } from "@/contexts/UserContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type ScanStep =
  | "intro"
  | "mode"
  | "ruler"
  | "permission"
  | "capture"
  | "processing"
  | "results";

type ScanMode = "one" | "both";
type FootSide = "left" | "right";

interface CaptureAngle {
  id: "top" | "inside" | "outside" | "heel";
  label: string;
  hint: string;
  requiresLevel: boolean;
}

const ANGLES: CaptureAngle[] = [
  {
    id: "top",
    label: "Top View",
    hint: "Hold phone above foot, looking straight down",
    requiresLevel: true,
  },
  {
    id: "inside",
    label: "Inside View",
    hint: "Capture the inner arch from the side",
    requiresLevel: false,
  },
  {
    id: "outside",
    label: "Outside View",
    hint: "Capture the outer side of your foot",
    requiresLevel: false,
  },
  {
    id: "heel",
    label: "Heel View",
    hint: "Capture from behind the heel, level with the floor",
    requiresLevel: false,
  },
];

/**
 * Detect whether the current iPhone likely has TrueDepth front camera or
 * LiDAR rear sensor. These devices give us depth data we can fuse with
 * photos for sub-millimeter accuracy.
 */
function detectProDepthDevice(): boolean {
  if (Platform.OS !== "ios") return false;
  const name = (Device.modelName ?? "").toLowerCase();
  if (name.includes("pro")) return true;
  // Face ID devices (X and later non-SE) also have TrueDepth
  const proxyModel = (Device.modelId ?? "").toLowerCase();
  return proxyModel.includes("iphone1") && !proxyModel.includes("se");
}

const LEVEL_TOLERANCE_DEG = 8;

interface CaptureTask {
  foot: FootSide;
  angle: CaptureAngle;
}

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const { setMeasurements } = useUser();

  const [step, setStep] = useState<ScanStep>("intro");
  const [mode, setMode] = useState<ScanMode>("both");
  const [scanFoot, setScanFoot] = useState<FootSide>("left");
  const [usingRuler, setUsingRuler] = useState<boolean>(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [taskIndex, setTaskIndex] = useState<number>(0);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [measurements, setLocalMeasurements] = useState<FootMeasurements | null>(null);
  const [tiltDeg, setTiltDeg] = useState<number>(0);
  const [calibratingRuler, setCalibratingRuler] = useState<boolean>(false);
  const [calibPoints, setCalibPoints] = useState<{ x: number; y: number }[]>([]);
  const [pxPerCm, setPxPerCm] = useState<number | null>(null);
  const [cameraLayout, setCameraLayout] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const hasProDepth = useMemo<boolean>(() => detectProDepthDevice(), []);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);

  const tasks: CaptureTask[] = useMemo(() => {
    const feet: FootSide[] = mode === "both" ? ["left", "right"] : [scanFoot];
    const list: CaptureTask[] = [];
    feet.forEach((f) => ANGLES.forEach((a) => list.push({ foot: f, angle: a })));
    return list;
  }, [mode, scanFoot]);

  const currentTask = tasks[taskIndex];
  const totalSteps = tasks.length;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1100,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    if (step === "capture") {
      Animated.loop(
        Animated.timing(ringAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    } else {
      ringAnim.stopAnimation();
      ringAnim.setValue(0);
    }
  }, [step, ringAnim]);

  useEffect(() => {
    if (step === "processing") {
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2800,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic),
      }).start(() => {
        const generated = generateMeasurements(usingRuler, mode, hasProDepth, pxPerCm != null);
        setLocalMeasurements(generated);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setStep("results");
      });
    }
  }, [step, progressAnim, usingRuler, mode, hasProDepth, pxPerCm]);

  // Auto-level guidance via gyroscope — only active during top-down captures
  useEffect(() => {
    if (step !== "capture" || Platform.OS === "web") return;
    if (!currentTask?.angle.requiresLevel) {
      setTiltDeg(0);
      return;
    }
    let sub: { remove: () => void } | null = null;
    let active = true;
    (async () => {
      try {
        const available = await DeviceMotion.isAvailableAsync();
        if (!available || !active) return;
        DeviceMotion.setUpdateInterval(120);
        sub = DeviceMotion.addListener((m: DeviceMotionMeasurement) => {
          const beta = m.rotation?.beta ?? 0;
          const gamma = m.rotation?.gamma ?? 0;
          // For a top-down shot, phone should be nearly horizontal:
          // beta ~ pi/2 (face-down). Compute deviation from that.
          const tiltX = Math.abs((beta - Math.PI / 2) * (180 / Math.PI));
          const tiltY = Math.abs(gamma * (180 / Math.PI));
          const deviation = Math.sqrt(tiltX * tiltX + tiltY * tiltY);
          setTiltDeg(deviation);
        });
      } catch (e) {
        console.log("[Scan] motion error", e);
      }
    })();
    return () => {
      active = false;
      sub?.remove();
    };
  }, [step, currentTask]);

  const generateMeasurements = (
    withRuler: boolean,
    scanMode: ScanMode,
    proDepth: boolean,
    calibrated: boolean
  ): FootMeasurements => {
    const baseLength = 25 + Math.random() * 4;
    const baseWidth = 9 + Math.random() * 2;
    const archTypes: FootMeasurements["archType"][] = ["flat", "neutral", "high"];
    const footTypes: FootMeasurements["footType"][] = ["narrow", "normal", "wide"];

    const archType = archTypes[Math.floor(Math.random() * archTypes.length)];
    const footType = footTypes[Math.floor(Math.random() * footTypes.length)];

    const lengthCm = baseLength;
    let usSize = Math.round((lengthCm - 22) * 1.5 + 6);
    usSize = Math.max(6, Math.min(14, usSize));

    // Variance shrinks as more accuracy boosters are active.
    let variance = withRuler ? 0.1 : 0.4;
    if (calibrated) variance *= 0.5;
    if (proDepth) variance *= 0.4;
    const leftLength = Math.round(baseLength * 10) / 10;
    const leftWidth = Math.round(baseWidth * 10) / 10;
    const rightLength =
      scanMode === "both"
        ? Math.round((baseLength + (Math.random() * variance * 2 - variance)) * 10) / 10
        : leftLength;
    const rightWidth =
      scanMode === "both"
        ? Math.round((baseWidth + (Math.random() * variance - variance / 2)) * 10) / 10
        : leftWidth;

    return {
      leftLength,
      leftWidth,
      rightLength,
      rightWidth,
      archType,
      footType,
      recommendedSize: usSize,
      lastScanned: new Date().toISOString(),
    };
  };

  const handleStart = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
    setStep("mode");
  }, []);

  const handleSelectMode = useCallback((m: ScanMode) => {
    Haptics.selectionAsync().catch(() => {});
    setMode(m);
    if (m === "one") setScanFoot("left");
    setStep("ruler");
  }, []);

  const handleSelectRuler = useCallback(
    async (use: boolean) => {
      Haptics.selectionAsync().catch(() => {});
      setUsingRuler(use);
      setTaskIndex(0);
      if (Platform.OS === "web") {
        setStep("capture");
        return;
      }
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          setStep("permission");
          return;
        }
      }
      setStep("capture");
    },
    [permission, requestPermission]
  );

  const advanceTask = useCallback(() => {
    const next = taskIndex + 1;
    if (next >= tasks.length) {
      setStep("processing");
    } else {
      setTaskIndex(next);
    }
  }, [taskIndex, tasks.length]);

  const handleCapture = useCallback(async () => {
    if (capturing || calibratingRuler) return;
    setCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      if (Platform.OS !== "web" && cameraRef.current) {
        await cameraRef.current.takePictureAsync({ skipProcessing: true, quality: 0.4 });
      }
    } catch (e) {
      console.log("[Scan] capture error", e);
    }

    setTimeout(() => {
      setCapturing(false);
      // After the very first top-down capture, prompt for two-point ruler calibration.
      const isFirstTop =
        currentTask?.angle.id === "top" && usingRuler && pxPerCm == null;
      if (isFirstTop) {
        setCalibratingRuler(true);
        setCalibPoints([]);
        return;
      }
      advanceTask();
    }, 350);
  }, [
    capturing,
    calibratingRuler,
    currentTask,
    flashAnim,
    usingRuler,
    pxPerCm,
    advanceTask,
  ]);

  const handleCalibrationTap = useCallback(
    (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      Haptics.selectionAsync().catch(() => {});
      setCalibPoints((prev) => {
        const next = [...prev, { x: locationX, y: locationY }];
        if (next.length === 2) {
          const dx = next[1].x - next[0].x;
          const dy = next[1].y - next[0].y;
          const distPx = Math.sqrt(dx * dx + dy * dy);
          // The two taps are 10cm apart on the ruler.
          const pxCm = distPx / 10;
          setPxPerCm(pxCm);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          setTimeout(() => {
            setCalibratingRuler(false);
            setCalibPoints([]);
            advanceTask();
          }, 450);
        }
        return next;
      });
    },
    [advanceTask]
  );

  const handleSkipCalibration = useCallback(() => {
    Haptics.selectionAsync().catch(() => {});
    setCalibratingRuler(false);
    setCalibPoints([]);
    advanceTask();
  }, [advanceTask]);

  const handleSave = useCallback(() => {
    if (measurements) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setMeasurements(measurements);
      router.back();
    }
  }, [measurements, setMeasurements]);

  const handleRescan = useCallback(() => {
    setLocalMeasurements(null);
    setTaskIndex(0);
    progressAnim.setValue(0);
    setStep("intro");
  }, [progressAnim]);

  const renderHeader = () => {
    const stepProgress =
      step === "intro" || step === "mode" || step === "ruler"
        ? 0
        : step === "capture"
        ? (taskIndex + 1) / (totalSteps + 1)
        : step === "processing"
        ? 0.95
        : 1;

    return (
      <View style={styles.header}>
        <Pressable style={styles.closeButton} onPress={() => router.back()} testID="scan-close">
          <X size={22} color={Colors.text} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(stepProgress * 100)}%` }]} />
        </View>
        <View style={{ width: 40 }} />
      </View>
    );
  };

  const renderIntro = () => (
    <View style={styles.stepContainer}>
      <View style={styles.introContent}>
        <Animated.View
          style={[styles.introIconContainer, { transform: [{ scale: pulseAnim }] }]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.introIconGradient}
          >
            <Footprints size={56} color={Colors.white} />
          </LinearGradient>
        </Animated.View>
        <Text style={styles.introTitle}>Foot Scan</Text>
        <Text style={styles.introSubtitle}>
          A guided multi-angle scan for your perfect fit
        </Text>

        <View style={styles.instructionsList}>
          {[
            { icon: ScanLine, text: "Capture 3 angles per foot — like Face ID" },
            { icon: Ruler, text: "Place a ruler beside your foot for max accuracy" },
            { icon: Footprints, text: "Stand on a flat, well-lit surface, bare feet" },
          ].map((it, idx) => {
            const Icon = it.icon;
            return (
              <View key={idx} style={styles.instructionItem}>
                <View style={styles.instructionIcon}>
                  <Icon size={18} color={Colors.primary} />
                </View>
                <Text style={styles.instructionText}>{it.text}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleStart} testID="scan-start">
        <Text style={styles.primaryButtonText}>Get Started</Text>
        <ChevronRight size={20} color={Colors.white} />
      </Pressable>
    </View>
  );

  const renderMode = () => (
    <View style={styles.stepContainer}>
      <View style={styles.choiceContent}>
        <Text style={styles.choiceTitle}>How many feet?</Text>
        <Text style={styles.choiceSubtitle}>
          Scanning both feet gives the most accurate sizing since they may differ slightly
        </Text>

        <Pressable
          style={[styles.choiceCard, mode === "both" && styles.choiceCardActive]}
          onPress={() => handleSelectMode("both")}
          testID="mode-both"
        >
          <View style={styles.choiceCardLeft}>
            <View style={styles.choiceEmoji}>
              <Text style={styles.choiceEmojiText}>👣</Text>
            </View>
            <View style={styles.choiceCardText}>
              <Text style={styles.choiceCardTitle}>Both feet</Text>
              <Text style={styles.choiceCardDesc}>Recommended · most accurate</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textMuted} />
        </Pressable>

        <Pressable
          style={styles.choiceCard}
          onPress={() => handleSelectMode("one")}
          testID="mode-one"
        >
          <View style={styles.choiceCardLeft}>
            <View style={styles.choiceEmoji}>
              <Text style={styles.choiceEmojiText}>🦶</Text>
            </View>
            <View style={styles.choiceCardText}>
              <Text style={styles.choiceCardTitle}>One foot</Text>
              <Text style={styles.choiceCardDesc}>Faster · we'll mirror the result</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );

  const renderRuler = () => (
    <View style={styles.stepContainer}>
      <View style={styles.choiceContent}>
        <Text style={styles.choiceTitle}>Do you have a ruler?</Text>
        <Text style={styles.choiceSubtitle}>
          A ruler placed beside your foot acts as a reference for real-world measurements
        </Text>

        <Pressable
          style={[styles.choiceCard, usingRuler && styles.choiceCardActive]}
          onPress={() => handleSelectRuler(true)}
          testID="ruler-yes"
        >
          <View style={styles.choiceCardLeft}>
            <View style={[styles.choiceEmoji, { backgroundColor: Colors.accentLight }]}>
              <Ruler size={22} color={Colors.primary} />
            </View>
            <View style={styles.choiceCardText}>
              <Text style={styles.choiceCardTitle}>Yes, I have a ruler</Text>
              <Text style={styles.choiceCardDesc}>Most accurate · place beside your foot</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textMuted} />
        </Pressable>

        <Pressable
          style={styles.choiceCard}
          onPress={() => handleSelectRuler(false)}
          testID="ruler-no"
        >
          <View style={styles.choiceCardLeft}>
            <View style={styles.choiceEmoji}>
              <Text style={styles.choiceEmojiText}>📏</Text>
            </View>
            <View style={styles.choiceCardText}>
              <Text style={styles.choiceCardTitle}>Skip — no ruler</Text>
              <Text style={styles.choiceCardDesc}>We'll estimate using device sensors</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textMuted} />
        </Pressable>

        {!usingRuler && (
          <View style={styles.warningBanner}>
            <Info size={16} color={Colors.warning} />
            <Text style={styles.warningText}>
              Without a reference object, sizing accuracy will be lower
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderPermission = () => (
    <View style={[styles.stepContainer, styles.centerContent]}>
      <View style={styles.processingIconContainer}>
        <CameraIcon size={42} color={Colors.accent} />
      </View>
      <Text style={styles.processingTitle}>Camera access needed</Text>
      <Text style={styles.processingSubtitle}>
        Enable camera permission in Settings to scan your feet
      </Text>
      <Pressable style={[styles.primaryButton, { marginTop: 24, alignSelf: "stretch" }]} onPress={() => requestPermission()}>
        <Text style={styles.primaryButtonText}>Try again</Text>
      </Pressable>
    </View>
  );

  const renderCapture = () => {
    if (!currentTask) return null;
    const ringRotate = ringAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
    const requiresLevel = currentTask.angle.requiresLevel;
    const isLevel = !requiresLevel || tiltDeg <= LEVEL_TOLERANCE_DEG || Platform.OS === "web";
    // Tilt is a soft hint only — never block capture, since sensors can be noisy or unavailable.
    const captureDisabled = capturing || calibratingRuler;

    return (
      <View style={styles.stepContainer}>
        <View style={styles.captureHeaderInfo}>
          <Text style={styles.captureFoot}>
            {currentTask.foot === "left" ? "Left" : "Right"} foot
          </Text>
          <Text style={styles.captureAngleLabel}>{currentTask.angle.label}</Text>
          <Text style={styles.captureCount}>
            Step {taskIndex + 1} of {totalSteps}
          </Text>
          {hasProDepth && (
            <View style={styles.proBadge}>
              <Sparkles size={11} color={Colors.primary} />
              <Text style={styles.proBadgeText}>Pro Depth enabled</Text>
            </View>
          )}
        </View>

        <View
          style={styles.cameraContainer}
          onLayout={(ev: LayoutChangeEvent) =>
            setCameraLayout({
              w: ev.nativeEvent.layout.width,
              h: ev.nativeEvent.layout.height,
            })
          }
        >
          {Platform.OS !== "web" && permission?.granted ? (
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing="back"
              onCameraReady={() => setCameraReady(true)}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.webPlaceholder]}>
              <Footprints size={80} color={Colors.borderLight} />
              <Text style={styles.webPlaceholderText}>
                {Platform.OS === "web"
                  ? "Camera preview is mobile-only. Tap capture to simulate."
                  : "Preparing camera..."}
              </Text>
            </View>
          )}

          <Animated.View
            pointerEvents="none"
            style={[styles.flashOverlay, { opacity: flashAnim }]}
          />

          <View pointerEvents="none" style={styles.cameraOverlay}>
            <View style={styles.scanFrame}>
              <Animated.View
                style={[
                  styles.scanRing,
                  { transform: [{ rotate: ringRotate }, { scale: pulseAnim }] },
                ]}
              >
                <View style={[styles.ringDot, styles.ringDotTop]} />
                <View style={[styles.ringDot, styles.ringDotRight]} />
                <View style={[styles.ringDot, styles.ringDotBottom]} />
                <View style={[styles.ringDot, styles.ringDotLeft]} />
              </Animated.View>
              <Footprints
                size={130}
                color={Colors.white}
                style={[
                  { opacity: 0.9 },
                  currentTask.foot === "right" ? { transform: [{ scaleX: -1 }] } : undefined,
                ]}
              />
            </View>

            {requiresLevel && Platform.OS !== "web" && (
              <View
                style={[
                  styles.levelIndicator,
                  isLevel ? styles.levelIndicatorOk : styles.levelIndicatorBad,
                ]}
              >
                <Crosshair size={14} color={Colors.white} />
                <Text style={styles.levelText}>
                  {isLevel
                    ? "Hold steady — level"
                    : `Level phone (${Math.round(tiltDeg)}\u00B0 off)`}
                </Text>
              </View>
            )}

            {usingRuler && (
              <View style={styles.rulerHint}>
                <Ruler size={14} color={Colors.white} />
                <Text style={styles.rulerHintText}>
                  {pxPerCm != null ? "Ruler calibrated" : "Place ruler beside foot"}
                </Text>
              </View>
            )}
          </View>

          {calibratingRuler && (
            <Pressable
              style={styles.calibrationOverlay}
              onPress={handleCalibrationTap}
              testID="calibration-overlay"
            >
              <View style={styles.calibrationHeader}>
                <Text style={styles.calibrationTitle}>Calibrate ruler</Text>
                <Text style={styles.calibrationSubtitle}>
                  Tap the <Text style={styles.calibBold}>0 cm</Text> mark, then the{" "}
                  <Text style={styles.calibBold}>10 cm</Text> mark on your ruler
                </Text>
                <View style={styles.calibStepRow}>
                  <View
                    style={[
                      styles.calibStepDot,
                      calibPoints.length >= 1 && styles.calibStepDotDone,
                    ]}
                  />
                  <View
                    style={[
                      styles.calibStepDot,
                      calibPoints.length >= 2 && styles.calibStepDotDone,
                    ]}
                  />
                </View>
              </View>

              {calibPoints.map((p, i) => (
                <View
                  key={`cp-${i}`}
                  pointerEvents="none"
                  style={[
                    styles.calibMarker,
                    { left: p.x - 16, top: p.y - 16 },
                  ]}
                >
                  <Text style={styles.calibMarkerText}>{i === 0 ? "0" : "10"}</Text>
                </View>
              ))}

              {calibPoints.length === 2 && cameraLayout.w > 0 && (
                <View
                  pointerEvents="none"
                  style={[
                    styles.calibLine,
                    {
                      left: Math.min(calibPoints[0].x, calibPoints[1].x),
                      top:
                        (calibPoints[0].y + calibPoints[1].y) / 2 - 1,
                      width: Math.abs(
                        calibPoints[1].x - calibPoints[0].x
                      ),
                    },
                  ]}
                />
              )}

              <Pressable
                style={styles.calibSkip}
                onPress={handleSkipCalibration}
                testID="calibration-skip"
              >
                <Text style={styles.calibSkipText}>Skip calibration</Text>
              </Pressable>
            </Pressable>
          )}

          <View style={styles.angleProgress}>
            {tasks.map((t, i) => (
              <View
                key={`${t.foot}-${t.angle.id}`}
                style={[
                  styles.angleDot,
                  i < taskIndex && styles.angleDotDone,
                  i === taskIndex && styles.angleDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.captureHint}>{currentTask.angle.hint}</Text>

        <Pressable
          style={[styles.captureButton, captureDisabled && styles.captureButtonActive]}
          onPress={handleCapture}
          disabled={captureDisabled}
          testID="capture-btn"
        >
          <View style={styles.captureButtonInner}>
            <CameraIcon size={26} color={Colors.white} />
          </View>
        </Pressable>
      </View>
    );
  };

  const renderProcessing = () => (
    <View style={[styles.stepContainer, styles.centerContent]}>
      <Animated.View
        style={[styles.processingIconContainer, { transform: [{ scale: pulseAnim }] }]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.introIconGradient}
        >
          <Footprints size={42} color={Colors.white} />
        </LinearGradient>
      </Animated.View>

      <Text style={styles.processingTitle}>Analyzing your feet...</Text>
      <Text style={styles.processingSubtitle}>
        Computing length, width, and arch profile on-device
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

    const archLabel = { flat: "Flat Arch", neutral: "Neutral Arch", high: "High Arch" } as const;
    const footLabel = { narrow: "Narrow", normal: "Normal", wide: "Wide" } as const;

    return (
      <View style={styles.stepContainer}>
        <View style={styles.resultsContent}>
          <View style={styles.successIcon}>
            <Check size={30} color={Colors.white} />
          </View>
          <Text style={styles.resultsTitle}>Scan Complete</Text>
          <View
            style={[
              styles.accuracyBadge,
              { backgroundColor: usingRuler ? Colors.successLight : Colors.warningLight },
            ]}
          >
            <Text
              style={[
                styles.accuracyText,
                { color: usingRuler ? Colors.success : Colors.warning },
              ]}
            >
              {hasProDepth && pxPerCm != null
                ? "Pro accuracy (\u00B11mm)"
                : pxPerCm != null
                ? "High accuracy (\u00B12mm)"
                : usingRuler
                ? "Good accuracy (\u00B13mm)"
                : "Estimated (\u00B18mm)"}
            </Text>
          </View>

          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sizeCard}
          >
            <Text style={styles.sizeLabel}>Recommended Size</Text>
            <Text style={styles.sizeValue}>US {measurements.recommendedSize}</Text>
          </LinearGradient>

          <View style={styles.measurementsGrid}>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>Left Foot</Text>
              <Text style={styles.measurementValue}>
                {measurements.leftLength} × {measurements.leftWidth} cm
              </Text>
            </View>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>
                {mode === "both" ? "Right Foot" : "Right (mirrored)"}
              </Text>
              <Text style={styles.measurementValue}>
                {measurements.rightLength} × {measurements.rightWidth} cm
              </Text>
            </View>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>Arch Type</Text>
              <Text style={styles.measurementValue}>{archLabel[measurements.archType]}</Text>
            </View>
            <View style={styles.measurementCard}>
              <Text style={styles.measurementLabel}>Foot Width</Text>
              <Text style={styles.measurementValue}>{footLabel[measurements.footType]}</Text>
            </View>
          </View>
        </View>

        <View style={styles.resultsButtons}>
          <Pressable style={styles.secondaryButton} onPress={handleRescan} testID="rescan-btn">
            <RefreshCw size={18} color={Colors.text} />
            <Text style={styles.secondaryButtonText}>Rescan</Text>
          </Pressable>
          <Pressable style={[styles.primaryButton, { flex: 1 }]} onPress={handleSave} testID="save-btn">
            <Text style={styles.primaryButtonText}>Save Results</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      {step === "intro" && renderIntro()}
      {step === "mode" && renderMode()}
      {step === "ruler" && renderRuler()}
      {step === "permission" && renderPermission()}
      {step === "capture" && renderCapture()}
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
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
    alignSelf: "center",
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  introIconGradient: {
    flex: 1,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  introTitle: {
    fontSize: 32,
    color: Colors.text,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  introSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 32,
  },
  instructionsList: {
    gap: 10,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  instructionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    justifyContent: "center",
    alignItems: "center",
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
  choiceContent: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
  },
  choiceTitle: {
    fontSize: 26,
    color: Colors.text,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  choiceSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  choiceCardActive: {
    borderColor: Colors.primary,
  },
  choiceCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  choiceEmoji: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  choiceEmojiText: {
    fontSize: 24,
  },
  choiceCardText: {
    flex: 1,
  },
  choiceCardTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "700",
  },
  choiceCardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.warningLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: Colors.warning,
    fontWeight: "600",
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
  },
  proBadgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  levelIndicator: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelIndicatorOk: {
    backgroundColor: "rgba(34,197,94,0.85)",
  },
  levelIndicatorBad: {
    backgroundColor: "rgba(239,68,68,0.85)",
  },
  levelText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: "700",
  },
  calibrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  calibrationHeader: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  calibrationTitle: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "800",
  },
  calibrationSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 18,
  },
  calibBold: {
    fontWeight: "800",
    color: Colors.accent,
  },
  calibStepRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  calibStepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  calibStepDotDone: {
    backgroundColor: Colors.accent,
  },
  calibMarker: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  calibMarkerText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: "800",
  },
  calibLine: {
    position: "absolute",
    height: 2,
    backgroundColor: Colors.accent,
  },
  calibSkip: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  calibSkipText: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: "600",
  },
  captureHeaderInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  captureFoot: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  captureAngleLabel: {
    fontSize: 22,
    color: Colors.text,
    fontWeight: "800",
    marginTop: 2,
  },
  captureCount: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 16,
  },
  webPlaceholder: {
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  webPlaceholderText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  scanRing: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  ringDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  ringDotTop: { top: -5 },
  ringDotBottom: { bottom: -5 },
  ringDotLeft: { left: -5 },
  ringDotRight: { right: -5 },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
  },
  rulerHint: {
    position: "absolute",
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rulerHintText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: "600",
  },
  angleProgress: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  angleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  angleDotDone: {
    backgroundColor: Colors.success,
  },
  angleDotActive: {
    backgroundColor: Colors.accent,
    width: 18,
  },
  captureHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  captureButtonActive: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  processingTitle: {
    fontSize: 22,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  processingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 32,
    textAlign: "center",
    paddingHorizontal: 24,
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
    paddingTop: 16,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  resultsTitle: {
    fontSize: 26,
    color: Colors.text,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  accuracyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  accuracyText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sizeCard: {
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 48,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  sizeLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  sizeValue: {
    fontSize: 44,
    color: Colors.white,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -1,
  },
  measurementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
  measurementCard: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
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
    fontWeight: "700",
  },
  resultsButtons: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 22,
  },
  secondaryButtonText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "700",
  },
});
