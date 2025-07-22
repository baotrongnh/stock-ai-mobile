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
import {
  getCommnentsByPostId,
  createComment,
  createReplyComment,
  getRepliesByCommentId,
} from "../apis/comment";
import { getProfile } from "../apis/profile";
import { saveFavoritePost, votePost } from "../apis/vote";
import { formatText } from "../utils/blog";

// Helper function to format date
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
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

  // Reply state variables
  const [replies, setReplies] = useState({}); // Store replies by commentId
  const [replyingToComment, setReplyingToComment] = useState(null); // Track which comment user is replying to
  const [replyingToReply, setReplyingToReply] = useState(null); // Track which reply user is replying to
  const [replyParentId, setReplyParentId] = useState(null); // Store parent comment ID when replying to a reply
  const [newReply, setNewReply] = useState(""); // Content of new reply
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const navigation = useNavigation();
  const { blogId } = route.params;
  const [blog, setBlog] = useState(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [profile, setProfile] = useState(null);
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

  // Function to load replies for a comment
  const fetchReplies = async (commentId, page = 1, pageSize = 5) => {
    try {
      const response = await getRepliesByCommentId(commentId, page, pageSize);

      setReplies((prev) => ({
        ...prev,
        [commentId]: {
          data: response.replies || [],
          count: response.count || 0,
          note: response.note || "Không có trả lời nào.",
          pagination: response.pagination || {
            page,
            pageSize,
            total: 0,
            totalPages: 1,
          },
          loading: false,
        },
      }));
    } catch (error) {
      console.error("Error fetching replies:", error);
      setReplies((prev) => ({
        ...prev,
        [commentId]: {
          data: [],
          count: 0,
          note: "Không thể tải trả lời.",
          pagination: { page, pageSize, total: 0, totalPages: 1 },
          loading: false,
        },
      }));
    }
  };

  // Function to handle reply page change
  const handleReplyPageChange = (commentId, page) => {
    setReplies((prev) => ({
      ...prev,
      [commentId]: {
        ...prev[commentId],
        loading: true,
      },
    }));
    fetchReplies(commentId, page);
  };

  // Function to toggle reply input for a comment
  const toggleReplyInput = (commentId, replyId = null) => {
    if (replyId) {
      // Trả lời cho một reply
      if (replyingToReply === replyId) {
        // Cancel reply to reply
        setReplyingToReply(null);
        setReplyParentId(null);
        setNewReply("");
      } else {
        // Start reply to reply
        setReplyingToReply(replyId);
        setReplyParentId(commentId);
        setReplyingToComment(null);
        setNewReply("");

        // If replies haven't been loaded yet, load them
        if (!replies[commentId]) {
          setReplies((prev) => ({
            ...prev,
            [commentId]: {
              data: [],
              count: 0,
              note: "Đang tải...",
              pagination: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
              loading: true,
            },
          }));
          fetchReplies(commentId);
        }
      }
    } else {
      // Trả lời cho comment gốc
      if (replyingToComment === commentId) {
        setReplyingToComment(null);
        setNewReply("");
      } else {
        setReplyingToComment(commentId);
        setReplyingToReply(null);
        setReplyParentId(null);
        setNewReply("");

        // If replies haven't been loaded yet, load them
        if (!replies[commentId]) {
          setReplies((prev) => ({
            ...prev,
            [commentId]: {
              data: [],
              count: 0,
              note: "Đang tải...",
              pagination: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
              loading: true,
            },
          }));
          fetchReplies(commentId);
        }
      }
    }
  };

  // Function to submit reply
  const handleSubmitReply = async () => {
    // Kiểm tra xem đang trả lời comment hay reply
    const commentId = replyingToComment || replyParentId;

    if (!commentId || !newReply.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung trả lời");
      return;
    }

    try {
      setIsSubmittingReply(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để trả lời");
        navigation.navigate("Login");
        return;
      }

      // Tạo payload cho API
      let replyContent = newReply.trim();

      // Nếu đang trả lời một reply, thêm thẻ @username
      if (replyingToReply) {
        const parentReply = replies[replyParentId]?.data.find(
          (r) => r.commentId === replyingToReply
        );
        if (parentReply) {
          const replyUsername =
            parentReply.user?.fullName ||
            parentReply.userId?.fullName ||
            "Anonymous";
          replyContent = `@${replyUsername} ${replyContent}`;
        }
      }

      const response = await createReplyComment({
        commentId: commentId,
        content: replyContent,
      });

      if (!response.error) {
        setNewReply("");
        // Refresh replies for this comment
        fetchReplies(commentId);
        Alert.alert("Thành công", "Đã gửi trả lời thành công");
        setReplyingToComment(null);
        setReplyingToReply(null);
        setReplyParentId(null);
      } else {
        Alert.alert("Lỗi", response.message || "Không thể gửi trả lời");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Fetch user profile for avatar display
  const fetchUserProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data.user || data.data || {});
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchBlogDetail();
    fetchUserProfile();
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
    console.log("blogId:", blogId);
    if (!reportReason.trim()) {
      Alert.alert("Error", "Please enter a reason for reporting.");
      return;
    }
    setIsReporting(true);
    try {
      console.log("blogId:", blogId);
      const result = await reportBlogOrComment({
        postId: blogId,
        commentId: 0,
        reason: reportReason.trim(),
        status: "PENDING",
      });
      console.log("Report response:", result);
      setShowReportModal(false);
      setReportReason("");
      Alert.alert("Success", "Report sent successfully!");
    } catch (err) {
      console.error("Report error:", err);
      Alert.alert("Error", err.message || "Report failed!");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
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

            {/* Comment Input Section - with card style */}
            {/* Facebook-style comment input at bottom */}
            {!replyingToComment && !replyingToReply && (
              <View style={styles.facebookCommentContainer}>
                <View style={styles.facebookCommentInputWrapper}>
                  <View style={styles.commentAvatar}>
                    {profile?.avatarUrl ? (
                      <Image
                        source={{ uri: profile.avatarUrl }}
                        style={styles.mainCommentAvatar}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="account-circle"
                        size={32}
                        color="#94a3b8"
                      />
                    )}
                  </View>
                  <TextInput
                    style={styles.facebookCommentInput}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    maxLength={1000}
                  />
                  <TouchableOpacity
                    style={[
                      styles.facebookCommentSubmitBtn,
                      !newComment.trim() &&
                        styles.facebookCommentSubmitBtnDisabled,
                    ]}
                    onPress={handleSubmitComment}
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#0369a1" />
                    ) : (
                      <MaterialCommunityIcons
                        name="send"
                        size={20}
                        color={newComment.trim() ? "#0369a1" : "#94a3b8"}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.facebookCommentToolbar}>
                  <TouchableOpacity style={styles.facebookCommentToolbarBtn}>
                    <MaterialCommunityIcons
                      name="image"
                      size={20}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.facebookCommentToolbarBtn}>
                    <MaterialCommunityIcons
                      name="emoticon-outline"
                      size={20}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.facebookCommentToolbarBtn}>
                    <MaterialCommunityIcons
                      name="attachment"
                      size={20}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

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
                        <View style={styles.commentAuthorContainer}>
                          {comment.user?.avatarUrl ? (
                            <Image
                              source={{ uri: comment.user.avatarUrl }}
                              style={styles.commentAuthorAvatar}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name="account-circle"
                              size={24}
                              color="#94a3b8"
                            />
                          )}
                          <Text style={styles.commentAuthor}>
                            {comment.user?.fullName ||
                              comment.userId?.fullName ||
                              "Anonymous"}
                          </Text>
                        </View>
                        <Text style={styles.commentTime}>
                          {formatDate(comment.createdAt)}
                        </Text>
                      </View>
                      <Text style={styles.commentContent}>
                        {comment.content}
                      </Text>

                      <TouchableOpacity
                        onPress={() => toggleReplyInput(comment.commentId)}
                        style={styles.replyButton}
                      >
                        <MaterialCommunityIcons
                          name={
                            replyingToComment === comment.commentId
                              ? "close"
                              : "reply"
                          }
                          size={14}
                          color="#0369a1"
                        />
                        <Text style={styles.replyButtonText}>
                          {replyingToComment === comment.commentId
                            ? "Hủy trả lời"
                            : "Trả lời"}
                        </Text>
                      </TouchableOpacity>

                      {replyingToComment === comment.commentId && (
                        <View style={styles.replyInputContainer}>
                          <View style={styles.replyInputWrapper}>
                            <View style={styles.replyAvatar}>
                              {profile?.avatarUrl ? (
                                <Image
                                  source={{ uri: profile.avatarUrl }}
                                  style={styles.replyAvatarImage}
                                />
                              ) : (
                                <MaterialCommunityIcons
                                  name="account-circle"
                                  size={24}
                                  color="#94a3b8"
                                />
                              )}
                            </View>
                            <TextInput
                              style={styles.replyInput}
                              placeholder="Viết trả lời..."
                              value={newReply}
                              onChangeText={setNewReply}
                              multiline
                              maxLength={500}
                            />
                          </View>
                          <TouchableOpacity
                            style={[
                              styles.replySubmitBtn,
                              (isSubmittingReply || !newReply.trim()) &&
                                styles.replySubmitBtnDisabled,
                            ]}
                            onPress={handleSubmitReply}
                            disabled={isSubmittingReply || !newReply.trim()}
                          >
                            {isSubmittingReply ? (
                              <ActivityIndicator size="small" color="#0369a1" />
                            ) : (
                              <MaterialCommunityIcons
                                name="send"
                                size={18}
                                color={newReply.trim() ? "#0369a1" : "#94a3b8"}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      )}

                      {/* Replies section */}
                      {replies[comment.commentId] && (
                        <View style={styles.repliesContainer}>
                          <Text style={styles.repliesTitle}>
                            Trả lời ({replies[comment.commentId].count})
                          </Text>

                          {replies[comment.commentId].loading ? (
                            <ActivityIndicator size="small" color="#60a5fa" />
                          ) : replies[comment.commentId].count > 0 ? (
                            <>
                              {/* Reply list */}
                              {replies[comment.commentId].data.map((reply) => (
                                <View
                                  key={reply.commentId}
                                  style={styles.replyItem}
                                >
                                  <View style={styles.replyHeader}>
                                    <View style={styles.replyAuthorContainer}>
                                      {reply.user?.avatarUrl ? (
                                        <Image
                                          source={{ uri: reply.user.avatarUrl }}
                                          style={styles.replyAuthorAvatar}
                                        />
                                      ) : (
                                        <MaterialCommunityIcons
                                          name="account-circle"
                                          size={20}
                                          color="#94a3b8"
                                        />
                                      )}
                                      <Text style={styles.replyAuthor}>
                                        {reply.user?.fullName ||
                                          reply.userId?.fullName ||
                                          "Anonymous"}
                                      </Text>
                                    </View>
                                    <Text style={styles.replyTime}>
                                      {formatDate(reply.createdAt)}
                                    </Text>
                                  </View>
                                  <Text style={styles.replyContent}>
                                    {reply.content}
                                  </Text>

                                  {/* Reply to reply button */}
                                  <TouchableOpacity
                                    onPress={() =>
                                      toggleReplyInput(
                                        comment.commentId,
                                        reply.commentId
                                      )
                                    }
                                    style={styles.replyToReplyButton}
                                  >
                                    <MaterialCommunityIcons
                                      name={
                                        replyingToReply === reply.commentId
                                          ? "close"
                                          : "reply"
                                      }
                                      size={12}
                                      color="#0369a1"
                                    />
                                    <Text style={styles.replyButtonText}>
                                      {replyingToReply === reply.commentId
                                        ? "Hủy"
                                        : "Trả lời"}
                                    </Text>
                                  </TouchableOpacity>

                                  {/* Reply to reply input */}
                                  {replyingToReply === reply.commentId && (
                                    <View style={styles.replyInputContainer}>
                                      <View style={styles.replyInputWrapper}>
                                        <View style={styles.replyAvatar}>
                                          {profile?.avatarUrl ? (
                                            <Image
                                              source={{
                                                uri: profile.avatarUrl,
                                              }}
                                              style={styles.replyAvatarImage}
                                            />
                                          ) : (
                                            <MaterialCommunityIcons
                                              name="account-circle"
                                              size={24}
                                              color="#94a3b8"
                                            />
                                          )}
                                        </View>
                                        <TextInput
                                          style={styles.replyInput}
                                          placeholder={`Trả lời cho ${
                                            reply.user?.fullName ||
                                            reply.userId?.fullName ||
                                            "Anonymous"
                                          }...`}
                                          value={newReply}
                                          onChangeText={setNewReply}
                                          multiline
                                          maxLength={500}
                                        />
                                      </View>
                                      <TouchableOpacity
                                        style={[
                                          styles.replySubmitBtn,
                                          (isSubmittingReply ||
                                            !newReply.trim()) &&
                                            styles.replySubmitBtnDisabled,
                                        ]}
                                        onPress={handleSubmitReply}
                                        disabled={
                                          isSubmittingReply || !newReply.trim()
                                        }
                                      >
                                        {isSubmittingReply ? (
                                          <ActivityIndicator
                                            size="small"
                                            color="#0369a1"
                                          />
                                        ) : (
                                          <MaterialCommunityIcons
                                            name="send"
                                            size={16}
                                            color={
                                              newReply.trim()
                                                ? "#0369a1"
                                                : "#94a3b8"
                                            }
                                          />
                                        )}
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              ))}

                              {/* Reply pagination */}
                              <View style={styles.replyPaginationContainer}>
                                <TouchableOpacity
                                  style={[
                                    styles.replyPageBtn,
                                    replies[comment.commentId].pagination.page >
                                    1
                                      ? styles.replyPageBtnActive
                                      : styles.replyPageBtnDisabled,
                                  ]}
                                  disabled={
                                    replies[comment.commentId].pagination
                                      .page <= 1
                                  }
                                  onPress={() =>
                                    handleReplyPageChange(
                                      comment.commentId,
                                      replies[comment.commentId].pagination
                                        .page - 1
                                    )
                                  }
                                >
                                  <Text
                                    style={
                                      replies[comment.commentId].pagination
                                        .page > 1
                                        ? styles.replyPageBtnTextActive
                                        : styles.replyPageBtnTextDisabled
                                    }
                                  >
                                    Previous
                                  </Text>
                                </TouchableOpacity>

                                <Text style={styles.replyPageText}>
                                  Page{" "}
                                  {replies[comment.commentId].pagination.page} /{" "}
                                  {replies[comment.commentId].pagination
                                    .totalPages || 1}
                                </Text>

                                <TouchableOpacity
                                  style={[
                                    styles.replyPageBtn,
                                    replies[comment.commentId].pagination.page <
                                    replies[comment.commentId].pagination
                                      .totalPages
                                      ? styles.replyPageBtnActive
                                      : styles.replyPageBtnDisabled,
                                  ]}
                                  disabled={
                                    replies[comment.commentId].pagination
                                      .page >=
                                    replies[comment.commentId].pagination
                                      .totalPages
                                  }
                                  onPress={() =>
                                    handleReplyPageChange(
                                      comment.commentId,
                                      replies[comment.commentId].pagination
                                        .page + 1
                                    )
                                  }
                                >
                                  <Text
                                    style={
                                      replies[comment.commentId].pagination
                                        .page <
                                      replies[comment.commentId].pagination
                                        .totalPages
                                        ? styles.replyPageBtnTextActive
                                        : styles.replyPageBtnTextDisabled
                                    }
                                  >
                                    Next
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </>
                          ) : (
                            <Text style={styles.noReplies}>
                              {replies[comment.commentId].note}
                            </Text>
                          )}
                        </View>
                      )}
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
  // Reply styles
  replyButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  replyButtonText: {
    fontSize: 12,
    color: "#0369a1",
    fontWeight: "500",
  },
  replyInputContainer: {
    flexDirection: "column",
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 4,
    gap: 5,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  replyInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  replyAvatar: {
    marginRight: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  replyAvatarImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  replyInput: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    color: "#333",
    maxHeight: 80,
  },
  replySubmitBtn: {
    alignSelf: "flex-end",
    padding: 6,
    borderRadius: 16,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  replySubmitBtnDisabled: {
    backgroundColor: "#bfdbfe",
  },
  repliesContainer: {
    marginTop: 8,
    marginLeft: 16,
    paddingLeft: 10,
    paddingTop: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#93c5fd",
    backgroundColor: "#f8fafc",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  repliesTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 8,
  },
  replyItem: {
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    marginRight: 4,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  replyAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  replyAuthorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  replyAuthor: {
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
  },
  replyTime: {
    fontSize: 11,
    color: "#94a3b8",
  },
  replyContent: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
  },
  replyToReplyButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 2,
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  noReplies: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#94a3b8",
    marginBottom: 8,
  },
  replyPaginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    gap: 8,
  },
  replyPageBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  replyPageBtnActive: {
    backgroundColor: "#60a5fa",
  },
  replyPageBtnDisabled: {
    backgroundColor: "#f1f5f9",
  },
  replyPageBtnTextActive: {
    fontSize: 11,
    color: "#fff",
  },
  replyPageBtnTextDisabled: {
    fontSize: 11,
    color: "#94a3b8",
  },
  replyPageText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#0369a1",
  },
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
  // Facebook style comment input
  facebookCommentContainer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
    paddingBottom: 8,
    width: "100%",
    position: "relative",
  },
  facebookCommentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  commentAvatar: {
    marginRight: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  mainCommentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  facebookCommentInput: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    maxHeight: 80,
  },
  facebookCommentSubmitBtn: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  facebookCommentSubmitBtnDisabled: {
    opacity: 0.5,
  },
  facebookCommentToolbar: {
    flexDirection: "row",
    paddingHorizontal: 54,
    marginTop: 4,
  },
  facebookCommentToolbarBtn: {
    padding: 6,
    marginRight: 16,
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
    borderTopWidth: 6,
    borderTopColor: "#f1f5f9",
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentAuthorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
