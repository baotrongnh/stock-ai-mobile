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

const createPost = async (postData) => {
  try {
    const formData = new FormData();

    // Add text fields
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("stockId", Number(postData.stockId));

    if (postData.file) {
      const uriParts = postData.file.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("file", {
        uri: postData.file,
        name: `post-image.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    return await axiosClient.post("posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error in createPost:", error);
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
