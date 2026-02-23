import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Info, X } from "lucide-react-native";

import Colors from "@/constants/colors";

export default function ModalScreen() {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={() => router.back()}
    >
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Info size={32} color={Colors.accent} />
          </View>
          <Text style={styles.title}>SoleFit</Text>
          <Text style={styles.description}>
            Your personal shoe sizing assistant. Scan your feet, get accurate
            measurements, and find shoes that fit perfectly.
          </Text>

          <Pressable style={styles.closeButton} onPress={() => router.back()}>
            <X size={18} color={Colors.white} />
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </Pressable>

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 28,
    margin: 20,
    alignItems: "center",
    minWidth: 300,
    maxWidth: 340,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.primary,
    marginBottom: 12,
  },
  description: {
    textAlign: "center",
    marginBottom: 24,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontSize: 15,
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 120,
    justifyContent: "center",
  },
  closeButtonText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
});
