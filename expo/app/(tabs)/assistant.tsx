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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send, ShoppingBag, Star, ExternalLink } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useRorkAgent, createRorkTool } from "@rork-ai/toolkit-sdk";
import { useRouter } from "expo-router";
import { z } from "zod";

import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { shoes, Shoe } from "@/mocks/shoes";

const SALESMAN_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";

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
      <Image source={{ uri: SALESMAN_AVATAR }} style={styles.avatarSmall} />
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

    return `You are "Mike", a passionate, experienced shoe salesman at ShoeFit — a premium sneaker and footwear store. You've been selling shoes for 15 years and genuinely love helping people find their perfect pair.

Your personality:
- Warm, enthusiastic, and genuinely excited about shoes
- You call customers "friend", "my friend", or by name if known
- You share personal anecdotes like "I actually wear these myself on my morning runs"
- You use natural, conversational language — NOT robotic or corporate
- You get excited when you find a great match: "Oh man, I've got just the thing for you!"
- You're honest about downsides too: "Fair warning though, the Yeezys run tight"
- Use emojis naturally and sparingly — like a real person texting 👟

Key rules:
- ALWAYS use the recommendShoe tool when suggesting specific shoes — this shows the customer a nice product card with the image
- Recommend 1-3 shoes at a time, not more. Quality over quantity.
- Share genuine sizing advice and tips from your "experience"
- If they mention foot problems, be empathetic and knowledgeable
- Keep messages SHORT and punchy. This is a chat, not an essay.
- Break longer thoughts into short paragraphs for readability
- When greeting, be casual and warm, like seeing a regular walk in

${userContext}
${wishlistContext}

Our full inventory (use IDs when calling recommendShoe):
${shoesContext}

Your sizing expertise:
- Nike: True to size, but Air Force 1s can feel snug at first
- Adidas Yeezys: ALWAYS size up half. You've seen too many returns on these.
- New Balance: Run generous, especially the 574. Great for wider feet.
- Converse: Size down! You learned this the hard way yourself.
- ASICS: Reliable sizing, always recommend for serious runners.
- Hoka: The cushioning is incredible — you're obsessed with the Clifton 9.
- On Running: Swiss engineering at its finest, great if they want something light.`;
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
                ? `Hey there, welcome back! 👋\n\nGreat to see you again, friend. I've got your fitting info right here — size ${measurements.recommendedSize}, ${measurements.footType} feet with ${measurements.archType} arches.\n\nSo what are we shopping for today? New runners? Something casual? Or just browsing to see what catches your eye? 👟`
                : `Hey, welcome to ShoeFit! 👋\n\nI'm Mike — I've been fitting shoes here for years and I absolutely love it. Nothing better than finding someone their perfect pair!\n\nBefore we dive in, I'd recommend using our foot scanner to get your exact measurements. It'll help me find you the best fit possible.\n\nBut hey, even without it — what kind of shoes are you looking for? I'm all ears! 😄`,
            },
          ],
        },
      ]);
    }
  }, [messages.length, measurements, setMessages, systemPrompt]);

  const isLoading = messages.length > 0 && messages[messages.length - 1].role === "user";

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const text = inputText.trim();
    setInputText("");
    sendMessage(text);
    setTimeout(() => { scrollViewRef.current?.scrollToEnd({ animated: true }); }, 50);
  }, [inputText, isLoading, sendMessage]);

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
        <Image source={{ uri: SALESMAN_AVATAR }} style={styles.headerAvatar} />
        <View style={styles.headerInfo}>
          <View style={styles.headerNameRow}>
            <Text style={[styles.headerName, { color: colors.text }]}>Mike</Text>
            <View style={[styles.onlineDot, { backgroundColor: "#22C55E" }]} />
          </View>
          <Text style={[styles.headerRole, { color: colors.textMuted }]}>Your Shoe Expert • 15yr experience</Text>
        </View>
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
              <Image source={{ uri: SALESMAN_AVATAR }} style={styles.avatarSmall} />
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
            onChangeText={setInputText}
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
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
});
