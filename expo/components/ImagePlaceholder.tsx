import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ImageOff } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ImagePlaceholderProps {
  height?: number;
  width?: number | string;
  showText?: boolean;
  borderRadius?: number;
}

export default function ImagePlaceholder({
  height = 160,
  width = "100%",
  showText = true,
  borderRadius = 0,
}: ImagePlaceholderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          height,
          width: width as number,
          backgroundColor: colors.surfaceAlt,
          borderRadius,
        },
      ]}
    >
      <ImageOff size={32} color={colors.textMuted} strokeWidth={1.5} />
      {showText && (
        <Text style={[styles.text, { color: colors.textMuted }]}>
          Image Unavailable
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 11,
    fontWeight: "500" as const,
    textAlign: "center" as const,
  },
});
