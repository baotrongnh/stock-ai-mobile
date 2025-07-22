import React, { use, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotification } from '../context/NotificationContext';

export default function HomeScreen() {
  const { expoPushToken, notification, error } = useNotification();
  if (error) return <></>

  useEffect(() => {
    console.log(JSON.stringify(notification, null, 2));
    console.log("Expo Push Token: ", expoPushToken);
  }, [notification, expoPushToken]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
      {/* AppBar */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="fire" size={24} color="#fff" />
          <Text style={styles.logoText}>StockIntel</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome */}
        <Text style={styles.welcome}>Chào mừng bạn đến với <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>StockIntel</Text>!</Text>
        <Text style={styles.desc}>
          Nền tảng AI giúp bạn phân tích thị trường, cập nhật tin tức, blog, podcast và trò chuyện cùng trợ lý đầu tư thông minh.
        </Text>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickCard}>
            <Ionicons name="search" size={24} color="#ef4444" />
            <Text style={styles.quickLabel}>Phân tích
cổ phiếu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard}>
            <MaterialCommunityIcons name="robot-excited-outline" size={24} color="#ef4444" />
            <Text style={styles.quickLabel}>Chat AI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard}>
            <MaterialCommunityIcons name="microphone-outline" size={24} color="#ef4444" />
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 2 }}>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 2 }}>
            <View style={styles.cardPodcast}>
              <MaterialCommunityIcons name="microphone" size={26} color="#ef4444" />
              <Text style={styles.cardTitle}>GVR Quý 1/2025: Lợi nhuận tăng mạnh</Text>
              <Text style={styles.cardMore}>Nghe ngay →</Text>
            </View>
            <View style={styles.cardPodcast}>
              <MaterialCommunityIcons name="microphone" size={26} color="#ef4444" />
              <Text style={styles.cardTitle}>Top ngành lớn nhất Việt Nam 2024</Text>
              <Text style={styles.cardMore}>Nghe ngay →</Text>
            </View>
          </ScrollView>
        </View>

        {/* Section: Gợi ý hôm nay */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Gợi ý hôm nay</Text>
          <View style={styles.suggestionBox}>
            <Ionicons name="bulb-outline" size={18} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={styles.suggestionText}>Hãy thử hỏi AI: "Cổ phiếu nào tiềm năng?"</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 32,
    paddingHorizontal: 18,
    paddingBottom: 10,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 3,
  },
  logoText: { color: '#fff', fontWeight: 'bold', fontSize: 20, marginLeft: 6 },
  notifBtn: { padding: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)' },
  contentContainer: { padding: 18, paddingBottom: 32 },
  welcome: { fontSize: 20, fontWeight: 'bold', color: '#ef4444', marginTop: 8, marginBottom: 2, textAlign: 'center' },
  desc: { color: '#444', fontSize: 14, marginBottom: 16, textAlign: 'center' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  quickCard: {
    backgroundColor: '#fff0f1',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    width: '31%',
    elevation: 1,
    shadowColor: '#ef4444',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  quickLabel: { marginTop: 6, color: '#ef4444', fontWeight: 'bold', fontSize: 13, textAlign: 'center', lineHeight: 16 },
  section: { marginBottom: 18 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontWeight: 'bold', fontSize: 15, color: '#ef4444' },
  sectionMore: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    width: 200,
    elevation: 1,
    shadowColor: '#ef4444',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    marginBottom: 6,
  },
  cardPodcast: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    width: 180,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#ef4444',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    marginBottom: 6,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 14, color: '#222', marginBottom: 2, marginTop: 2, textAlign: 'center' },
  cardDesc: { color: '#444', fontSize: 12, marginBottom: 6 },
  cardMore: { color: '#ef4444', fontWeight: 'bold', fontSize: 12, marginTop: 2, textAlign: 'center' },
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f1',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginHorizontal: 2,
  },
  suggestionText: { color: '#ef4444', fontWeight: 'bold', fontSize: 13 },
});