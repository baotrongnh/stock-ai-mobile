import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { AppNavigator } from "./src/navigation";
import { addNotificationReceivedListener, addNotificationResponseReceivedListener } from "./src/notifications/index";
import { Alert } from "react-native";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Lắng nghe thông báo khi ứng dụng ở foreground
    const notificationListener = addNotificationReceivedListener((notification) => {
      Alert.alert(notification.request.content.title || "Thông báo mới", notification.request.content.body || "Bạn có một thông báo mới!");
    });

    // Lắng nghe khi người dùng nhấn vào thông báo
    const responseListener = addNotificationResponseReceivedListener((response) => {
      const { extraData } = response.notification.request.content.data || {};
      Alert.alert("Thông báo được nhấn", `Dữ liệu: ${JSON.stringify(extraData)}`);
      // Có thể điều hướng hoặc xử lý dựa trên extraData
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
