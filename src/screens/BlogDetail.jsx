import { ActivityIndicator, SafeAreaView, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { getBlogDetail } from "../apis/blog";
import { reportBlogOrComment } from "../apis/report";
import { getCommnentsByPostId, createComment } from "../apis/comment";
import { saveFavoritePost, votePost } from "../apis/vote";
import { formatText } from "../utils/blog";

// ...existing code...
export default function BlogDetail({ route }) {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentsNote, setCommentsNote] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsPageSize] = useState(10);
  const [commentsPagination, setCommentsPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const navigation = useNavigation();
  const { blogId } = route.params;
  const [blog, setBlog] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  // Handle upvote/downvote
  const handleVote = async (voteType) => {
    if (!blogId || !blog) return;
    setVoteLoading(true);
    try {
      await votePost(blogId, voteType);
      // Cập nhật state blog trực tiếp để phản hồi UI ngay
      setBlog((prev) => {
        if (!prev) return prev;
        let upvoteCount = prev.upvoteCount || 0;
        let downvoteCount = prev.downvoteCount || 0;
        // Nếu user đã vote trước đó, trừ đi vote cũ
        if (prev.userVoteType === "UPVOTE") upvoteCount--;
        if (prev.userVoteType === "DOWNVOTE") downvoteCount--;
        // Cộng vote mới
        if (voteType === "UPVOTE") upvoteCount++;
        if (voteType === "DOWNVOTE") downvoteCount++;
        return {
          ...prev,
          upvoteCount,
          downvoteCount,
          userVoteType: voteType,
        };
      });
    } catch (err) {
      Alert.alert("Error", "Failed to vote!");
    } finally {
      setVoteLoading(false);
    }
  };

  const handleFavoritePost = async () => {
    if (!blogId) return;
    setIsFavoriting(true);
    try {
      await saveFavoritePost(blogId);
      Alert.alert("Success", "Post saved to favorites!");
    } catch (err) {
      Alert.alert("Error", "Failed to save favorite!");
    } finally {
      setIsFavoriting(false);
    }
  };

  const fetchBlogDetail = async () => {
    setIsLoading(true);
    const data = await getBlogDetail(blogId);
    if (!data.error) {
      if (data.result) {
        setBlog(data.result);
      } else setBlog(data.data);
    }
    setIsLoading(false);
  };

  const fetchComments = async (page = 1) => {
    setIsLoadingComments(true);
    const data = await getCommnentsByPostId(blogId, page, commentsPageSize);
    setComments(data.comments);
    setCommentsCount(
      data.pagination && data.pagination.total
        ? data.pagination.total
        : data.count
    );
    setCommentsNote(data.note);
    setCommentsPagination(
      data.pagination || {
        page,
        pageSize: commentsPageSize,
        total: 0,
        totalPages: 1,
      }
    );
    setIsLoadingComments(false);
  };

  useEffect(() => {
    fetchBlogDetail();
  }, [blogId]);

  useEffect(() => {
    fetchComments(commentsPage);
  }, [commentsPage, blogId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Please login to comment");
        navigation.navigate("Login");
        return;
      }

      const response = await createComment({
        postId: blogId,
        content: newComment.trim(),
      });

      if (!response.error) {
        setNewComment("");
        fetchComments();
        Alert.alert("Success", "Comment posted successfully");
      } else {
        Alert.alert("Error", response.message || "Failed to post comment");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportBlog = async () => {
    if (!reportReason.trim()) {
      Alert.alert("Error", "Please enter a reason for reporting.");
      return;
    }
    setIsReporting(true);
    try {
      await reportBlogOrComment({
        postId: blogId,
        commentId: 0,
        reason: reportReason.trim(),
        status: "PENDING",
      });
      setShowReportModal(false);
      setReportReason("");
      Alert.alert("Success", "Report sent successfully!");
    } catch (err) {
      Alert.alert("Error", "Report failed!");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView style={styles.container}>
        {isLoading || !blog ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ef4444" />
          </View>
        ) : (
          <>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backBtn}>← Back</Text>
              </TouchableOpacity>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionText}>📎</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={handleFavoritePost}
                  disabled={isFavoriting}
                >
                  <Text style={styles.actionText}>
                    {isFavoriting ? "⏳" : "❤️"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reportBtn}
                  onPress={() => setShowReportModal(true)}
                >
                  <Text style={styles.reportBtnText}>❗</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsRow}>
              <Text style={styles.tagMain}>
                {blog?.level == "MARKET"
                  ? "Cấp độ thị trường"
                  : "Cấp độ cổ phiếu"}
              </Text>
              <Text style={styles.sessionTag}>
                Phiên{" "}
                {blog?.session === 1
                  ? "sáng"
                  : blog?.session === 2
                  ? "chiều"
                  : blog?.session === 3
                  ? "ngày"
                  : ""}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{blog?.title}</Text>

            {/* Meta info + Vote */}
            <View style={[styles.metaRow, { flexWrap: "wrap" }]}>
              <Text style={styles.metaText}>👤 {blog?.expert?.fullName}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>
                {blog?.createdAt
                  ? (() => {
                      const d = new Date(blog.createdAt);
                      const pad = (n) => n.toString().padStart(2, "0");
                      return `${pad(d.getDate())}/${pad(
                        d.getMonth() + 1
                      )}/${d.getFullYear()} ${pad(d.getHours())}:${pad(
                        d.getMinutes()
                      )}`;
                    })()
                  : ""}
              </Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>5 min read</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>👁 {blog?.viewCount} views</Text>
              {/* Like/Dislike */}
              <Text style={styles.metaDot}>·</Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 8,
                }}
                onPress={() => handleVote("UPVOTE")}
                disabled={voteLoading || blog?.userVoteType === "UPVOTE"}
              >
                <MaterialCommunityIcons
                  name={
                    blog?.userVoteType === "UPVOTE"
                      ? "thumb-up"
                      : "thumb-up-outline"
                  }
                  size={20}
                  color={blog?.userVoteType === "UPVOTE" ? "#22c55e" : "#888"}
                  style={{ marginRight: 2 }}
                />
                <Text
                  style={{
                    color: blog?.userVoteType === "UPVOTE" ? "#22c55e" : "#888",
                    fontWeight: "bold",
                  }}
                >
                  {blog?.upvoteCount || 0}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => handleVote("DOWNVOTE")}
                disabled={voteLoading || blog?.userVoteType === "DOWNVOTE"}
              >
                <MaterialCommunityIcons
                  name={
                    blog?.userVoteType === "DOWNVOTE"
                      ? "thumb-down"
                      : "thumb-down-outline"
                  }
                  size={20}
                  color={blog?.userVoteType === "DOWNVOTE" ? "#ef4444" : "#888"}
                  style={{ marginRight: 2 }}
                />
                <Text
                  style={{
                    color:
                      blog?.userVoteType === "DOWNVOTE" ? "#ef4444" : "#888",
                    fontWeight: "bold",
                  }}
                >
                  {blog?.downvoteCount || 0}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Image */}
            <Image source={{ uri: blog?.sourceUrl }} style={styles.image} />

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.contentText}>
                {formatText(blog?.content)}
              </Text>
            </View>

            {/* Comment Input Section */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[
                  styles.commentSubmitBtn,
                  (isSubmitting || !newComment.trim()) &&
                    styles.commentSubmitBtnDisabled,
                ]}
                onPress={handleSubmitComment}
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <MaterialCommunityIcons
                    name="send"
                    size={22}
                    color="#fff"
                    style={{ marginLeft: 2 }}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentsSectionTitle}>
                Comments ({commentsCount})
              </Text>

              {isLoadingComments ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : commentsCount > 0 ? (
                <>
                  {comments.map((comment) => (
                    <View key={comment.commentId} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>
                          {comment.user?.fullName ||
                            comment.userId?.fullName ||
                            "Anonymous"}
                        </Text>
                        <Text style={styles.commentTime}>
                          {comment.createdAt
                            ? (() => {
                                const d = new Date(comment.createdAt);
                                const pad = (n) =>
                                  n.toString().padStart(2, "0");
                                return `${pad(d.getDate())}/${pad(
                                  d.getMonth() + 1
                                )}/${d.getFullYear()} ${pad(
                                  d.getHours()
                                )}:${pad(d.getMinutes())}`;
                              })()
                            : ""}
                        </Text>
                      </View>
                      <Text style={styles.commentContent}>
                        {comment.content}
                      </Text>
                    </View>
                  ))}
                  {/* Pagination Controls */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 10,
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        backgroundColor:
                          commentsPagination.page > 1 ? "#ef4444" : "#f3f4f6",
                        borderRadius: 6,
                      }}
                      disabled={commentsPagination.page <= 1}
                      onPress={() =>
                        setCommentsPage(commentsPagination.page - 1)
                      }
                    >
                      <Text
                        style={{
                          color: commentsPagination.page > 1 ? "#fff" : "#888",
                        }}
                      >
                        Previous
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        alignSelf: "center",
                        color: "#222",
                        fontWeight: "bold",
                      }}
                    >
                      Page {commentsPagination.page} /{" "}
                      {commentsPagination.totalPages || 1}
                    </Text>
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        backgroundColor:
                          commentsPagination.page <
                          commentsPagination.totalPages
                            ? "#ef4444"
                            : "#f3f4f6",
                        borderRadius: 6,
                      }}
                      disabled={
                        commentsPagination.page >= commentsPagination.totalPages
                      }
                      onPress={() =>
                        setCommentsPage(commentsPagination.page + 1)
                      }
                    >
                      <Text
                        style={{
                          color:
                            commentsPagination.page <
                            commentsPagination.totalPages
                              ? "#fff"
                              : "#888",
                        }}
                      >
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <Text style={styles.noComments}>{commentsNote}</Text>
              )}
            </View>
          </>
        )}
        {/* Report Modal */}
        <Modal
          visible={showReportModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowReportModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report Blog</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter reason for reporting..."
                value={reportReason}
                onChangeText={setReportReason}
                multiline
                maxLength={300}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalCancelBtn]}
                  onPress={() => {
                    setShowReportModal(false);
                    setReportReason("");
                  }}
                  disabled={isReporting}
                >
                  <Text style={styles.modalBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    styles.modalSubmitBtn,
                    isReporting && { opacity: 0.7 },
                  ]}
                  onPress={handleReportBlog}
                  disabled={isReporting}
                >
                  <Text style={styles.modalBtnText}>
                    {isReporting ? "Reporting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
  },
  backBtn: { color: "#f43f5e", fontWeight: "bold", fontSize: 16 },
  headerActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  actionText: { color: "#f43f5e", fontWeight: "bold" },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  tagMain: {
    backgroundColor: "#fde68a",
    color: "#b45309",
    fontWeight: "bold",
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 6,
  },
  sessionTag: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    fontWeight: "bold",
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  metaText: { color: "#888", fontSize: 13 },
  metaDot: { color: "#bbb", marginHorizontal: 4 },
  image: {
    width: "92%",
    height: 180,
    borderRadius: 12,
    alignSelf: "center",
    marginVertical: 12,
    backgroundColor: "#eee",
  },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  contentText: { color: "#222", fontSize: 15, lineHeight: 22 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  commentInputContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    maxHeight: 100,
  },
  commentSubmitBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  commentSubmitBtnDisabled: {
    backgroundColor: "#fca5a5",
  },
  commentSubmitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  commentsSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 12,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#334155",
    fontSize: 14,
  },
  commentTime: {
    color: "#94a3b8",
    fontSize: 12,
  },
  commentContent: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
  },
  noComments: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 14,
    fontStyle: "italic",
    paddingVertical: 20,
  },
  reportBtn: {
    backgroundColor: "#fff0f0",
    borderColor: "#ff4d4f",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
    alignSelf: "center",
  },
  reportBtnText: {
    color: "#ff4d4f",
    fontWeight: "bold",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "stretch",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ef4444",
    marginBottom: 12,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    fontSize: 15,
    marginBottom: 16,
    color: "#222",
    backgroundColor: "#f9fafb",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalCancelBtn: {
    backgroundColor: "#f3f4f6",
  },
  modalSubmitBtn: {
    backgroundColor: "#ef4444",
  },
  modalBtnText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 15,
  },
});
