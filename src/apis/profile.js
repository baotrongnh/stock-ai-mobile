import axiosClient from "./axiosClient"

const getProfile = async () => {
  try {
    console.log(process.env.EXPO_PUBLIC_API_URL,'auth/me')
    return await axiosClient.get('auth/me')
  } catch (error) {
    console.log(error)
  }
}

const updateProfile = async (fullName, userId) => {
  try {
    console.log(fullName, userId, 'fullName, userId')
    return await axiosClient.patch(`users/${userId}`, { fullName })
  } catch (error) {
    console.log(error)
  }
}

export { getProfile, updateProfile }