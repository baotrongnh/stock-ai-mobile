import axiosClient from "./axiosClient"
const sendPushToken = async (token) => {
  try {
    const response = await axiosClient.post('/notifications/register-push-token', { token });
    return response.data;
  } catch (error) {
    console.error("Error sending push token:", error);
    throw new Error(`Error: ${error}`);
  }
}

export { sendPushToken };