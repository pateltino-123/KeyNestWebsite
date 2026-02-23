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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Send, Sparkles, Bot, User as UserIcon } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useRorkAgent } from "@rork-ai/toolkit-sdk";

import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { shoes } from "@/mocks/shoes";



const quickPrompts = [
  "Find running shoes under $150",
  "Best shoes for wide feet",
  "Nike vs Adidas sizing?",
  "Recommend casual shoes",
];

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const { measurements, wishlist } = useUser();
  const { colors } = useTheme();
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  
  const systemPrompt = useMemo(() => {
    const shoesContext = shoes.map(s => 
      `${s.brand} ${s.name} - ${s.price} (${s.category}, ${s.widthFit} fit, ${s.archSupport} arch support${s.sizingTip ? `, ${s.sizingTip}` : ""})`
    ).join("\n");

    const userContext = measurements
      ? `User's measurements: Size ${measurements.recommendedSize}, ${measurements.footType} feet, ${measurements.archType} arches.`
      : "User hasn't scanned their feet yet.";

    const wishlistContext = wishlist.length > 0
      ? `User's wishlist: ${wishlist.map(w => {
          const shoe = shoes.find(s => s.id === w.shoeId);
          return shoe ? `${shoe.brand} ${shoe.name}` : "";
        }).filter(Boolean).join(', ')}`
      : "User's wishlist is empty.";

    return `You are a friendly, knowledgeable shoe expert assistant for ShoeFit app. You help users find the perfect shoes based on their foot measurements, preferences, and budget.

Key responsibilities:
- Recommend shoes based on user's foot size, foot type, preferences, and budget
- Provide brand-specific sizing advice (e.g., Yeezys run small, New Balance runs wide)
- Answer questions about materials, care, brand comparisons
- Be empathetic and supportive, especially if users mention personal struggles
- Keep responses conversational, warm, and encouraging
- Use emojis naturally but don't overdo it

${userContext}
${wishlistContext}

Available shoes in our catalog:
${shoesContext}

Brand sizing tips:
- Nike: Generally fits true to size
- Adidas Yeezys: Run 0.5 size small - recommend sizing up
- New Balance: Runs wide, great for wide feet
- Converse: Runs large - size down by 0.5 to 1 full size
- Skechers Work Shoes: Run slightly large

Important: If user asks for recommendations and hasn't scanned their feet, kindly suggest they scan first for personalized recommendations.`;
  }, [measurements, wishlist]);

  const { messages, sendMessage, setMessages, error } = useRorkAgent({
    tools: {},
  });

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "system",
          role: "user",
          parts: [
            {
              type: "text",
              text: systemPrompt,
            },
          ],
        },
        {
          id: "initial",
          role: "assistant",
          parts: [
            {
              type: "text",
              text: `Hey there! I'm your personal shoe expert. I know all about sizing quirks, brand comparisons, and finding the perfect fit.${measurements ? `\n\nI see you have a US size ${measurements.recommendedSize} with ${measurements.footType} feet and ${measurements.archType} arches. I'll keep that in mind for my recommendations!` : "\n\nI notice you haven't scanned your feet yet. That would help me give you more personalized recommendations!"}\n\nWhat can I help you with today?`,
            },
          ],
        },
      ]);
    }
  }, [messages.length, measurements, setMessages, systemPrompt]);

  const isLoading = messages.length > 0 && messages[messages.length - 1].role === "user";



  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const text = inputText.trim();
    setInputText("");
    
    await sendMessage(text);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, [inputText, isLoading, sendMessage]);

  const handleQuickPrompt = useCallback(async (prompt: string) => {
    if (isLoading) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    await sendMessage(prompt);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 50);
  }, [isLoading, sendMessage]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: colors.borderLight }]}>
        <View style={[styles.headerIcon, { backgroundColor: colors.surfaceAlt }]}>
          <Sparkles size={24} color={colors.accent} />
        </View>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Shoe Expert</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>Your AI assistant</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[styles.messagesContent, { paddingBottom: 16 }]}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: false })
        }
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
          {error && (
            <View style={[styles.messageBubble, styles.assistantBubble, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Text style={[styles.messageText, { color: "#ef4444" }]}>
                Error: {error.message || "Failed to send message. Please try again."}
              </Text>
            </View>
          )}
          {messages.filter(m => m.id !== "system").map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === "user"
                  ? [styles.userBubble, { backgroundColor: colors.primary }]
                  : [styles.assistantBubble, { backgroundColor: colors.surface, borderColor: colors.borderLight }],
              ]}
            >
              <View style={styles.messageHeader}>
                {message.role === "assistant" ? (
                  <Bot size={16} color={colors.accent} />
                ) : (
                  <UserIcon size={16} color={colors.white} />
                )}
              </View>
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <Text
                      key={`${message.id}-${i}`}
                      style={[
                        styles.messageText,
                        { color: colors.text },
                        message.role === "user" && { color: colors.white },
                      ]}
                    >
                      {part.text}
                    </Text>
                  );
                }
                return null;
              })}
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageBubble, styles.assistantBubble, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <View style={styles.typingIndicator}>
                <View style={[styles.typingDot, { backgroundColor: colors.textMuted }]} />
                <View style={[styles.typingDot, styles.typingDotMiddle, { backgroundColor: colors.textMuted }]} />
                <View style={[styles.typingDot, { backgroundColor: colors.textMuted }]} />
              </View>
            </View>
          )}
      </ScrollView>

      <View style={[styles.quickPromptsContainer, { borderTopColor: colors.borderLight, backgroundColor: colors.background }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPromptsScroll}
        >
          {quickPrompts.map((prompt, index) => (
            <Pressable
              key={index}
              style={[styles.quickPrompt, { backgroundColor: colors.surfaceAlt, borderColor: colors.borderLight }]}
              onPress={() => handleQuickPrompt(prompt)}
            >
              <Text style={[styles.quickPromptText, { color: colors.textSecondary }]}>{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.borderLight }]}>
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
            placeholder="Ask me anything about shoes..."
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
              { backgroundColor: colors.primary },
              (!inputText.trim() || isLoading) && { backgroundColor: colors.surfaceAlt },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Send
              size={20}
              color={inputText.trim() && !isLoading ? colors.white : colors.textMuted}
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 14,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 120,
  },
  messageBubble: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageHeader: {
    marginBottom: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },
  typingDotMiddle: {
    opacity: 0.7,
  },
  quickPromptsContainer: {
    borderTopWidth: 1,
    paddingVertical: 12,
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
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    borderWidth: 1.5,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
