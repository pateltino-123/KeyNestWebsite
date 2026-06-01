import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Footprints, ChevronRight, Sparkles } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useUser, useRecommendedShoes } from "@/contexts/UserContext";
import { brandSizingTips } from "@/mocks/sizingTips";

import ShoeCard from "@/components/ShoeCard";
import MeasurementDisplay from "@/components/MeasurementDisplay";
import AnimatedListItem from "@/components/AnimatedListItem";
import { shoes } from "@/mocks/shoes";
import { useTheme } from "@/contexts/ThemeContext";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { measurements, profile } = useUser();
  const { colors } = useTheme();
  const scanButtonScale = React.useRef(new Animated.Value(1)).current;
  const glowOpacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [glowOpacity]);

  const recommendedShoes = useRecommendedShoes(shoes);

  const popularShoes = React.useMemo(() => {
    return shoes.filter(s => s.rating >= 4.7).slice(0, 12);
  }, []);
  const popularLoading = false;
  const popularError = null;

  React.useEffect(() => {
    if (popularError) {
      console.error("[Home] Popular shoes error:", popularError);
    }
  }, [popularError]);

  const handleScanPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/scan" as never);
  };

  const handlePressIn = () => {
    Animated.spring(scanButtonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scanButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const randomTip = brandSizingTips[Math.floor(Math.random() * brandSizingTips.length)];

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {profile?.name ? `Hi, ${profile.name}` : "Welcome to"}
            </Text>
            <Text style={[styles.appName, { color: colors.primary }]}>ShoeFit</Text>
          </View>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200" }}
            style={[styles.logoImage, { backgroundColor: colors.surfaceAlt }]}
            contentFit="cover"
          />
        </View>

        <Animated.View style={{ transform: [{ scale: scanButtonScale }] }}>
          <Animated.View style={[styles.scanButtonGlow, { opacity: glowOpacity, backgroundColor: colors.primary }]} />
          <Pressable
            style={[styles.scanButton, { backgroundColor: colors.primary }]}
            onPress={handleScanPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={styles.scanButtonContent}>
              <View style={styles.scanIconContainer}>
                <Footprints size={32} color={colors.white} />
              </View>
              <View style={styles.scanTextContainer}>
                <Text style={[styles.scanButtonTitle, { color: colors.white }]}>
                  {measurements ? "Rescan Your Feet" : "Scan Your Feet"}
                </Text>
                <Text style={[styles.scanButtonSubtitle, { color: colors.accentLight }]}>
                  {measurements
                    ? "Update your measurements"
                    : "Get personalized size recommendations"}
                </Text>
              </View>
              <ChevronRight size={24} color={colors.accentLight} />
            </View>
          </Pressable>
        </Animated.View>

        {measurements && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Measurements</Text>
            <MeasurementDisplay measurements={measurements} compact />
          </View>
        )}

        <View style={[styles.tipBanner, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
          <Sparkles size={18} color={colors.accent} />
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>{randomTip.tip}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended For You</Text>
            <Pressable onPress={() => router.push("/browse")}>
              <Text style={[styles.seeAllText, { color: colors.accent }]}>See All</Text>
            </Pressable>
          </View>
          {recommendedShoes.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>No recommendations available</Text>
            </View>
          ) : (
            <View style={styles.shoesGrid}>
              {recommendedShoes.slice(0, 6).map((shoe, idx) => (
                <AnimatedListItem key={shoe.id} index={idx} style={styles.shoeCardWrapper}>
                  <ShoeCard shoe={shoe} />
                </AnimatedListItem>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular Picks</Text>
          {popularLoading ? (
            <View style={styles.loadingContainerHorizontal}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : (
            popularShoes.length === 0 ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.textMuted }]}>No popular picks available</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {popularShoes.slice(0, 6).map((shoe) => (
                  <ShoeCard key={shoe.id} shoe={shoe} variant="compact" />
                ))}
              </ScrollView>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  appName: {
    fontSize: 32,
    color: Colors.primary,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceAlt,
  },
  scanButtonGlow: {
    position: "absolute",
    top: -4,
    left: 10,
    right: 10,
    bottom: -4,
    borderRadius: 24,
    zIndex: -1,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scanButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  scanIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  scanButtonTitle: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: "700",
  },
  scanButtonSubtitle: {
    fontSize: 13,
    color: Colors.accentLight,
    marginTop: 4,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "600",
  },
  tipBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  shoesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  shoeCardWrapper: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  horizontalScroll: {
    gap: 12,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingContainerHorizontal: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
