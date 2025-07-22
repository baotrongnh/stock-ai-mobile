import axiosClient from "./axiosClient";

const getAllBlogs = async () => {
  try {
    return await axiosClient.get("posts");
  } catch (error) {
    console.error("Error in getAllBlogs:", error);
    throw error;
  }
};

const getLatestBlogs = async () => {
  try {
    return await axiosClient.get("posts", {
      params: {
        page: 1,
        pageSize: 10,
      },
    });
  } catch (error) {
    console.error("Error in getLatestBlogs:", error);
    throw error;
  }
};

const getBlogDetail = async (blogId) => {
  try {
    return await axiosClient.get(`posts/${blogId}`);
  } catch (error) {
    console.error("Error in getBlogDetail:", error);
    throw error;
  }
};

const getTrendingBlogs = async () => {
  try {
    return await axiosClient.get("posts/top-view", {
      params: {
        size: 4,
      },
    });
  } catch (error) {
    console.error("Error in getTrendingBlogs:", error);
    throw error;
  }
};

const createPost = async (title, content, stockId, file) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    if (content) formData.append("content", content);
    if (stockId !== undefined) formData.append("stockId", stockId.toString());
    if (file) {
      formData.append("file", file);
    }

    const response = await axiosClient.post("/posts", formData, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response && response.data && response.data.error === false) {
      return {
        success: true,
        message: "Post created successfully",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response?.data?.message || "Failed to create post",
        data: response?.data,
      };
    }
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export {
  getAllBlogs,
  getLatestBlogs,
  getBlogDetail,
  getTrendingBlogs,
  createPost,
};
