import axiosClient from './axiosClient';

// Điền API key Gemini của bạn vào đây
const GEMINI_API_KEY = 'AIzaSyCNALbZ2C3yauAL1stbKyEtIWMySgn10T0';

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Tạo client riêng cho Gemini
const geminiClient = {
  post: async (data) => {
    try {
      const response = await fetch(`${GEMINI_BASE_URL}/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
};

// System prompt cho trợ lý chứng khoán
const STOCK_ADVISOR_PROMPT = `Bạn là chuyên gia chứng khoán 20+ năm kinh nghiệm, thành thạo thị trường VN và quốc tế.

CHUYÊN MÔN: Phân tích kỹ thuật/cơ bản, định giá cổ phiếu, quản lý rủi ro, HOSE/HNX/UPCoM, phái sinh.

CÁCH TRẢ LỜI: Phân tích chuyên sâu nhưng dễ hiểu, cảnh báo rủi ro, không đưa lời khuyên tuyệt đối, thêm "không phải lời khuyên đầu tư" khi cần.

PHONG CÁCH: Thân thiện, chuyên nghiệp, giải thích thuật ngữ, có ví dụ cụ thể, trả lời tiếng Việt, RESPONSE GIỚI HẠN TRONG 100 TỪ`;

export const sendChatMessage = async (messages) => {
  try {
    // Tạo conversation history cho Gemini
    const conversationHistory = messages.map(msg => {
      if (msg.role === 'bot') {
        return {
          role: 'model',
          parts: [{ text: msg.text }]
        };
      } else {
        return {
          role: 'user',
          parts: [{ text: msg.text }]
        };
      }
    });

    // Thêm system instruction vào đầu cuộc hội thoại
    const systemInstruction = {
      role: 'user',
      parts: [{ text: STOCK_ADVISOR_PROMPT }]
    };

    const requestData = {
      contents: [systemInstruction, ...conversationHistory],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
        topK: 40,
        topP: 0.95,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await geminiClient.post(requestData);

    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      return {
        success: true,
        message: response.candidates[0].content.parts[0].text
      };
    } else {
      throw new Error('Invalid response format from Gemini');
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return {
      success: false,
      message: 'Xin lỗi, hiện tại tôi không thể kết nối được. Vui lòng thử lại sau.'
    };
  }
};

// Hàm để test API key
export const testDeepSeekConnection = async () => {
  try {
    const testData = {
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Hello, test connection' }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 10,
      }
    };

    const response = await geminiClient.post(testData);

    if (response.candidates && response.candidates[0]) {
      return {
        success: true,
        message: 'Kết nối Gemini API thành công!'
      };
    } else {
      throw new Error('Invalid response');
    }
  } catch (error) {
    return {
      success: false,
      message: 'Không thể kết nối Gemini API. Vui lòng kiểm tra API key.'
    };
  }
};
