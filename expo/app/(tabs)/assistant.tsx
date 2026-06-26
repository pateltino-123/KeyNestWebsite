import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Keyboard,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send, ShoppingBag, Star, ExternalLink, Shield, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useRorkAgent, createRorkTool } from "@rork-ai/toolkit-sdk";
import { useRouter } from "expo-router";
import { z } from "zod";

import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { shoes, Shoe } from "@/mocks/shoes";
import { sanitizeText } from "@/utilities/sanitize";

function MikeAvatar({ size }: { size: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: size * 0.44 }}>M</Text>
    </View>
  );
}

const quickPrompts = [
  "What's hot right now? 🔥",
  "I need running shoes",
  "Best shoes for wide feet?",
  "Something under $150",
  "Help me pick casual kicks",
];

function ShoeCard({ shoe }: { shoe: Shoe }) {
  const { colors } = useTheme();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const hasValidImage = shoe.images[0] && !shoe.images[0].includes("placeholder");

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/shoe/${shoe.id}`);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.shoeCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
      >
        {hasValidImage && (
          <View style={[styles.shoeImageContainer, { backgroundColor: colors.surfaceAlt }]}>
            <Image source={{ uri: shoe.images[0] }} style={styles.shoeImage} resizeMode="contain" />
          </View>
        )}
        <View style={styles.shoeInfo}>
          <Text style={[styles.shoeBrand, { color: colors.primary }]}>{shoe.brand}</Text>
          <Text style={[styles.shoeName, { color: colors.text }]} numberOfLines={1}>{shoe.name}</Text>
          <View style={styles.shoeMetaRow}>
            <Text style={[styles.shoePrice, { color: colors.accent }]}>${shoe.price}</Text>
            <View style={styles.ratingPill}>
              <Star size={10} color="#FBBF24" fill="#FBBF24" />
              <Text style={[styles.shoeRating, { color: colors.textSecondary }]}>{shoe.rating}</Text>
            </View>
          </View>
          {shoe.sizingTip && (
            <Text style={[styles.shoeTip, { color: colors.textMuted }]} numberOfLines={1}>
              💡 {shoe.sizingTip}
            </Text>
          )}
        </View>
        <View style={[styles.viewBtn, { backgroundColor: `${colors.primary}15` }]}>
          <ExternalLink size={14} color={colors.primary} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

function TypingIndicator({ colors }: { colors: Record<string, string> }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ])
      );
    };
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [dot1, dot2, dot3]);

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
  });

  return (
    <View style={styles.typingRow}>
      <MikeAvatar size={30} />
      <View style={[styles.typingBubble, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, dotStyle(dot1)]} />
        <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, dotStyle(dot2)]} />
        <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, dotStyle(dot3)]} />
      </View>
    </View>
  );
}

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const { measurements, wishlist } = useUser();
  const { colors } = useTheme();
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const systemPrompt = useMemo(() => {
    const shoesContext = shoes.map(s =>
      `ID:${s.id} | ${s.brand} ${s.name} - $${s.price} (${s.category}, ${s.widthFit} fit, ${s.archSupport} arch${s.sizingTip ? `, ${s.sizingTip}` : ""})`
    ).join("\n");

    const userContext = measurements
      ? `Customer's measurements: Size ${measurements.recommendedSize}, ${measurements.footType} feet, ${measurements.archType} arches.`
      : "Customer hasn't been fitted yet - suggest they use our foot scanner for the best experience.";

    const wishlistContext = wishlist.length > 0
      ? `Customer's saved shoes: ${wishlist.map(w => {
          const shoe = shoes.find(s => s.id === w.shoeId);
          return shoe ? `${shoe.brand} ${shoe.name}` : "";
        }).filter(Boolean).join(", ")}`
      : "";

    return `You are Mike, a shoe specialist at ShoeFit. You know footwear inside out and you help people find shoes that actually fit and suit them. Talk like a knowledgeable friend who works in a good shoe shop — relaxed, direct, helpful.

How you talk:
- Natural and conversational. Plain language, no corporate or salesy phrasing.
- Don't over-use pet names. An occasional first name is fine; skip "my friend".
- Don't force enthusiasm or fake personal stories. Only mention real, useful context.
- Be honest about trade-offs — if something runs narrow or is overpriced, say so.
- Emojis are optional and rare. Don't decorate every message.
- Keep replies short and to the point. A sentence or two is usually enough.

How you help:
- Use the recommendShoe tool when you name a specific shoe so the customer sees its card. Pass the catalog ID.
- Suggest 1-3 options at most. Fewer, better-matched picks beat a long list.
- Give concrete sizing and fit guidance based on what they tell you.
- If they mention foot issues, take it seriously and give practical advice.
- Ask a brief follow-up question when you genuinely need more info, not as filler.

${userContext}
${wishlistContext}

Our full inventory (use IDs when calling recommendShoe):
${shoesContext}

Your sizing expertise:
- Nike: True to size for most models; Vaporfly/Alphafly run narrow.
- Adidas: True to size; Adizero racing models fit snug — size up half if between sizes.
- New Balance: Run generous with great width options for wider feet.
- ASICS: Reliable, consistent sizing — always recommend for serious runners.
- Hoka: Incredible cushioning — the Clifton 10 and Bondi 9 are customer favorites.
- Brooks: Excellent width options (narrow to extra wide). Ghost and Adrenaline are best-sellers.
- On: Swiss engineering, snug performance fit — the Cloudmonster has the roomiest toe box.
- Saucony: True to size; Endorphin racers run narrow, Triumph is roomy and plush.
- Under Armour: True to size; Velociti models fit snug for speed, Charged series is roomier.`;
  }, [measurements, wishlist]);

  const { messages, sendMessage, setMessages, error } = useRorkAgent({
    tools: {
      recommendShoe: createRorkTool({
        description: "Show the customer a shoe product card with image and details. Use this whenever you recommend a specific shoe. Pass the shoe ID from the catalog.",
        zodSchema: z.object({
          shoeId: z.string().describe("The ID of the shoe from the catalog"),
          personalNote: z.string().describe("A short personal note about why you're recommending this shoe, like a salesman would say").optional(),
        }),
        execute(input) {
          const shoe = shoes.find(s => s.id === input.shoeId);
          if (shoe) {
            return JSON.stringify({ success: true, shoe: { id: shoe.id, name: shoe.name, brand: shoe.brand, price: shoe.price } });
          }
          return JSON.stringify({ success: false, error: "Shoe not found" });
        },
      }),
    },
  });

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "system",
          role: "user",
          parts: [{ type: "text", text: systemPrompt }],
        },
        {
          id: "initial",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: measurements
                ? `Welcome back. I've got your fitting on file — size ${measurements.recommendedSize}, ${measurements.footType} feet, ${measurements.archType} arches.\n\nWhat are you looking for today?`
                : `Hi, I'm Mike — I help with sizing and picking shoes here at ShoeFit.\n\nIf you scan your feet first I can be a lot more precise, but it's not required. What are you after?`,
            },
          ],
        },
      ]);
    }
  }, [messages.length, measurements, setMessages, systemPrompt]);

  const isLoading = messages.length > 0 && messages[messages.length - 1].role === "user";

  const submitText = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || isLoading) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText("");
    sendMessage(sanitizeText(trimmed));
    setTimeout(() => { scrollViewRef.current?.scrollToEnd({ animated: true }); }, 50);
  }, [isLoading, sendMessage]);

  const handleSend = useCallback(() => {
    submitText(inputText);
  }, [submitText, inputText]);

  // Pressing Enter inserts a newline into a multiline TextInput; we treat any
  // newline as a "send" so the return key sends the message instead.
  const handleChangeText = useCallback((text: string) => {
    if (/\n/.test(text)) {
      submitText(text);
    } else {
      setInputText(text);
    }
  }, [submitText]);

  const handleKeyPress = useCallback((e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const { key } = e.nativeEvent;
    const shiftHeld = (e.nativeEvent as { shiftKey?: boolean }).shiftKey === true;
    if (key === "Enter" && !shiftHeld) {
      submitText(inputText);
    }
  }, [submitText, inputText]);

  const handleQuickPrompt = useCallback((prompt: string) => {
    if (isLoading) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage(prompt);
    setTimeout(() => { scrollViewRef.current?.scrollToEnd({ animated: true }); }, 50);
  }, [isLoading, sendMessage]);

  const renderToolPart = useCallback((part: { type: "tool"; toolName: string; state: string; input?: Record<string, unknown>; output?: unknown }) => {
    if (part.toolName === "recommendShoe") {
      const shoeId = (part.input as { shoeId?: string })?.shoeId;
      const shoe = shoeId ? shoes.find(s => s.id === shoeId) : null;
      if (shoe && (part.state === "output-available" || part.state === "input-available" || part.state === "input-streaming")) {
        return <ShoeCard shoe={shoe} />;
      }
      if (part.state === "input-streaming" || part.state === "input-available") {
        return (
          <View style={[styles.loadingCard, { backgroundColor: colors.surfaceAlt }]}>
            <ShoppingBag size={16} color={colors.textMuted} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>Finding the perfect pair...</Text>
          </View>
        );
      }
    }
    return null;
  }, [colors]);

  const formatMessageText = useCallback((text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
        return (
          <Text key={i} style={styles.bulletLine}>
            {"  "}● {trimmed.substring(2)}
            {"\n"}
          </Text>
        );
      }
      if (trimmed === "") {
        return <Text key={i}>{"\n"}</Text>;
      }
      return (
        <Text key={i}>
          {trimmed}
          {i < lines.length - 1 ? "\n" : ""}
        </Text>
      );
    });
  }, []);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 68}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <MikeAvatar size={44} />
        <View style={styles.headerInfo}>
          <View style={styles.headerNameRow}>
            <Text style={[styles.headerName, { color: colors.text }]}>Mike</Text>
            <View style={[styles.onlineDot, { backgroundColor: "#22C55E" }]} />
          </View>
          <Text style={[styles.headerRole, { color: colors.textMuted }]}>Shoe specialist</Text>
        </View>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            void Haptics.selectionAsync();
            if (router.canGoBack()) {
              router.back();
            } else {
              router.navigate("/(tabs)");
            }
          }}
          style={[styles.closeButton, { backgroundColor: colors.surfaceAlt }]}
          hitSlop={8}
          testID="assistant-close"
        >
          <X size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={[styles.privacyBanner, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}>
        <Shield size={14} color={colors.textMuted} />
        <Text style={[styles.privacyBannerText, { color: colors.textMuted }]}>
          Messages are processed via a secure AI proxy to provide recommendations. No personal data is stored long-term.
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              Oops! Something went wrong. Try sending that again.
            </Text>
          </View>
        )}

        {messages.filter(m => m.id !== "system").map((message) => {
          if (message.role === "user") {
            return (
              <View key={message.id} style={styles.userRow}>
                <View style={[styles.userBubble, { backgroundColor: colors.primary }]}>
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <Text key={`${message.id}-${i}`} style={styles.userText}>
                          {part.text}
                        </Text>
                      );
                    }
                    return null;
                  })}
                </View>
              </View>
            );
          }

          return (
            <View key={message.id} style={styles.assistantRow}>
              <MikeAvatar size={30} />
              <View style={styles.assistantContent}>
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <View
                        key={`${message.id}-${i}`}
                        style={[styles.assistantBubble, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
                      >
                        <Text style={[styles.assistantText, { color: colors.text }]}>
                          {formatMessageText(part.text)}
                        </Text>
                      </View>
                    );
                  }
                  if (part.type === "tool") {
                    const toolView = renderToolPart(part as Parameters<typeof renderToolPart>[0]);
                    return toolView ? <View key={`${message.id}-${i}`}>{toolView}</View> : null;
                  }
                  return null;
                })}
              </View>
            </View>
          );
        })}

        {isLoading && <TypingIndicator colors={colors} />}
      </ScrollView>

      <View style={[styles.quickPromptsWrap, { backgroundColor: colors.background }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPromptsScroll}
        >
          {quickPrompts.map((prompt, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.quickPrompt,
                { backgroundColor: pressed ? `${colors.primary}20` : colors.surfaceAlt, borderColor: colors.borderLight },
              ]}
              onPress={() => handleQuickPrompt(prompt)}
            >
              <Text style={[styles.quickPromptText, { color: colors.textSecondary }]}>{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 88 : 68) + 8, backgroundColor: colors.background, borderTopColor: colors.borderLight }]}>
        <View style={[styles.inputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.text }]}
            placeholder="Ask Mike anything about shoes..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={handleChangeText}
            onKeyPress={handleKeyPress}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            editable={!isLoading}
            autoFocus={false}
          />
          <Pressable
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() && !isLoading ? colors.primary : colors.surfaceAlt },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Send
              size={18}
              color={inputText.trim() && !isLoading ? "#FFFFFF" : colors.textMuted}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
  },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerName: {
    fontSize: 17,
    fontWeight: "700" as const,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerRole: {
    fontSize: 12,
    marginTop: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    textAlign: "center" as const,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  userBubble: {
    maxWidth: "78%",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 20,
    borderBottomRightRadius: 6,
  },
  userText: {
    fontSize: 15,
    lineHeight: 21,
    color: "#FFFFFF",
  },
  assistantRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 8,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginTop: 2,
  },
  assistantContent: {
    flex: 1,
    maxWidth: "85%",
    gap: 6,
  },
  assistantBubble: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
  },
  assistantText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bulletLine: {
    lineHeight: 22,
  },
  shoeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    gap: 10,
  },
  shoeImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  shoeImage: {
    width: 52,
    height: 52,
  },
  shoeInfo: {
    flex: 1,
    gap: 1,
  },
  shoeBrand: {
    fontSize: 10,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
  },
  shoeName: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  shoeMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  shoePrice: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  shoeRating: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
  shoeTip: {
    fontSize: 10,
    fontStyle: "italic" as const,
    marginTop: 1,
  },
  viewBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  loadingText: {
    fontSize: 13,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quickPromptsWrap: {
    paddingVertical: 6,
  },
  quickPromptsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickPrompt: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickPromptText: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 90,
    fontSize: 15,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  privacyBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  privacyBannerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
});
