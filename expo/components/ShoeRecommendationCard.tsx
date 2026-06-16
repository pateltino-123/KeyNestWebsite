import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { Star, ExternalLink } from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { Shoe } from "@/mocks/shoes";

interface ShoeRecommendationCardProps {
  shoe: Shoe;
}

export default React.memo(function ShoeRecommendationCard({ shoe }: ShoeRecommendationCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(`/shoe/${shoe.id}`);
  };

  const hasValidImage = shoe.images[0] && !shoe.images[0].includes("placeholder");

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderLight,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      {hasValidImage && (
        <View style={[styles.imageContainer, { backgroundColor: colors.surfaceAlt }]}>
          <Image
            source={{ uri: shoe.images[0] }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.brand, { color: colors.primary }]}>{shoe.brand}</Text>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {shoe.name}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.price, { color: colors.accent }]}>${shoe.price}</Text>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <Text style={[styles.rating, { color: colors.textSecondary }]}>
              {shoe.rating}
            </Text>
          </View>
        </View>
        {shoe.sizingTip && (
          <Text style={[styles.sizingTip, { color: colors.textMuted }]} numberOfLines={1}>
            {shoe.sizingTip}
          </Text>
        )}
      </View>
      <View style={[styles.viewButton, { backgroundColor: `${colors.primary}15` }]}>
        <ExternalLink size={14} color={colors.primary} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    gap: 12,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: 56,
    height: 56,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  brand: {
    fontSize: 11,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rating: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
  sizingTip: {
    fontSize: 11,
    fontStyle: "italic" as const,
    marginTop: 1,
  },
  viewButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
