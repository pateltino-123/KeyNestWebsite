import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  SlidersHorizontal,
  X,
  Check,
  Dumbbell,
  Shirt,
  Briefcase,
  Footprints,
  HardHat,
  Heart,
  RefreshCw,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { categories, brands, Shoe, shoes } from "@/mocks/shoes";
import ShoeCard from "@/components/ShoeCard";
import AnimatedListItem from "@/components/AnimatedListItem";
import { useTheme } from "@/contexts/ThemeContext";

const extractUniqueColors = (allShoes: Shoe[]): string[] => {
  const colorSet = new Set<string>();
  allShoes.forEach(shoe => {
    shoe.colors.forEach(color => colorSet.add(color));
  });
  return Array.from(colorSet).sort();
};



export default function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [minPriceText, setMinPriceText] = useState("0");
  const [maxPriceText, setMaxPriceText] = useState("300");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);



  const apiShoes = shoes;
  const isLoading = false;
  const isError = false;
  const isFetching = false;
  const refetch = () => {};

  const allShoes = useMemo(() => {
    return apiShoes.length > 0 ? (apiShoes as Shoe[]) : [];
  }, [apiShoes]);

  const availableColors = useMemo(() => {
    return extractUniqueColors(allShoes);
  }, [allShoes]);

  const filteredShoes = useMemo(() => {
    return allShoes.filter((shoe) => {
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesSearch = 
          shoe.name.toLowerCase().includes(searchLower) ||
          shoe.brand.toLowerCase().includes(searchLower) ||
          shoe.category.toLowerCase().includes(searchLower) ||
          shoe.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      if (selectedCategory && shoe.category !== selectedCategory) {
        return false;
      }
      
      if (selectedBrands.length > 0 && !selectedBrands.includes(shoe.brand)) {
        return false;
      }
      
      if (selectedColors.length > 0) {
        const hasMatchingColor = shoe.colors.some(color => 
          selectedColors.includes(color)
        );
        if (!hasMatchingColor) return false;
      }
      
      if (shoe.price < priceRange[0] || shoe.price > priceRange[1]) {
        return false;
      }
      
      return true;
    });
  }, [allShoes, debouncedSearch, selectedCategory, selectedBrands, selectedColors, priceRange]);

  const handleCategoryPress = useCallback((categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  }, []);

  const toggleColor = useCallback((color: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setPriceRange([0, 300]);
    setMinPriceText("0");
    setMaxPriceText("300");
    setSelectedCategory(null);
    setSearchQuery("");
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedBrands.length > 0) count++;
    if (selectedColors.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < 300) count++;
    return count;
  }, [selectedBrands, selectedColors, priceRange]);

  const getCategoryIcon = (categoryId: string) => {
    const iconProps = { size: 18, color: selectedCategory === categoryId ? colors.white : colors.textSecondary };
    switch (categoryId) {
      case "running": return <Footprints {...iconProps} />;
      case "medical": return <Heart {...iconProps} />;
      default: return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>Discover</Text>
        <View style={styles.searchRow}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <Search size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search shoes, brands..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <X size={18} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <Pressable
            style={[
              styles.filterButton,
              { backgroundColor: colors.surface, borderColor: colors.borderLight },
              activeFiltersCount > 0 && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowFilters(true);
            }}
          >
            <SlidersHorizontal
              size={20}
              color={activeFiltersCount > 0 ? colors.white : colors.text}
            />
            {activeFiltersCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.filterBadgeText, { color: colors.white }]}>{activeFiltersCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryChip,
              { backgroundColor: colors.surface, borderColor: colors.borderLight },
              selectedCategory === category.id && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            {getCategoryIcon(category.id)}
            <Text
              style={[
                styles.categoryText,
                { color: colors.textSecondary },
                selectedCategory === category.id && { color: colors.white },
              ]}
            >
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={colors.accent}
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>Finding shoes...</Text>
          </View>
        ) : isError ? (
          <View style={styles.emptyState}>
            <RefreshCw size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Unable to load shoes</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Check your connection and try again
            </Text>
            <Pressable style={[styles.clearButton, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
              <Text style={[styles.clearButtonText, { color: colors.white }]}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={[styles.resultsText, { color: colors.textMuted }]}>
              {filteredShoes.length} {filteredShoes.length === 1 ? "shoe" : "shoes"} found
              {isFetching && " • Refreshing..."}
            </Text>
            <View style={styles.shoesGrid}>
              {filteredShoes.map((shoe, idx) => (
                <AnimatedListItem key={shoe.id} index={idx} style={styles.shoeCardWrapper}>
                  <ShoeCard shoe={shoe} />
                </AnimatedListItem>
              ))}
            </View>
            {filteredShoes.length === 0 && (
              <View style={styles.emptyState}>
                <Footprints size={48} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No shoes found</Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                  Try adjusting your filters or search terms
                </Text>
                <Pressable style={[styles.clearButton, { backgroundColor: colors.primary }]} onPress={clearFilters}>
                  <Text style={[styles.clearButtonText, { color: colors.white }]}>Clear Filters</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <X size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Brands</Text>
            <View style={styles.brandsGrid}>
              {brands.map((brand) => (
                <Pressable
                  key={brand}
                  style={[
                    styles.brandChip,
                    { backgroundColor: colors.surface, borderColor: colors.borderLight },
                    selectedBrands.includes(brand) && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => toggleBrand(brand)}
                >
                  {selectedBrands.includes(brand) && (
                    <Check size={14} color={colors.white} />
                  )}
                  <Text
                    style={[
                      styles.brandText,
                      { color: colors.text },
                      selectedBrands.includes(brand) && { color: colors.white },
                    ]}
                  >
                    {brand}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Colors</Text>
            <View style={styles.colorsGrid}>
              {availableColors.map((color) => (
                <Pressable
                  key={color}
                  style={[
                    styles.colorChip,
                    { backgroundColor: colors.surface, borderColor: colors.borderLight },
                    selectedColors.includes(color) && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => toggleColor(color)}
                >
                  {selectedColors.includes(color) && (
                    <Check size={14} color={colors.white} />
                  )}
                  <Text
                    style={[
                      styles.colorText,
                      { color: colors.text },
                      selectedColors.includes(color) && { color: colors.white },
                    ]}
                  >
                    {color}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Price Range</Text>
            <View style={styles.priceInputs}>
              <View style={styles.priceInputContainer}>
                <Text style={[styles.priceLabel, { color: colors.textMuted }]}>Min</Text>
                <View style={[styles.priceInputWrapper, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                  <Text style={[styles.priceCurrency, { color: colors.textMuted }]}>$</Text>
                  <TextInput
                    style={[styles.priceInput, { color: colors.text }]}
                    keyboardType="numeric"
                    value={minPriceText}
                    onChangeText={(text) => {
                      setMinPriceText(text);
                      const numValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
                      if (text === '' || text === '0') {
                        setPriceRange([0, priceRange[1]]);
                      } else if (!isNaN(numValue)) {
                        setPriceRange([numValue, priceRange[1]]);
                      }
                    }}
                  />
                </View>
              </View>
              <Text style={[styles.priceSeparator, { color: colors.textMuted }]}>-</Text>
              <View style={styles.priceInputContainer}>
                <Text style={[styles.priceLabel, { color: colors.textMuted }]}>Max</Text>
                <View style={[styles.priceInputWrapper, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                  <Text style={[styles.priceCurrency, { color: colors.textMuted }]}>$</Text>
                  <TextInput
                    style={[styles.priceInput, { color: colors.text }]}
                    keyboardType="numeric"
                    value={maxPriceText}
                    onChangeText={(text) => {
                      setMaxPriceText(text);
                      const numValue = parseInt(text.replace(/[^0-9]/g, ''), 10);
                      if (text === '' || text === '0') {
                        setPriceRange([priceRange[0], 500]);
                      } else if (!isNaN(numValue)) {
                        setPriceRange([priceRange[0], Math.max(numValue, priceRange[0])]);
                      }
                    }}
                  />
                </View>
              </View>
            </View>
            <Text style={[styles.priceRangeDisplay, { color: colors.textMuted }]}>
              Showing shoes from ${priceRange[0]} to ${priceRange[1]}
            </Text>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: colors.borderLight }]}>
            <Pressable style={[styles.clearFiltersButton, { backgroundColor: colors.surfaceAlt }]} onPress={clearFilters}>
              <Text style={[styles.clearFiltersText, { color: colors.text }]}>Clear All</Text>
            </Pressable>
            <Pressable
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={[styles.applyButtonText, { color: colors.white }]}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
  },
  categoriesContainer: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 4,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  resultsText: {
    fontSize: 14,
    marginBottom: 16,
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
  loadingState: {
    alignItems: "center",
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 15,
    marginTop: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  clearButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 14,
    marginTop: 10,
  },
  brandsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  brandChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  brandText: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  colorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  colorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  colorText: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  priceInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  priceCurrency: {
    fontSize: 16,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
  },
  priceRangeDisplay: {
    fontSize: 13,
    marginTop: 12,
  },
  priceSeparator: {
    fontSize: 18,
    marginTop: 20,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  clearFiltersText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
});
