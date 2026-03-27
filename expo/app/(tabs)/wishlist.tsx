import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Heart,
  MessageCircle,
  Check,
  X,
  ChevronDown,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useUser, useWishlistedShoes } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { shoes } from "@/mocks/shoes";
import ShoeCard from "@/components/ShoeCard";

type SortOption = "date" | "price" | "brand";
type FilterOption = "all" | "saved" | "purchased" | "didnt_fit";

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { updateWishlistStatus } = useUser();
  const { colors } = useTheme();
  const wishlistedItems = useWishlistedShoes(shoes);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let items = [...wishlistedItems];

    if (filterBy !== "all") {
      items = items.filter((item) => item.status === filterBy);
    }

    items.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
      if (sortBy === "price") {
        return (a.shoe?.price || 0) - (b.shoe?.price || 0);
      }
      if (sortBy === "brand") {
        return (a.shoe?.brand || "").localeCompare(b.shoe?.brand || "");
      }
      return 0;
    });

    return items;
  }, [wishlistedItems, sortBy, filterBy]);

  const handleStatusChange = useCallback(
    (shoeId: string, status: "saved" | "purchased" | "didnt_fit") => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      updateWishlistStatus(shoeId, status);
    },
    [updateWishlistStatus]
  );

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "date", label: "Date Added" },
    { value: "price", label: "Price" },
    { value: "brand", label: "Brand" },
  ];

  const filterOptions: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All" },
    { value: "saved", label: "Saved" },
    { value: "purchased", label: "Purchased" },
    { value: "didnt_fit", label: "Did not Fit" },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>Wishlist</Text>
        <Pressable
          style={[styles.askButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push("/assistant")}
        >
          <MessageCircle size={18} color={colors.white} />
          <Text style={[styles.askButtonText, { color: colors.white }]}>Ask Assistant</Text>
        </Pressable>
      </View>

      <View style={styles.controls}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.filterChip,
                { backgroundColor: colors.surface, borderColor: colors.borderLight },
                filterBy === option.value && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => setFilterBy(option.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.textSecondary },
                  filterBy === option.value && { color: colors.white },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          style={styles.sortButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
        >
          <Text style={[styles.sortLabel, { color: colors.textSecondary }]}>Sort: {sortOptions.find((s) => s.value === sortBy)?.label}</Text>
          <ChevronDown size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      {showSortMenu && (
        <View style={[styles.sortMenu, { backgroundColor: colors.surface }]}>
          {sortOptions.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.sortOption,
                sortBy === option.value && { backgroundColor: colors.surfaceAlt },
              ]}
              onPress={() => {
                setSortBy(option.value);
                setShowSortMenu(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  { color: colors.text },
                  sortBy === option.value && { color: colors.accent, fontWeight: "600" as const },
                ]}
              >
                {option.label}
              </Text>
              {sortBy === option.value && (
                <Check size={16} color={colors.accent} />
              )}
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredAndSorted.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {filterBy === "all"
                ? "Your wishlist is empty"
                : `No ${filterBy.replace("_", " ")} items`}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {filterBy === "all"
                ? "Save shoes you love by tapping the heart icon"
                : "Try changing the filter to see more items"}
            </Text>
            <Pressable
              style={[styles.browseButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/browse")}
            >
              <Text style={[styles.browseButtonText, { color: colors.white }]}>Browse Shoes</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredAndSorted.map((item) => (
              <View key={item.shoeId} style={styles.wishlistItem}>
                {item.shoe && (
                  <>
                    <ShoeCard shoe={item.shoe} variant="horizontal" />
                    <View style={styles.statusButtons}>
                      <Pressable
                        style={[
                          styles.statusButton,
                          { borderColor: colors.success },
                          item.status === "purchased" && { backgroundColor: colors.success, borderColor: colors.success },
                        ]}
                        onPress={() => handleStatusChange(item.shoeId, "purchased")}
                      >
                        <Check
                          size={14}
                          color={
                            item.status === "purchased"
                              ? colors.white
                              : colors.success
                          }
                        />
                        <Text
                          style={[
                            styles.statusButtonText,
                            { color: colors.success },
                            item.status === "purchased" && { color: colors.white },
                          ]}
                        >
                          Purchased
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.statusButton,
                          { borderColor: colors.error },
                          item.status === "didnt_fit" && { backgroundColor: colors.error, borderColor: colors.error },
                        ]}
                        onPress={() => handleStatusChange(item.shoeId, "didnt_fit")}
                      >
                        <X
                          size={14}
                          color={
                            item.status === "didnt_fit"
                              ? colors.white
                              : colors.error
                          }
                        />
                        <Text
                          style={[
                            styles.statusButtonText,
                            { color: colors.error },
                            item.status === "didnt_fit" && { color: colors.white },
                          ]}
                        >
                          Did not Fit
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
  },
  askButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  askButtonText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterScroll: {
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortLabel: {
    fontSize: 13,
  },
  sortMenu: {
    position: "absolute",
    top: 160,
    right: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sortOptionText: {
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    paddingHorizontal: 40,
  },
  browseButton: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  list: {
    gap: 16,
  },
  wishlistItem: {
    gap: 10,
  },
  statusButtons: {
    flexDirection: "row",
    gap: 10,
    paddingLeft: 4,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
});
