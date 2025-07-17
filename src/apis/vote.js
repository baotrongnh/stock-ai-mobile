import axiosClient from "./axiosClient";

export const votePost = async (id, voteType) => {
    const response = await axiosClient.post(`/posts/${id}/vote`, { voteType })
    return response.data
}

export const saveFavoritePost = (postId) => {
  return axiosClient.post(`/posts/${postId}/favorite`);
};
