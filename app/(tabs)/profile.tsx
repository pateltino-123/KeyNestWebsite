import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Image } from "expo-image";
import {
  User,
  Ruler,
  History,
  Settings,
  ChevronRight,
  Edit2,
  Check,
  X,
  Footprints,
  Moon,
  Sun,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { brands, categories } from "@/mocks/shoes";
import MeasurementDisplay from "@/components/MeasurementDisplay";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    profile,
    measurements,
    preferences,
    scanHistory,
    setProfile,
    setPreferences,
  } = useUser();
  const { colors, isDark, toggleTheme } = useTheme();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [editName, setEditName] = useState(profile?.name || "");
  const [editEmail, setEditEmail] = useState(profile?.email || "");

  const handleSaveProfile = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setProfile({
      name: editName,
      email: editEmail,
    });
    setShowEditProfile(false);
  }, [editName, editEmail, setProfile]);

  const toggleBrand = useCallback(
    (brand: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const current = preferences.preferredBrands;
      if (current.includes(brand)) {
        setPreferences({
          preferredBrands: current.filter((b) => b !== brand),
        });
      } else {
        setPreferences({
          preferredBrands: [...current, brand],
        });
      }
    },
    [preferences.preferredBrands, setPreferences]
  );

  const toggleStyle = useCallback(
    (style: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const current = preferences.stylePreferences;
      if (current.includes(style)) {
        setPreferences({
          stylePreferences: current.filter((s) => s !== style),
        });
      } else {
        setPreferences({
          stylePreferences: [...current, style],
        });
      }
    },
    [preferences.stylePreferences, setPreferences]
  );

  const setSizeSystem = useCallback(
    (system: "US" | "UK" | "EU") => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPreferences({ sizeSystem: system });
    },
    [setPreferences]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profile?.avatar ? (
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surfaceAlt }]}>
                <User size={40} color={colors.textMuted} />
              </View>
            )}
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>
            {profile?.name || "Set up your profile"}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
            {profile?.email || "Tap to add your details"}
          </Text>
          <Pressable
            style={[styles.editProfileButton, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => {
              setEditName(profile?.name || "");
              setEditEmail(profile?.email || "");
              setShowEditProfile(true);
            }}
          >
            <Edit2 size={16} color={colors.accent} />
            <Text style={[styles.editProfileText, { color: colors.accent }]}>Edit Profile</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ruler size={20} color={colors.accent} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>My Measurements</Text>
          </View>
          {measurements ? (
            <MeasurementDisplay measurements={measurements} />
          ) : (
            <View style={[styles.noMeasurements, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Footprints size={32} color={colors.textMuted} />
              <Text style={[styles.noMeasurementsText, { color: colors.textMuted }]}>
                No measurements yet
              </Text>
              <Pressable
                style={[styles.scanButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/scan" as never)}
              >
                <Text style={[styles.scanButtonText, { color: colors.white }]}>Scan Your Feet</Text>
              </Pressable>
            </View>
          )}
          {measurements && (
            <Pressable
              style={[styles.rescanButton, { backgroundColor: colors.surfaceAlt }]}
              onPress={() => router.push("/scan" as never)}
            >
              <Text style={[styles.rescanButtonText, { color: colors.text }]}>Rescan Feet</Text>
            </Pressable>
          )}
        </View>

        {scanHistory.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <History size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Scan History</Text>
            </View>
            <View style={styles.historyList}>
              {scanHistory.slice(0, 3).map((scan) => (
                <View key={scan.id} style={[styles.historyItem, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                  <View style={styles.historyInfo}>
                    <Text style={[styles.historyDate, { color: colors.text }]}>
                      {formatDate(scan.date)}
                    </Text>
                    <Text style={[styles.historySize, { color: colors.accent }]}>
                      US {scan.measurements.recommendedSize}
                    </Text>
                  </View>
                  <Text style={[styles.historyDetails, { color: colors.textMuted }]}>
                    {scan.measurements.footType} • {scan.measurements.archType} arch
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Pressable
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
            onPress={toggleTheme}
          >
            <View style={styles.menuItemLeft}>
              {isDark ? (
                <Moon size={20} color={colors.textSecondary} />
              ) : (
                <Sun size={20} color={colors.textSecondary} />
              )}
              <Text style={[styles.menuItemText, { color: colors.text }]}>Appearance</Text>
            </View>
            <View style={[styles.themeToggle, { backgroundColor: colors.surfaceAlt }]}>
              <Text style={[styles.themeToggleText, { color: colors.textSecondary }]}>
                {isDark ? "Dark" : "Light"}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.borderLight, marginTop: 12 }]}
            onPress={() => setShowPreferences(true)}
          >
            <View style={styles.menuItemLeft}>
              <Settings size={20} color={colors.textSecondary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Preferences</Text>
            </View>
            <ChevronRight size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={showEditProfile}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderLight }]}>
            <Pressable onPress={() => setShowEditProfile(false)}>
              <X size={24} color={colors.text} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
            <Pressable onPress={handleSaveProfile}>
              <Check size={24} color={colors.accent} />
            </Pressable>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Name</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.borderLight }]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[styles.modalInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.borderLight }]}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="your@email.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPreferences}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPreferences(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.borderLight }]}>
            <Pressable onPress={() => setShowPreferences(false)}>
              <X size={24} color={colors.text} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Preferences</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={[styles.prefSectionTitle, { color: colors.text }]}>Size System</Text>
            <View style={styles.sizeSystemRow}>
              {(["US", "UK", "EU"] as const).map((system) => (
                <Pressable
                  key={system}
                  style={[
                    styles.sizeSystemButton,
                    { backgroundColor: colors.surface, borderColor: colors.borderLight },
                    preferences.sizeSystem === system && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => setSizeSystem(system)}
                >
                  <Text
                    style={[
                      styles.sizeSystemText,
                      { color: colors.text },
                      preferences.sizeSystem === system && { color: colors.white },
                    ]}
                  >
                    {system}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.prefSectionTitle, { color: colors.text }]}>Preferred Brands</Text>
            <View style={styles.tagsContainer}>
              {brands.map((brand) => (
                <Pressable
                  key={brand}
                  style={[
                    styles.tag,
                    { backgroundColor: colors.surface, borderColor: colors.borderLight },
                    preferences.preferredBrands.includes(brand) && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => toggleBrand(brand)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: colors.text },
                      preferences.preferredBrands.includes(brand) && { color: colors.white },
                    ]}
                  >
                    {brand}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.prefSectionTitle, { color: colors.text }]}>Style Preferences</Text>
            <View style={styles.tagsContainer}>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.tag,
                    { backgroundColor: colors.surface, borderColor: colors.borderLight },
                    preferences.stylePreferences.includes(category.id) && { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  onPress={() => toggleStyle(category.id)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: colors.text },
                      preferences.stylePreferences.includes(category.id) && { color: colors.white },
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.prefSectionTitle, { color: colors.text }]}>Budget Range</Text>
            <View style={styles.budgetInputs}>
              <View style={styles.budgetInput}>
                <Text style={[styles.budgetLabel, { color: colors.textMuted }]}>Min</Text>
                <TextInput
                  style={[styles.budgetTextInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.borderLight }]}
                  keyboardType="numeric"
                  value={preferences.budgetMin.toString()}
                  onChangeText={(text) =>
                    setPreferences({ budgetMin: parseInt(text) || 0 })
                  }
                />
              </View>
              <Text style={[styles.budgetSeparator, { color: colors.textMuted }]}>-</Text>
              <View style={styles.budgetInput}>
                <Text style={[styles.budgetLabel, { color: colors.textMuted }]}>Max</Text>
                <TextInput
                  style={[styles.budgetTextInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.borderLight }]}
                  keyboardType="numeric"
                  value={preferences.budgetMax.toString()}
                  onChangeText={(text) =>
                    setPreferences({ budgetMax: parseInt(text) || 500 })
                  }
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  noMeasurements: {
    alignItems: "center",
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  noMeasurementsText: {
    fontSize: 15,
    marginTop: 12,
    marginBottom: 16,
  },
  scanButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  rescanButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  rescanButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  historyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  historySize: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  historyDetails: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
  themeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  themeToggleText: {
    fontSize: 13,
    fontWeight: "500" as const,
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
    fontSize: 18,
    fontWeight: "700" as const,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  modalInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  prefSectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 12,
    marginTop: 8,
  },
  sizeSystemRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  sizeSystemButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  sizeSystemText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  budgetInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  budgetInput: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  budgetTextInput: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  budgetSeparator: {
    fontSize: 18,
    marginTop: 20,
  },
});
