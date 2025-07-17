import axiosClient from "./axiosClient";

export const reportBlogOrComment = ({ postId, commentId, reason, status }) => {
  return axiosClient.post("/reports", {
    postId,
    commentId,
    reason,
    status,
  });
};
