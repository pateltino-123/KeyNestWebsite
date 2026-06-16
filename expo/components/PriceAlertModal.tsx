import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Animated,
} from "react-native";
import { X, Bell, BellOff, DollarSign } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser, PriceAlert } from "@/contexts/UserContext";
import { DealInfo } from "@/mocks/priceData";

interface PriceAlertModalProps {
  visible: boolean;
  onClose: () => void;
  shoeId: string;
  shoeName: string;
  dealInfo: DealInfo;
}

export default function PriceAlertModal({
  visible,
  onClose,
  shoeId,
  shoeName,
  dealInfo,
}: PriceAlertModalProps) {
  const { colors } = useTheme();
  const { setPriceAlert, removePriceAlert, getPriceAlert } = useUser();
  const existingAlert = getPriceAlert(shoeId);
  const [targetPrice, setTargetPrice] = useState<string>(
    existingAlert?.targetPrice?.toString() || Math.round(dealInfo.currentLowest * 0.9).toString()
  );
  const buttonScale = React.useRef(new Animated.Value(1)).current;

  const quickPrices = [
    { label: "10% off", value: Math.round(dealInfo.currentLowest * 0.9) },
    { label: "20% off", value: Math.round(dealInfo.currentLowest * 0.8) },
    { label: "Hist. Low", value: dealInfo.historicalLow },
  ];

  const handleSave = useCallback(() => {
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setPriceAlert(shoeId, price);
    onClose();
  }, [targetPrice, shoeId, setPriceAlert, onClose]);

  const handleRemove = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    removePriceAlert(shoeId);
    onClose();
  }, [shoeId, removePriceAlert, onClose]);

  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Price Alert</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <X size={24} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={[styles.shoeName, { color: colors.textSecondary }]}>{shoeName}</Text>

          <View style={[styles.priceInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textMuted }]}>Current Lowest</Text>
              <Text style={[styles.priceValue, { color: colors.accent }]}>${dealInfo.currentLowest}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textMuted }]}>Historical Low</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>${dealInfo.historicalLow}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textMuted }]}>Retail Price</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>${dealInfo.retailPrice}</Text>
            </View>
          </View>

          <Text style={[styles.inputLabel, { color: colors.text }]}>Target Price</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <DollarSign size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={targetPrice}
              onChangeText={setTargetPrice}
              keyboardType="numeric"
              placeholder="Enter target price"
              placeholderTextColor={colors.textMuted}
              testID="price-alert-input"
            />
          </View>

          <View style={styles.quickPrices}>
            {quickPrices.map((qp) => (
              <Pressable
                key={qp.label}
                style={[
                  styles.quickChip,
                  { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                  targetPrice === qp.value.toString() && { backgroundColor: `${colors.primary}20`, borderColor: colors.primary },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTargetPrice(qp.value.toString());
                }}
              >
                <Text
                  style={[
                    styles.quickChipText,
                    { color: colors.textSecondary },
                    targetPrice === qp.value.toString() && { color: colors.primary },
                  ]}
                >
                  {qp.label}
                </Text>
                <Text
                  style={[
                    styles.quickChipPrice,
                    { color: colors.text },
                    targetPrice === qp.value.toString() && { color: colors.primary },
                  ]}
                >
                  ${qp.value}
                </Text>
              </Pressable>
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              testID="save-price-alert"
            >
              <Bell size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {existingAlert ? "Update Alert" : "Set Price Alert"}
              </Text>
            </Pressable>
          </Animated.View>

          {existingAlert && (
            <Pressable style={[styles.removeButton, { borderColor: colors.error }]} onPress={handleRemove}>
              <BellOff size={18} color={colors.error} />
              <Text style={[styles.removeButtonText, { color: colors.error }]}>Remove Alert</Text>
            </Pressable>
          )}

          <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
            You'll receive a notification when the price drops to or below your target.
          </Text>
        </View>
      </View>
    </Modal>
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
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  shoeName: {
    fontSize: 15,
    marginBottom: 20,
  },
  priceInfo: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  divider: {
    height: 1,
    marginVertical: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600" as const,
    paddingVertical: 14,
  },
  quickPrices: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  quickChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
  quickChipPrice: {
    fontSize: 14,
    fontWeight: "700" as const,
    marginTop: 2,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  disclaimer: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
