import axiosClient from "./axiosClient"

const getAllBlogs = async () => {
  try {
    return await axiosClient.get('posts')
  } catch (error) {
    console.error('Error in getAllBlogs:', error)
    throw error
  }
}

const getLatestBlogs = async () => {
  try {
    return await axiosClient.get('posts', {
      params: {
        page: 1,
        pageSize: 3
      }
    })
  } catch (error) {
    console.error('Error in getLatestBlogs:', error)
    throw error
  }
}

const getBlogDetail = async (blogId) => {
  try {
    return await axiosClient.get(`posts/${blogId}`)
  } catch (error) {
    console.error('Error in getBlogDetail:', error)
    throw error
  }
}

const getTrendingBlogs = async () => {
  try {
    return await axiosClient.get('posts/top-view', {
      params: {
        size: 4
      }
    })
  } catch (error) {
    console.error('Error in getTrendingBlogs:', error)
    throw error
  }
}

export { getAllBlogs, getLatestBlogs, getBlogDetail, getTrendingBlogs }
