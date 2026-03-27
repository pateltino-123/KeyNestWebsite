import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Star, Check } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { Review } from "@/mocks/shoes";

interface ReviewsModalProps {
  visible: boolean;
  onClose: () => void;
  reviews: Review[];
  shoeName: string;
  onAddReview?: (rating: number, comment: string) => void;
}

export default function ReviewsModal({
  visible,
  onClose,
  reviews,
  shoeName,
  onAddReview,
}: ReviewsModalProps) {
  const insets = useSafeAreaInsets();
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleAddReview = useCallback(() => {
    if (comment.trim() && onAddReview) {
      onAddReview(rating, comment.trim());
      setComment("");
      setRating(5);
      setShowAddReview(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [rating, comment, onAddReview]);

  const handleStarPress = useCallback((value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(value);
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Reviews</Text>
            <Text style={styles.subtitle}>{shoeName}</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!showAddReview && onAddReview && (
            <Pressable
              style={styles.addReviewButton}
              onPress={() => {
                setShowAddReview(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.addReviewButtonText}>Write a Review</Text>
            </Pressable>
          )}

          {showAddReview && (
            <View style={styles.addReviewSection}>
              <Text style={styles.addReviewTitle}>Your Review</Text>
              
              <View style={styles.ratingSelector}>
                <Text style={styles.ratingLabel}>Rating</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Pressable
                      key={value}
                      onPress={() => handleStarPress(value)}
                      style={styles.starButton}
                    >
                      <Star
                        size={32}
                        color={value <= rating ? Colors.accent : Colors.textMuted}
                        fill={value <= rating ? Colors.accent : "transparent"}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>

              <TextInput
                style={styles.commentInput}
                placeholder="Share your experience with these shoes..."
                placeholderTextColor={Colors.textMuted}
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />

              <View style={styles.addReviewActions}>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddReview(false);
                    setComment("");
                    setRating(5);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.submitButton,
                    !comment.trim() && styles.submitButtonDisabled,
                  ]}
                  onPress={handleAddReview}
                  disabled={!comment.trim()}
                >
                  <Check size={18} color={Colors.white} />
                  <Text style={styles.submitButtonText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Text style={styles.reviewsHeader}>
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </Text>

          {reviews.length === 0 ? (
            <View style={styles.emptyState}>
              <Star size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to share your experience!
              </Text>
            </View>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUser}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {review.userName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <View style={styles.userNameRow}>
                        <Text style={styles.userName}>{review.userName}</Text>
                        {review.verified && (
                          <View style={styles.verifiedBadge}>
                            <Check size={10} color={Colors.white} />
                          </View>
                        )}
                      </View>
                      <Text style={styles.reviewDate}>
                        {formatDate(review.date)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reviewRating}>
                    <Star size={14} color={Colors.accent} fill={Colors.accent} />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  addReviewButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  addReviewButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "700",
  },
  addReviewSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  addReviewTitle: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 16,
  },
  ratingSelector: {
    marginBottom: 16,
  },
  ratingLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: "600",
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  commentInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 100,
    marginBottom: 16,
  },
  addReviewActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: "600",
  },
  reviewsHeader: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "700",
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "600",
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reviewRatingText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: "600",
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
});
