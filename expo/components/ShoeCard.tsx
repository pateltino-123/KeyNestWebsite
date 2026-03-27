import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { Heart, AlertTriangle } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Shoe } from "@/mocks/shoes";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop";

interface ShoeCardProps {
  shoe: Shoe;
  variant?: "default" | "compact" | "horizontal";
  showSizingAlert?: boolean;
}

export default function ShoeCard({ shoe, variant = "default", showSizingAlert = true }: ShoeCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist, measurements } = useUser();
  const { colors } = useTheme();
  const imageUri = shoe.images[0] || FALLBACK_IMAGE;
  const isWishlisted = isInWishlist(shoe.id);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/shoe/${shoe.id}` as never);
  }, [shoe.id]);

  const handleWishlistToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isWishlisted) {
      removeFromWishlist(shoe.id);
    } else {
      addToWishlist(shoe.id);
    }
  }, [isWishlisted, shoe.id, addToWishlist, removeFromWishlist]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const showAlert = showSizingAlert && measurements && (
    (measurements.footType === "wide" && shoe.widthFit === "narrow") ||
    (measurements.footType === "narrow" && shoe.widthFit === "wide") ||
    shoe.runsSmall ||
    shoe.runsLarge
  );

  const getAlertMessage = () => {
    if (measurements?.footType === "wide" && shoe.widthFit === "narrow") {
      return "May feel tight for wide feet";
    }
    if (shoe.runsSmall) {
      return "Runs small - size up";
    }
    if (shoe.runsLarge) {
      return "Runs large - size down";
    }
    return null;
  };

  if (variant === "horizontal") {
    return (
      <Animated.View style={[styles.horizontalCard, { transform: [{ scale: scaleAnim }], backgroundColor: colors.surface }]}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.horizontalPressable}
        >
          <Image
            source={{ uri: imageUri }}
            style={[styles.horizontalImage, { backgroundColor: colors.surfaceAlt }]}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.horizontalContent}>
            <Text style={[styles.brand, { color: colors.textSecondary }]}>{shoe.brand}</Text>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{shoe.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={[styles.rating, { color: colors.accent }]}>★ {shoe.rating.toFixed(1)}</Text>
            </View>
            {showAlert && (
              <View style={styles.alertBadgeSmall}>
                <AlertTriangle size={10} color={colors.warning} />
                <Text style={[styles.alertTextSmall, { color: colors.warning }]}>{getAlertMessage()}</Text>
              </View>
            )}
          </View>
          <Pressable onPress={handleWishlistToggle} style={styles.wishlistButton}>
            <Heart
              size={20}
              color={isWishlisted ? colors.error : colors.textMuted}
              fill={isWishlisted ? colors.error : "transparent"}
            />
          </Pressable>
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === "compact") {
    return (
      <Animated.View style={[styles.compactCard, { transform: [{ scale: scaleAnim }], backgroundColor: colors.surface }]}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Image
            source={{ uri: imageUri }}
            style={[styles.compactImage, { backgroundColor: colors.surfaceAlt }]}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.compactContent}>
            <Text style={[styles.compactBrand, { color: colors.textSecondary }]}>{shoe.brand}</Text>
            <Text style={[styles.compactName, { color: colors.text }]} numberOfLines={1}>{shoe.name}</Text>
            <Text style={[styles.compactRating, { color: colors.accent }]}>★ {shoe.rating.toFixed(1)}</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], backgroundColor: colors.surface }]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, { backgroundColor: colors.surfaceAlt }]}
            contentFit="cover"
            transition={200}
          />
          <Pressable onPress={handleWishlistToggle} style={styles.wishlistButtonAbsolute}>
            <Heart
              size={22}
              color={isWishlisted ? colors.error : colors.white}
              fill={isWishlisted ? colors.error : "transparent"}
            />
          </Pressable>
          {showAlert && (
            <View style={[styles.alertBadge, { backgroundColor: colors.warningLight }]}>
              <AlertTriangle size={12} color={colors.warning} />
              <Text style={[styles.alertText, { color: colors.text }]}>{getAlertMessage()}</Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={[styles.brand, { color: colors.textSecondary }]}>{shoe.brand}</Text>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{shoe.name}</Text>
          <View style={styles.bottomRow}>
            <View style={styles.ratingContainer}>
              <Text style={[styles.rating, { color: colors.accent }]}>★ {shoe.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
  },
  wishlistButtonAbsolute: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  alertText: {
    fontSize: 11,
    fontWeight: "500" as const,
    flex: 1,
  },
  content: {
    padding: 14,
  },
  brand: {
    fontSize: 12,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 15,
    fontWeight: "600" as const,
    marginTop: 4,
    lineHeight: 20,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  horizontalCard: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  horizontalPressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  horizontalImage: {
    width: 100,
    height: 100,
  },
  horizontalContent: {
    flex: 1,
    padding: 14,
  },
  wishlistButton: {
    padding: 14,
  },
  alertBadgeSmall: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  alertTextSmall: {
    fontSize: 10,
    fontWeight: "500" as const,
  },
  compactCard: {
    borderRadius: 12,
    overflow: "hidden",
    width: 140,
  },
  compactImage: {
    width: 140,
    height: 100,
  },
  compactContent: {
    padding: 10,
  },
  compactBrand: {
    fontSize: 10,
    fontWeight: "600" as const,
    textTransform: "uppercase",
  },
  compactName: {
    fontSize: 13,
    fontWeight: "600" as const,
    marginTop: 2,
  },
  compactRating: {
    fontSize: 12,
    fontWeight: "600" as const,
    marginTop: 4,
  },
});
