import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from "react-native";

const FAKE_BOT_RESPONSES = ["I'm StockGPT, your AI financial assistant. How can I help you today?", "Here's a quick summary of the market: S&P 500 is up 0.5%, tech stocks are leading.", "TSLA is showing strong momentum, but keep an eye on volatility.", "The P/E ratio is a valuation metric. A lower P/E can mean undervalued, but context matters.", "For portfolio review, diversify across sectors and rebalance quarterly.", "Let me know if you want a stock analysis or market news!"];

const SUGGESTIONS = ["Phân tích cổ phiếu AAPL", "Tóm tắt thị trường hôm nay", "Top cổ phiếu công nghệ nên theo dõi", "Giải thích chỉ số P/E", "Dự báo thị trường quý tới", "Đánh giá danh mục đầu tư"];

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "bot", text: "Xin chào! Tôi là StockGPT, trợ lý tài chính AI của bạn. Hãy hỏi tôi bất cứ điều gì về cổ phiếu hoặc thị trường." }]);
  const scrollViewRef = useRef();

  const handleSend = (customText) => {
    const text = typeof customText === "string" ? customText : input.trim();
    if (!text) return;
    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Fake bot response
    setTimeout(() => {
      const botMsg = {
        role: "bot",
        text: FAKE_BOT_RESPONSES[Math.floor(Math.random() * FAKE_BOT_RESPONSES.length)],
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 900);
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
                <Text style={styles.bubbleText}>{msg.text}</Text>
              </View>
              {msg.role === "user" && (
                <View style={styles.avatarUser}>
                  <Ionicons name="person-circle" size={22} color="#888" />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Chat Input */}
        <View style={styles.inputBar}>
          <TextInput style={styles.input} placeholder="Nhập câu hỏi về cổ phiếu, thị trường…" value={input} onChangeText={setInput} onSubmitEditing={handleSend} returnKeyType="send" />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
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
  suggestionBtn: { backgroundColor: "#f3f4f6", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, justifyContent: "center", height: 32 },
  suggestionText: { color: "#222", fontSize: 13, fontWeight: "bold" },
  chatContainer: { flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 10 },
  messageRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 10, paddingHorizontal: 4 },
  userRow: { justifyContent: "flex-end" },
  botRow: { justifyContent: "flex-start" },
  bubble: { maxWidth: "75%", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble: { backgroundColor: "#ef4444", marginLeft: 40 },
  botBubble: { backgroundColor: "#f3f4f6", marginRight: 40 },
  bubbleText: { color: "#222", fontSize: 15 },
  avatarBot: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fde68a", alignItems: "center", justifyContent: "center", marginRight: 8 },
  avatarUser: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#e0e7ff", alignItems: "center", justifyContent: "center", marginLeft: 8 },
  inputBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderColor: "#f3f4f6" },
  input: { flex: 1, fontSize: 15, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#f3f4f6", borderRadius: 8, marginRight: 8 },
  sendBtn: { backgroundColor: "#ef4444", borderRadius: 8, padding: 10 },
});
