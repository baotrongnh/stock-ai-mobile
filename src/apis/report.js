import axiosClient from "./axiosClient";

export const reportBlogOrComment = async ({
  postId,
  commentId,
  reason,
  status,
}) => {
  try {
    const response = await axiosClient.post("/reports", {
      postId,
      commentId: null,
      reason,
      status,
    });
    return response;
  } catch (error) {
    console.error("Error reporting:", error);
    throw error;
  }
};
