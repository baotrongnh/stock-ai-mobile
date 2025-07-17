import axiosClient from "./axiosClient";

export const reportBlogOrComment = ({ postId, commentId, reason, status }) => {
  console.log("postId:", postId);
  console.log("commentId:", commentId); 
  console.log("reason:", reason);
  console.log("status:", status);
  return axiosClient.post("/reports", {
    postId,
    commentId,
    reason,
    status,
  });
};
