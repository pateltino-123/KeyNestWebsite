import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Footprints } from "lucide-react-native";

import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Footprints size={48} color={Colors.textMuted} />
        </View>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>
          Looks like you wandered off the path
        </Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    marginBottom: 32,
  },
  link: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    borderRadius: 14,
  },
  linkText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: "600",
  },
});
