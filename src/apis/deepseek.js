import axiosClient from './axiosClient';

const sendChatMessage = async (messages) => {
  try {

    const lastMessage = messages[messages.length - 1];
    const response = await axiosClient.post(process.env.EXPO_PUBLIC_API_URL + 'ai/chat', {
      message: lastMessage.text  
    });
    return response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

export { sendChatMessage }