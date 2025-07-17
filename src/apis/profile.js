import axiosClient from "./axiosClient";

const getProfile = async () => {
  try {
    console.log(process.env.EXPO_PUBLIC_API_URL, "users/me");
    return await axiosClient.get("users/me");
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (fullName, userId, avatarFile) => {
  try {
    console.log(fullName, userId, avatarFile, "fullName, userId, avatarFile");
    const formData = new FormData();
    formData.append("fullName", fullName);
    if (avatarFile) {
      formData.append("file", {
        uri: avatarFile.uri,
        name: avatarFile.name || "avatar.jpg",
        type: avatarFile.type || "image/jpeg",
      });
    }
    return await axiosClient.patch(`users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export { getProfile, updateProfile };
