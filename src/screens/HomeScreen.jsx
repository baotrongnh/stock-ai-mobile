  import React, { useEffect, useState } from 'react';
  import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
  import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
  import { registerForPushNotificationsAsync } from '../notifications';

  export default function HomeScreen() {
    const [token, setToken] = useState(null)
    useEffect(() => {
        const fetchToken = async () => {
        if (!token) { 
          try {
            const pushToken = await registerForPushNotificationsAsync();
            if (pushToken) {
              setToken(pushToken);
              Alert.alert('Expo Push Token', pushToken);
              console.log('Push Token:', pushToken);
              // Send token to the server
              // await fetch('https://your-server.com/save-token', {
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify({ username, token: pushToken }),
              // });
            } else {
              Alert.alert('Lỗi', 'Không thể lấy push token.');
            }
          } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra: ' + error.message);
          }
        }
      };
    }, [token]);
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
        {/* AppBar */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            <MaterialCommunityIcons name="fire" size={28} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, marginLeft: 6 }}>StockIntel</Text>
          </Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Welcome */}
          <Text style={styles.welcome}>Chào mừng bạn đến với <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>StockIntel</Text>!</Text>
          <Text style={styles.desc}>
            Nền tảng AI giúp bạn phân tích thị trường, cập nhật tin tức, blog, podcast và trò chuyện cùng trợ lý đầu tư thông minh.
          </Text>

          {/* Quick Actions */}
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard}>
              <Ionicons name="search" size={28} color="#ef4444" />
              <Text style={styles.quickLabel}>Phân tích cổ phiếu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <MaterialCommunityIcons name="robot-excited-outline" size={28} color="#ef4444" />
              <Text style={styles.quickLabel}>Chat AI</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <MaterialCommunityIcons name="microphone-outline" size={28} color="#ef4444" />
              <Text style={styles.quickLabel}>Podcast</Text>
            </TouchableOpacity>
          </View>

          {/* Section: Blog */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📰 Blog nổi bật</Text>
              <TouchableOpacity>
                <Text style={styles.sectionMore}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Đầu tư tài chính cho thế hệ mới</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>Khám phá chiến lược đầu tư thông minh cho giới trẻ Việt Nam.</Text>
                <Text style={styles.cardMore}>Đọc ngay →</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Fed giữ lãi suất: Cơ hội vàng?</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>Phân tích tác động của chính sách lãi suất đến thị trường.</Text>
                <Text style={styles.cardMore}>Đọc ngay →</Text>
              </View>
            </ScrollView>
          </View>

          {/* Section: Podcast */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎧 Podcast mới</Text>
              <TouchableOpacity>
                <Text style={styles.sectionMore}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.cardPodcast}>
                <MaterialCommunityIcons name="microphone" size={32} color="#ef4444" />
                <Text style={styles.cardTitle}>GVR Quý 1/2025: Lợi nhuận tăng mạnh</Text>
                <Text style={styles.cardMore}>Nghe ngay →</Text>
              </View>
              <View style={styles.cardPodcast}>
                <MaterialCommunityIcons name="microphone" size={32} color="#ef4444" />
                <Text style={styles.cardTitle}>Top ngành lớn nhất Việt Nam 2024</Text>
                <Text style={styles.cardMore}>Nghe ngay →</Text>
              </View>
            </ScrollView>
          </View>

          {/* Section: Gợi ý hôm nay */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Gợi ý hôm nay</Text>
            <View style={styles.suggestionBox}>
              <Ionicons name="bulb-outline" size={22} color="#ef4444" style={{ marginRight: 8 }} />
              <Text style={styles.suggestionText}>Hãy thử hỏi AI: "Cổ phiếu nào tiềm năng quý này?"</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
      paddingTop: 44,
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: '#ef4444',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      elevation: 4,
    },
    logo: { flexDirection: 'row', alignItems: 'center', fontSize: 22, fontWeight: 'bold' },
    notifBtn: { padding: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)' },
    contentContainer: { padding: 20, paddingBottom: 40 },
    welcome: { fontSize: 22, fontWeight: 'bold', color: '#ef4444', marginTop: 10, marginBottom: 4 },
    desc: { color: '#444', fontSize: 15, marginBottom: 18 },
    quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    quickCard: {
      backgroundColor: '#fff0f1',
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      paddingHorizontal: 18,
      width: '31%',
      elevation: 1,
    },
    quickLabel: { marginTop: 8, color: '#ef4444', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
    section: { marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    sectionTitle: { fontWeight: 'bold', fontSize: 17, color: '#ef4444' },
    sectionMore: { color: '#ef4444', fontWeight: 'bold', fontSize: 13 },
    card: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 16,
      marginRight: 14,
      width: 220,
      elevation: 2,
      shadowColor: '#ef4444',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      marginBottom: 8,
    },
    cardPodcast: {
      backgroundColor: '#fff',
      borderRadius: 14,
      padding: 16,
      marginRight: 14,
      width: 200,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#ef4444',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      marginBottom: 8,
    },
    cardTitle: { fontWeight: 'bold', fontSize: 15, color: '#222', marginBottom: 4, marginTop: 2, textAlign: 'center' },
    cardDesc: { color: '#444', fontSize: 13, marginBottom: 8 },
    cardMore: { color: '#ef4444', fontWeight: 'bold', fontSize: 13, marginTop: 2, textAlign: 'center' },
    suggestionBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff0f1',
      borderRadius: 12,
      padding: 14,
      marginTop: 10,
    },
    suggestionText: { color: '#ef4444', fontWeight: 'bold', fontSize: 15 },
  });