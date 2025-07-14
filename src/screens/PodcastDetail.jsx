import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const podcast = {
  title: "Podcast: Đầu tư dài hạn và bí quyết thành công",
  expert: { fullName: "Nguyễn Văn A", avatarUrl: null },
  createdAt: "2024-07-04T19:34:31.504Z",
  viewCount: 1234,
  likeCount: 56,
  session: 3,
  level: "MARKET",
  topic: "Đầu tư dài hạn",
  sentiment: "POSITIVE",
  sourceUrl: "https://dummyimage.com/400x400/222/fff.png&text=Podcast+1",
  content: "Đây là nội dung podcast về đầu tư dài hạn và bí quyết thành công trên thị trường chứng khoán. ...",
  duration: 2712, // giây (45:12)
};

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PodcastDetail() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const duration = podcast.duration;

  React.useEffect(() => {
    let timer;
    if (playing && progress < duration) {
      timer = setInterval(() => setProgress((p) => Math.min(p + 1, duration)), 1000);
    }
    return () => clearInterval(timer);
  }, [playing, progress, duration]);

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#18181b" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Ảnh podcast lớn */}
        <Image source={{ uri: podcast.sourceUrl }} style={styles.image} />
        {/* Tiêu đề và chuyên gia */}
        <Text style={styles.title}>{podcast.title}</Text>
        <Text style={styles.expert}>{podcast.expert?.fullName || "Chuyên gia"}</Text>
        {/* Progress + Play */}
        <View style={styles.playerBox}>
          <View style={styles.progressRow}>
            <Text style={styles.timeText}>{formatTime(progress)}</Text>
            <View style={styles.progressBarBox}>
              <View style={styles.progressBarBg} />
              <View style={[styles.progressBarFg, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          <TouchableOpacity style={styles.playBtn} onPress={() => setPlaying((p) => !p)} activeOpacity={0.8}>
            <Ionicons name={playing ? "pause" : "play"} size={38} color="#fff" style={{ marginLeft: playing ? 0 : 4 }} />
          </TouchableOpacity>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="heart-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Nội dung/miêu tả */}
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{podcast.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 0, backgroundColor: "#18181b", minHeight: "100%" },
  image: {
    width: 260,
    height: 260,
    borderRadius: 18,
    marginTop: 32,
    marginBottom: 24,
    alignSelf: "center",
    backgroundColor: "#222",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 24,
    marginBottom: 6,
  },
  expert: {
    color: "#a1a1aa",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },
  playerBox: { width: "100%", alignItems: "center", marginBottom: 18 },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "86%",
    alignSelf: "center",
    marginBottom: 8,
  },
  progressBarBox: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#27272a",
    marginHorizontal: 10,
    overflow: "hidden",
    position: "relative",
  },
  progressBarBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#27272a",
    borderRadius: 3,
  },
  progressBarFg: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#ef4444",
    borderRadius: 3,
  },
  timeText: { color: "#a1a1aa", fontSize: 12, width: 38, textAlign: "center" },
  playBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    marginTop: 8,
    shadowColor: "#ef4444",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8,
    gap: 24,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 20,
  },
  contentBox: {
    backgroundColor: "#23232b",
    borderRadius: 16,
    marginHorizontal: 18,
    padding: 18,
    marginTop: 8,
    marginBottom: 32,
    elevation: 0,
    alignSelf: "stretch",
  },
  contentText: { color: "#fff", fontSize: 15, lineHeight: 22, textAlign: "center" },
});
