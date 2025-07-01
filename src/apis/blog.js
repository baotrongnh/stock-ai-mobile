import axiosClient from "./axiosClient"

const getAllBlogs = async () => {
     try {
          return await axiosClient.get('/blogs')
     } catch (error) {
          console.error('Error in getAllBlogs:', error)
          throw error
     }
}

export { getAllBlogs }
