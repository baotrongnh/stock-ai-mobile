import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView, Pressable } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const featured = [
  {
    id: 1,
    tag: "Stock Analysis",
    type: "video",
    title: "GVR Quý 1/2025: Lợi nhuận tăng mạnh, dòng tiền dồi dào",
    desc: "Phân tích chi tiết kết quả kinh doanh quý 1/2025 của GVR và triển vọng đầu tư",
    image: "https://dummyimage.com/400x220/ddd/aaa.png&text=Video+1",
    views: 12500,
    time: "15:32",
    author: "Đầu Tư Chứng Khoán",
    date: "2 ngày trước",
    featured: true,
  },
  {
    id: 2,
    tag: "Market Analysis",
    type: "video",
    title: "Top 3 ngành hàng lớn nhất Việt Nam năm 2024 - Dựa theo tổng tài sản mới nhất",
    desc: "Khám phá 3 ngành hàng có tổng tài sản lớn nhất tại Việt Nam và cơ hội đầu tư",
    image: "https://dummyimage.com/400x220/ddd/aaa.png&text=Video+2",
    views: 8900,
    time: "22:45",
    author: "Đầu Tư Chứng Khoán",
    date: "3 ngày trước",
    featured: true,
  },
  {
    id: 3,
    tag: "Company Analysis",
    type: "video",
    title: "Phân tích kỹ thuật bức tranh kinh doanh của Vinamilk trong 3 năm gần đây",
    desc: "Đánh giá toàn diện về tình hình kinh doanh và triển vọng của Vinamilk",
    image: "https://dummyimage.com/400x220/ddd/aaa.png&text=Video+3",
    views: 15600,
    time: "18:20",
    author: "Đầu Tư Chứng Khoán",
    date: "1 tuần trước",
    featured: true,
  },
];

const latest = [
  {
    id: 4,
    tag: "podcast",
    type: "podcast",
    title: "Podcast: Đầu tư dài hạn và bí quyết thành công",
    image: "https://dummyimage.com/400x220/222/fff.png&text=Podcast+1",
    time: "45:12",
  },
  {
    id: 5,
    tag: "video",
    type: "video",
    title: "Video: Tổng quan thị trường tháng 6",
    image: "https://dummyimage.com/400x220/222/fff.png&text=Video+4",
    time: "12:30",
  },
  {
    id: 6,
    tag: "podcast",
    type: "podcast",
    title: "Podcast: Phân tích cổ phiếu tiềm năng",
    image: "https://dummyimage.com/400x220/222/fff.png&text=Podcast+2",
    time: "38:45",
  },
];

export default function Podcast() {
  const [playingId, setPlayingId] = useState(null);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Videos & Podcasts</Text>
          <Text style={styles.subtitle}>Watch expert analysis and listen to market insights from top financial professionals</Text>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 6 }} />
            <TextInput placeholder="Search videos and podcasts..." style={styles.input} />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Latest Podcasts - Stack view */}
        <Text style={styles.sectionTitle}>Latest Podcasts</Text>
        <View style={styles.podcastStack}>
          {latest.map((item) => (
            <Pressable key={item.id} style={styles.podcastCard} onPress={() => navigation.navigate("PodcastDetail", { podcast: item })}>
              <Image source={{ uri: item.image }} style={styles.podcastImage} />
              <View style={styles.podcastInfo}>
                <Text style={styles.podcastTitle}>{item.title}</Text>
                <Text style={styles.podcastTime}>
                  <Ionicons name="time" size={13} /> {item.time}
                </Text>
              </View>
              <TouchableOpacity style={styles.playBtn} onPress={() => setPlayingId(playingId === item.id ? null : item.id)}>
                <Ionicons name={playingId === item.id ? "pause-circle" : "play-circle"} size={38} color="#ef4444" />
              </TouchableOpacity>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#f3f4f6" },
  title: { fontSize: 22, fontWeight: "bold", color: "#222", marginBottom: 4 },
  subtitle: { color: "#666", fontSize: 14, marginBottom: 8 },
  searchRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginTop: 10, marginBottom: 8 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, elevation: 1 },
  input: { flex: 1, fontSize: 15, padding: 0 },
  filterBtn: { marginLeft: 8, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 6, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ef4444" },
  sectionTitle: { fontSize: 17, fontWeight: "bold", marginHorizontal: 16, marginTop: 18, marginBottom: 8, color: "#222" },
  featuredCard: { width: 280, backgroundColor: "#fff", borderRadius: 12, marginLeft: 16, marginRight: 8, elevation: 2, overflow: "hidden", position: "relative" },
  featuredImage: { width: "100%", height: 120, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  featuredBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "#ef4444", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, zIndex: 2 },
  featuredBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  featuredContent: { padding: 12 },
  tagRow: { flexDirection: "row", alignItems: "center", marginBottom: 4, gap: 6 },
  tag: { backgroundColor: "#e0e7ff", color: "#2563eb", fontSize: 11, borderRadius: 6, paddingHorizontal: 6, marginRight: 6 },
  typeTag: { backgroundColor: "#f3f4f6", color: "#222", fontSize: 11, borderRadius: 6, paddingHorizontal: 6 },
  featuredTitle: { fontWeight: "bold", fontSize: 15, marginBottom: 2, color: "#222" },
  featuredDesc: { color: "#444", fontSize: 13, marginBottom: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: 2 },
  metaText: { color: "#888", fontSize: 12 },
  metaDot: { color: "#bbb", marginHorizontal: 4 },
  podcastStack: { marginTop: 8, marginHorizontal: 8 },
  podcastCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 14,
    padding: 10,
    elevation: 1,
    shadowColor: "#ef4444",
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  podcastImage: { width: 70, height: 70, borderRadius: 10, backgroundColor: "#eee" },
  podcastInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  podcastTitle: { fontWeight: "bold", fontSize: 15, color: "#222", marginBottom: 4 },
  podcastTime: { color: "#888", fontSize: 13 },
  playBtn: { marginLeft: 8, alignItems: "center", justifyContent: "center" },
});
