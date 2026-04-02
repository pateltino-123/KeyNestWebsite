import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Modal,
  Linking,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import {
  Heart,
  AlertTriangle,
  Star,
  ShoppingBag,
  MessageCircle,
  ChevronLeft,
  ExternalLink,
  X,
  Bell,
  TrendingDown,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { shoes as mockShoes, Shoe } from "@/mocks/shoes";
import { brandSizingTips } from "@/mocks/sizingTips";
import { useUser } from "@/contexts/UserContext";
import ReviewsModal from "@/components/ReviewsModal";
import { getProductById, mapKicksProductToShoe } from "@/services/kicksApi";
import { useTheme } from "@/contexts/ThemeContext";
import { generateDealInfo } from "@/mocks/priceData";
import DealScoreBadge from "@/components/DealScoreBadge";
import PriceChart from "@/components/PriceChart";
import RetailerComparison from "@/components/RetailerComparison";
import PriceAlertModal from "@/components/PriceAlertModal";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface BuyLink {
  name: string;
  url: string;
  icon: string;
}

const generateBuyLinks = (shoe: Shoe): BuyLink[] => {
  const searchQuery = encodeURIComponent(`${shoe.brand} ${shoe.name}`);
  const skuQuery = (shoe as any).sku ? encodeURIComponent((shoe as any).sku) : searchQuery;
  
  return [
    {
      name: "StockX",
      url: `https://stockx.com/search?s=${skuQuery}`,
      icon: "stockx",
    },
    {
      name: "GOAT",
      url: `https://www.goat.com/search?query=${searchQuery}`,
      icon: "goat",
    },
    {
      name: "Flight Club",
      url: `https://www.flightclub.com/catalogsearch/result/?q=${searchQuery}`,
      icon: "flightclub",
    },
  ];
};

export default function ShoeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { isInWishlist, addToWishlist, removeFromWishlist, measurements, getPriceAlert } = useUser();
  const { colors } = useTheme();
  const [showReviews, setShowReviews] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const cachedShoe = useMemo(() => {
    const allCachedShoes: Shoe[] = [];
    const queries = queryClient.getQueriesData<Shoe[]>({ queryKey: ["shoes"] });
    queries.forEach(([, data]) => {
      if (data) allCachedShoes.push(...data);
    });
    const trendingData = queryClient.getQueryData<Shoe[]>(["trending-shoes-under-200"]);
    if (trendingData) allCachedShoes.push(...trendingData);
    const popularData = queryClient.getQueryData<Shoe[]>(["popular-shoes-under-200"]);
    if (popularData) allCachedShoes.push(...popularData);
    
    return allCachedShoes.find((s) => s.id === id);
  }, [id, queryClient]);

  const mockShoe = useMemo(() => mockShoes.find((s) => s.id === id), [id]);

  const { data: apiShoe, isLoading } = useQuery({
    queryKey: ["shoe-detail", id],
    queryFn: async () => {
      if (!id) return null;
      console.log("[ShoeDetail] Fetching product:", id);
      const product = await getProductById(id);
      if (product) {
        return mapKicksProductToShoe(product) as Shoe;
      }
      return null;
    },
    enabled: !!id && !cachedShoe && !mockShoe,
    staleTime: 1000 * 60 * 10,
  });

  const shoe = cachedShoe || mockShoe || apiShoe;
  const isWishlisted = shoe ? isInWishlist(shoe.id) : false;
  const brandTip = shoe ? brandSizingTips.find((t) => t.brand === shoe.brand) : null;
  const buyLinks = shoe ? generateBuyLinks(shoe) : [];

  const dealInfo = useMemo(() => {
    if (!shoe) return null;
    return generateDealInfo(shoe.id, shoe.price);
  }, [shoe]);

  const existingAlert = shoe ? getPriceAlert(shoe.id) : undefined;

  const handleWishlistToggle = useCallback(() => {
    if (!shoe) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isWishlisted) {
      removeFromWishlist(shoe.id);
    } else {
      addToWishlist(shoe.id);
    }
  }, [isWishlisted, shoe, addToWishlist, removeFromWishlist]);

  const handleAskAssistant = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/assistant" as never);
  }, []);

  const handleBuyPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowBuyModal(true);
  }, []);

  const handleOpenLink = useCallback(async (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("[ShoeDetail] Cannot open URL:", url);
      }
    } catch (error) {
      console.error("[ShoeDetail] Error opening URL:", error);
    }
  }, []);

  const imageUri = shoe?.images[0] || FALLBACK_IMAGE;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading shoe details...</Text>
      </View>
    );
  }

  if (!shoe) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Shoe not found</Text>
        <Pressable style={[styles.backButton, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
          <Text style={[styles.backButtonText, { color: colors.white }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const showSizingAlert =
    measurements &&
    ((measurements.footType === "wide" && shoe.widthFit === "narrow") ||
      (measurements.footType === "narrow" && shoe.widthFit === "wide") ||
      shoe.runsSmall ||
      shoe.runsLarge);

  const getSizingAlertMessage = () => {
    if (measurements?.footType === "wide" && shoe.widthFit === "narrow") {
      return "This shoe runs narrow and may feel tight for your wide feet. Consider sizing up or looking at wider options.";
    }
    if (measurements?.footType === "narrow" && shoe.widthFit === "wide") {
      return "This shoe runs wide and may feel loose for your narrow feet.";
    }
    if (shoe.runsSmall) {
      return "This shoe runs small. We recommend sizing up by 0.5 size.";
    }
    if (shoe.runsLarge) {
      return "This shoe runs large. Consider sizing down by 0.5 size.";
    }
    return "";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.mainImage, { backgroundColor: colors.surfaceAlt }]}
            contentFit="cover"
            transition={300}
          />
          <Pressable
            style={[styles.headerButton, { top: insets.top + 10, left: 16, backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
          <Pressable
            style={[styles.headerButton, { top: insets.top + 10, right: 16, backgroundColor: colors.surface }]}
            onPress={handleWishlistToggle}
          >
            <Heart
              size={22}
              color={isWishlisted ? colors.error : colors.text}
              fill={isWishlisted ? colors.error : "transparent"}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={[styles.brand, { color: colors.textSecondary }]}>{shoe.brand}</Text>
          <Text style={[styles.name, { color: colors.text }]}>{shoe.name}</Text>

          <Pressable style={styles.ratingRow} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowReviews(true);
          }}>
            <View style={[styles.ratingBadge, { backgroundColor: colors.surfaceAlt }]}>
              <Star size={14} color={colors.accent} fill={colors.accent} />
              <Text style={[styles.ratingText, { color: colors.text }]}>{shoe.rating.toFixed(1)}</Text>
            </View>
            <Text style={[styles.reviewCount, { color: colors.textMuted }]}>
              {shoe.reviewCount.toLocaleString()} reviews
            </Text>
          </Pressable>

          {showSizingAlert && (
            <View style={[styles.alertBanner, { backgroundColor: colors.warningLight }]}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={[styles.alertText, { color: colors.text }]}>{getSizingAlertMessage()}</Text>
            </View>
          )}

          {brandTip && (
            <View style={[styles.tipBanner, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
              <Text style={[styles.tipLabel, { color: colors.accent }]}>Sizing Tip</Text>
              <Text style={[styles.tipText, { color: colors.text }]}>{brandTip.tip}</Text>
            </View>
          )}

          {measurements && (
            <View style={[styles.yourSizeCard, { backgroundColor: colors.primary }]}>
              <Text style={[styles.yourSizeLabel, { color: colors.accentLight }]}>Your Recommended Size</Text>
              <Text style={[styles.yourSizeValue, { color: colors.white }]}>US {measurements.recommendedSize}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Sizes</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sizesScroll}
            >
              {shoe.sizes.map((size) => (
                <View
                  key={size}
                  style={[
                    styles.sizeChip,
                    { backgroundColor: colors.surface, borderColor: colors.borderLight },
                    measurements?.recommendedSize === size && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeChipText,
                      { color: colors.text },
                      measurements?.recommendedSize === size && { color: colors.white },
                    ]}
                  >
                    {size}
                  </Text>
                  {measurements?.recommendedSize === size && (
                    <Text style={[styles.sizeChipBadge, { color: colors.accentLight }]}>Your size</Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Colors</Text>
            <View style={styles.colorsRow}>
              {shoe.colors.map((color) => (
                <View key={color} style={[styles.colorChip, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                  <Text style={[styles.colorChipText, { color: colors.text }]}>{color}</Text>
                </View>
              ))}
            </View>
          </View>

          {dealInfo && (
            <View style={styles.section}>
              <View style={styles.priceSectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Tracking</Text>
                <Pressable
                  style={[styles.alertBtn, { backgroundColor: existingAlert?.isActive ? `${colors.warning}20` : colors.surfaceAlt }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowPriceAlert(true);
                  }}
                >
                  <Bell size={14} color={existingAlert?.isActive ? colors.warning : colors.textMuted} />
                  <Text style={[styles.alertBtnText, { color: existingAlert?.isActive ? colors.warning : colors.textMuted }]}>
                    {existingAlert?.isActive ? `Alert: ${existingAlert.targetPrice}` : "Set Alert"}
                  </Text>
                </Pressable>
              </View>

              <DealScoreBadge
                score={dealInfo.dealScore}
                priceChange30d={dealInfo.priceChange30d}
              />

              <View style={styles.priceStatsRow}>
                <View style={[styles.priceStat, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.priceStatLabel, { color: colors.textMuted }]}>Lowest Now</Text>
                  <Text style={[styles.priceStatValue, { color: colors.accent }]}>${dealInfo.currentLowest}</Text>
                </View>
                <View style={[styles.priceStat, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.priceStatLabel, { color: colors.textMuted }]}>Hist. Low</Text>
                  <Text style={[styles.priceStatValue, { color: colors.text }]}>${dealInfo.historicalLow}</Text>
                </View>
                <View style={[styles.priceStat, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.priceStatLabel, { color: colors.textMuted }]}>Retail</Text>
                  <Text style={[styles.priceStatValue, { color: colors.text }]}>${dealInfo.retailPrice}</Text>
                </View>
              </View>

              <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>90-Day Price History</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.retailerFilter}>
                <Pressable
                  style={[
                    styles.retailerChip,
                    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                    !selectedRetailer && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setSelectedRetailer(undefined)}
                >
                  <Text style={[styles.retailerChipText, { color: colors.textSecondary }, !selectedRetailer && { color: "#FFF" }]}>Lowest</Text>
                </Pressable>
                {["StockX", "GOAT", "Flight Club"].map((r) => (
                  <Pressable
                    key={r}
                    style={[
                      styles.retailerChip,
                      { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                      selectedRetailer === r && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                    onPress={() => setSelectedRetailer(r)}
                  >
                    <Text style={[styles.retailerChipText, { color: colors.textSecondary }, selectedRetailer === r && { color: "#FFF" }]}>{r}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <PriceChart
                priceHistory={dealInfo.priceHistory}
                retailer={selectedRetailer}
                targetPrice={existingAlert?.targetPrice}
              />
            </View>
          )}

          {dealInfo && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Comparison</Text>
              <RetailerComparison retailers={dealInfo.retailers} />
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={3}>{shoe.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
            <View style={styles.detailsGrid}>
              <View style={[styles.detailItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Materials</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{shoe.materials.join(", ")}</Text>
              </View>
              <View style={[styles.detailItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Width Fit</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{shoe.widthFit}</Text>
              </View>
              <View style={[styles.detailItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Arch Support</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{shoe.archSupport}</Text>
              </View>
              <View style={[styles.detailItem, { borderBottomColor: colors.borderLight }]}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Category</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{shoe.category}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <ReviewsModal
        visible={showReviews}
        onClose={() => setShowReviews(false)}
        reviews={shoe.reviews || []}
        shoeName={`${shoe.brand} ${shoe.name}`}
        onAddReview={(rating, comment) => {
          console.log('Add review:', { rating, comment });
        }}
      />

      <Modal
        visible={showBuyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBuyModal(false)}
      >
        <View style={[styles.buyModalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.buyModalHeader, { borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.buyModalTitle, { color: colors.text }]}>Where to Buy</Text>
            <Pressable onPress={() => setShowBuyModal(false)} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>
          
          <View style={styles.buyModalContent}>
            <Text style={[styles.buyModalSubtitle, { color: colors.textSecondary }]}>
              Find {shoe.brand} {shoe.name} at these retailers:
            </Text>
            
            <View style={styles.buyLinksContainer}>
              {buyLinks.map((link, index) => (
                <Pressable
                  key={index}
                  style={[styles.buyLinkItem, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
                  onPress={() => handleOpenLink(link.url)}
                >
                  <View style={[styles.buyLinkIcon, { backgroundColor: colors.surfaceAlt }]}>
                    <ShoppingBag size={24} color={colors.accent} />
                  </View>
                  <View style={styles.buyLinkInfo}>
                    <Text style={[styles.buyLinkName, { color: colors.text }]}>{link.name}</Text>
                    <Text style={[styles.buyLinkAction, { color: colors.textMuted }]}>Tap to search</Text>
                  </View>
                  <ExternalLink size={20} color={colors.textMuted} />
                </Pressable>
              ))}
            </View>

            <Text style={[styles.buyDisclaimer, { color: colors.textMuted }]}>
              Prices and availability may vary. You will be redirected to the retailer website.
            </Text>
          </View>
        </View>
      </Modal>

      {shoe && dealInfo && (
        <PriceAlertModal
          visible={showPriceAlert}
          onClose={() => setShowPriceAlert(false)}
          shoeId={shoe.id}
          shoeName={`${shoe.brand} ${shoe.name}`}
          dealInfo={dealInfo}
        />
      )}

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16, backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
        <Pressable style={[styles.askButton, { backgroundColor: colors.surfaceAlt }]} onPress={handleAskAssistant}>
          <MessageCircle size={20} color={colors.accent} />
        </Pressable>
        <Pressable
          style={[styles.priceAlertButton, { backgroundColor: colors.surfaceAlt }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowPriceAlert(true);
          }}
        >
          <Bell size={20} color={existingAlert?.isActive ? colors.warning : colors.accent} />
        </Pressable>
        <Pressable style={[styles.buyButton, { backgroundColor: colors.primary }]} onPress={handleBuyPress}>
          <ShoppingBag size={20} color={colors.white} />
          <Text style={[styles.buyButtonText, { color: colors.white }]}>Where to Buy</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 15,
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  imageContainer: {
    position: "relative",
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.85,
  },
  headerButton: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    padding: 20,
  },
  brand: {
    fontSize: 14,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  name: {
    fontSize: 26,
    fontWeight: "800" as const,
    marginTop: 4,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  reviewCount: {
    fontSize: 13,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  tipBanner: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  yourSizeCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  yourSizeLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  yourSizeValue: {
    fontSize: 24,
    fontWeight: "800" as const,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 12,
  },
  sizesScroll: {
    gap: 10,
  },
  sizeChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  sizeChipText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  sizeChipBadge: {
    fontSize: 9,
    marginTop: 2,
  },
  colorsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  colorChipText: {
    fontSize: 13,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500" as const,
    textTransform: "capitalize",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  askButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 16,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  buyModalContainer: {
    flex: 1,
  },
  buyModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  buyModalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  closeButton: {
    padding: 4,
  },
  buyModalContent: {
    flex: 1,
    padding: 20,
  },
  buyModalSubtitle: {
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
  },
  buyLinksContainer: {
    gap: 12,
  },
  buyLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  buyLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buyLinkInfo: {
    flex: 1,
  },
  buyLinkName: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  buyLinkAction: {
    fontSize: 13,
    marginTop: 2,
  },
  buyDisclaimer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
    lineHeight: 18,
  },
  priceSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  alertBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  alertBtnText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  priceStatsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  priceStat: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  priceStatLabel: {
    fontSize: 10,
    fontWeight: "500" as const,
    marginBottom: 4,
  },
  priceStatValue: {
    fontSize: 16,
    fontWeight: "800" as const,
  },
  chartLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  retailerFilter: {
    marginBottom: 10,
    maxHeight: 36,
  },
  retailerChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  retailerChipText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  priceAlertButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
