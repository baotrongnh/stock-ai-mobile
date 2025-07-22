import axiosClient from "./axiosClient";

const getCommnentsByPostId = async (
  postId,
  page = 1,
  pageSize = 10,
  includeReplies = false
) => {
  try {
    const res = await axiosClient.get(
      `comments/post/${postId}?page=${page}&pageSize=${pageSize}&includeReplies=${includeReplies}`
    );
    if (res && res.data && Array.isArray(res.data.data)) {
      const comments = res.data.data;
      return {
        count: comments.length,
        comments,
        pagination: res.data.pagination,
        note:
          comments.length === 0 ? "Không có comment nào cho bài viết này." : "",
      };
    } else {
      return {
        count: 0,
        comments: [],
        pagination: { page, pageSize, total: 0, totalPages: 0 },
        note: "Không có comment nào cho bài viết này.",
      };
    }
  } catch (error) {
    console.error("Error in getComment:", error);
    return {
      count: 0,
      comments: [],
      pagination: { page, pageSize, total: 0, totalPages: 0 },
      note: "Không có comment nào cho bài viết này.",
    };
  }
};

const createComment = async ({ postId, content }) => {
  try {
    const res = await axiosClient.post("comments", { postId, content });
    return res.data;
  } catch (error) {
    console.error("Error in createComment:", error);
    return { error: true, message: "Không thể gửi comment." };
  }
};

const createReplyComment = async ({ commentId, content }) => {
  try {
    const res = await axiosClient.post(`comments/${commentId}/reply`, {
      content,
    });
    return res.data;
  } catch (error) {
    console.error("Error in createReplyComment:", error);
    return { error: true, message: "Không thể gửi reply." };
  }
};

const getRepliesByCommentId = async (commentId, page = 1, pageSize = 10) => {
  try {
    const res = await axiosClient.get(
      `comments/${commentId}/replies?page=${page}&pageSize=${pageSize}`
    );
    if (res && res.data && Array.isArray(res.data.data)) {
      const replies = res.data.data;
      return {
        count: replies.length,
        replies,
        pagination: res.data.pagination,
        note: replies.length === 0 ? "Không có reply nào cho comment này." : "",
      };
    } else {
      return {
        count: 0,
        replies: [],
        pagination: { page, pageSize, total: 0, totalPages: 0 },
        note: "Không có reply nào cho comment này.",
      };
    }
  } catch (error) {
    console.error("Error in getRepliesByCommentId:", error);
    return {
      count: 0,
      replies: [],
      pagination: { page, pageSize, total: 0, totalPages: 0 },
      note: "Không có reply nào cho comment này.",
    };
  }
};

export {
  getCommnentsByPostId,
  createComment,
  createReplyComment,
  getRepliesByCommentId,
};
