import axiosClient from "./axiosClient"

const getProfile = async () => {
  try {
    console.log(process.env.EXPO_PUBLIC_API_URL, 'auth/me')
    return await axiosClient.get('auth/me')
  } catch (error) {
    console.log(error)
  }
}

export { getProfile }