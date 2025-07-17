import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, Alert } from "react-native";
import { sendChatMessage, testDeepSeekConnection } from "../apis/deepseek";

const SUGGESTIONS = [
  "Phân tích cổ phiếu VNM hiện tại",
  "Tóm tắt thị trường chứng khoán VN hôm nay",
  "Top 5 cổ phiếu ngân hàng nên quan tâm",
  "Giải thích chỉ số P/E và P/B",
  "Dự báo xu hướng thị trường quý 4",
  "Cách đọc biểu đồ nến Nhật",
  "Phân tích nhóm cổ phiếu bất động sản",
  "Chiến lược đầu tư dài hạn cho người mới"
];

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào! Tôi là StockGPT - chuyên gia phân tích chứng khoán với hơn 20 năm kinh nghiệm. Tôi có thể giúp bạn:\n\n📈 Phân tích kỹ thuật và cơ bản\n📊 Đánh giá cổ phiếu và định giá\n📰 Theo dõi thị trường VN và quốc tế\n💡 Tư vấn chiến lược đầu tư\n\nHãy hỏi tôi bất cứ điều gì về chứng khoán!"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  // Test kết nối khi component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testDeepSeekConnection();
      if (!result.success) {
        Alert.alert(
          "Cảnh báo API",
          "Không thể kết nối Gemini API. Vui lòng kiểm tra API key trong file deepseek.js",
          [{ text: "OK" }]
        );
      }
    };
    checkConnection();
  }, []);

  const handleSend = async (customText) => {
    const text = typeof customText === "string" ? customText : input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: "user", text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Gửi tin nhắn đến DeepSeek API
      const response = await sendChatMessage(updatedMessages);

      const botMsg = {
        role: "bot",
        text: response.success ? response.message : "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        role: "bot",
        text: "Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối internet và thử lại.",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f9fafb" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={{ color: "#ef4444", fontWeight: "bold" }}>StockGPT</Text>
          </Text>
          <Text style={styles.subtitle}>AI tài chính - hỏi đáp cổ phiếu, thị trường</Text>
        </View>

        {/* Suggestions */}
        <View style={styles.suggestionBarWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionBar} contentContainerStyle={{ alignItems: "center", paddingHorizontal: 10, height: 40 }}>
            {SUGGESTIONS.map((s, idx) => (
              <TouchableOpacity key={idx} style={styles.suggestionBtn} onPress={() => setInput(input ? input.trim() + " " + s : s)}>
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat messages */}
        <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingVertical: 16 }} ref={scrollViewRef} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
          {messages.map((msg, idx) => (
            <View key={idx} style={[styles.messageRow, msg.role === "user" ? styles.userRow : styles.botRow]}>
              {msg.role === "bot" && (
                <View style={styles.avatarBot}>
                  <MaterialIcons name="smart-toy" size={22} color="#ef4444" />
                </View>
              )}
              <View style={[styles.bubble, msg.role === "user" ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.bubbleText, msg.role === "user" ? styles.userBubbleText : styles.botBubbleText]}>
                  {msg.text}
                </Text>
              </View>
              {msg.role === "user" && (
                <View style={styles.avatarUser}>
                  <Ionicons name="person-circle" size={22} color="#888" />
                </View>
              )}
            </View>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <View style={[styles.messageRow, styles.botRow]}>
              <View style={styles.avatarBot}>
                <MaterialIcons name="smart-toy" size={22} color="#ef4444" />
              </View>
              <View style={[styles.bubble, styles.botBubble, styles.loadingBubble]}>
                <Text style={styles.loadingText}>Đang phân tích...</Text>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Hỏi về cổ phiếu, phân tích kỹ thuật, thị trường..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isLoading}
            multiline={true}
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 36, paddingBottom: 10, paddingHorizontal: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#f3f4f6" },
  logo: { fontSize: 22, fontWeight: "bold", marginBottom: 2 },
  subtitle: { color: "#666", fontSize: 13, marginBottom: 6 },
  suggestionBarWrapper: { backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#f3f4f6", height: 48, justifyContent: "center" },
  suggestionBar: { flexGrow: 0, height: 40 },
  suggestionBtn: { backgroundColor: "#f3f4f6", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, justifyContent: "center", height: 32 },
  suggestionText: { color: "#222", fontSize: 12, fontWeight: "500" },
  chatContainer: { flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 10 },
  messageRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 12, paddingHorizontal: 4 },
  userRow: { justifyContent: "flex-end" },
  botRow: { justifyContent: "flex-start" },
  bubble: { maxWidth: "75%", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 },
  userBubble: { backgroundColor: "#ef4444", marginLeft: 40 },
  botBubble: { backgroundColor: "#fff", marginRight: 40, borderWidth: 1, borderColor: "#f3f4f6" },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  userBubbleText: { color: "#fff" },
  botBubbleText: { color: "#222" },
  loadingBubble: { backgroundColor: "#f8f9fa" },
  loadingText: { color: "#666", fontSize: 14, marginBottom: 8 },
  typingDots: { flexDirection: "row", alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ef4444", marginRight: 4 },
  dot1: { animationDelay: "0s" },
  dot2: { animationDelay: "0.2s" },
  dot3: { animationDelay: "0.4s", marginRight: 0 },
  avatarBot: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#fde68a", alignItems: "center", justifyContent: "center", marginRight: 8 },
  avatarUser: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#e0e7ff", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  inputBar: { flexDirection: "row", alignItems: "flex-end", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderColor: "#f3f4f6" },
  input: { flex: 1, fontSize: 15, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: "#f3f4f6", borderRadius: 12, marginRight: 8, maxHeight: 100, minHeight: 40 },
  sendBtn: { backgroundColor: "#ef4444", borderRadius: 12, padding: 12, justifyContent: "center", alignItems: "center" },
  sendBtnDisabled: { backgroundColor: "#ccc" },
});
