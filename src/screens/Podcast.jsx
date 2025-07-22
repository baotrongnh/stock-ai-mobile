import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  getPublishedPodcasts,
  getFeaturedPodcasts,
  incrementPlayCount,
  formatDuration,
  formatRelativeTime,
} from "../apis/podcast";

// Fallback featured data in case API fails
const featuredDefault = [
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
    title:
      "Top 3 ngành hàng lớn nhất Việt Nam năm 2024 - Dựa theo tổng tài sản mới nhất",
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
    title:
      "Phân tích kỹ thuật bức tranh kinh doanh của Vinamilk trong 3 năm gần đây",
    desc: "Đánh giá toàn diện về tình hình kinh doanh và triển vọng của Vinamilk",
    image: "https://dummyimage.com/400x220/ddd/aaa.png&text=Video+3",
    views: 15600,
    time: "18:20",
    author: "Đầu Tư Chứng Khoán",
    date: "1 tuần trước",
    featured: true,
  },
];

// Fallback latest data in case API fails
const latestDefault = [
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
  const [podcasts, setPodcasts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, video, podcast
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Function to normalize tags (handle both string and array cases)
  const normalizeTags = (tags) => {
    if (!tags) return [];
    if (typeof tags === "string") {
      // If it's a single string, treat it as one tag
      return [tags];
    }
    if (Array.isArray(tags)) {
      return tags;
    }
    return [];
  };

  // Function to format podcast data from API to match our component needs
  const formatPodcastData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((item, index) => ({
      id: item.podcastId || item.id || index + 1, // Use podcastId, fall back to id, then to index+1
      podcastId: item.podcastId || item.id || index + 1,
      tag: normalizeTags(item.tags)[0] || item.category || "Podcast",
      tags: normalizeTags(item.tags),
      type: item.fileFormat === "video" ? "video" : "podcast",
      title: item.title || `Podcast ${index + 1}`,
      desc: item.description || "",
      image:
        item.coverImage ||
        `https://dummyimage.com/400x220/222/fff.png&text=${encodeURIComponent(
          item.title || "Podcast"
        )}`,
      audioUrl: item.audioUrl,
      time: formatDuration(item.duration || 0),
      duration: item.duration || 0,
      author: item.client?.clientName || item.uploadedBy || "Stock Intel",
      date: formatRelativeTime(item.createdAt),
      createdAt: item.createdAt,
      isFeatured: item.isFeatured || false,
      playCount: item.playCount || 0,
      fileSize: item.fileSize,
      status: item.status || "published",
    }));
  };

  // Fetch podcasts when the component mounts or when it comes into focus or page changes
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [currentPage])
  );

  // Function to load all data
  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadPublishedPodcasts(), loadFeaturedPodcasts()]);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch published podcasts
  const loadPublishedPodcasts = async () => {
    try {
      // Get all published podcasts with pagination
      const response = await getPublishedPodcasts(currentPage, 10, "published");

      console.log("Published podcasts API response:", response);

      // Extract data from response
      let podcastData = [];
      let paginationData = { total: 0, totalPages: 1 };

      if (response && response.data) {
        // Determine which property contains the actual podcast array
        if (Array.isArray(response.data)) {
          podcastData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          podcastData = response.data.data;

          // Extract pagination info if available
          if (response.data.pagination) {
            paginationData = response.data.pagination;
          }
        } else if (response.data.items && Array.isArray(response.data.items)) {
          podcastData = response.data.items;
        } else if (
          response.data.podcasts &&
          Array.isArray(response.data.podcasts)
        ) {
          podcastData = response.data.podcasts;
        } else {
          console.warn(
            "Unexpected API response format for published podcasts:",
            response.data
          );
        }

        const formattedData = formatPodcastData(podcastData);

        // Update state with formatted data
        if (formattedData.length > 0) {
          setLatest(formattedData);
          setPodcasts(formattedData);
        } else {
          setLatest([]);
          setPodcasts([]);
          setError("There is no podcast");
        }

        // Update pagination info
        setTotalPages(paginationData.totalPages || 1);
      } else {
        // If API call was unsuccessful, use default data
        setLatest([]);
        setError("Failed to fetch published podcasts");
      }
    } catch (err) {
      console.error("Error fetching published podcasts:", err);
      setError("Đã xảy ra lỗi khi tải podcast. Vui lòng thử lại sau.");
      setLatest([]);
    }
  };

  // Function to fetch featured podcasts
  const loadFeaturedPodcasts = async () => {
    try {
      // Get featured podcasts
      const response = await getFeaturedPodcasts(1, 3);

      console.log("Featured podcasts API response:", response);

      // Extract data from response
      let featuredData = [];

      if (response && response.data) {
        // Determine which property contains the featured podcast array
        if (Array.isArray(response.data)) {
          featuredData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          featuredData = response.data.data;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          featuredData = response.data.items;
        } else if (
          response.data.podcasts &&
          Array.isArray(response.data.podcasts)
        ) {
          featuredData = response.data.podcasts;
        } else {
          console.warn(
            "Unexpected API response format for featured podcasts:",
            response.data
          );
        }

        const formattedData = formatPodcastData(featuredData);

        // Update state with formatted data
        if (formattedData.length > 0) {
          setFeatured(formattedData);
        } else {
          setFeatured([]);
          // Không cần hiển thị thông báo lỗi cho featured vì đã có latest
        }
      } else {
        // If API call was unsuccessful, use default data
        setFeatured([]);
      }
    } catch (err) {
      console.error("Error fetching featured podcasts:", err);
      setFeatured([]);
    }
  };

  // Handle playing podcast and increment play count
  const handlePlayPodcast = async (podcast) => {
    try {
      // If same podcast is clicked, toggle play/pause
      if (playingId === podcast.id) {
        setPlayingId(null);
        setIsPlaying(false);
        return;
      }

      // Set new playing podcast
      setPlayingId(podcast.id);
      setIsPlaying(true);

      // Navigate to podcast detail screen
      navigation.navigate("PodcastDetail", { podcast });

      // Increment play count if podcast has an ID
      if (podcast.podcastId) {
        try {
          await incrementPlayCount(podcast.podcastId);

          // Update local state to reflect new play count
          setPodcasts((prev) =>
            prev.map((p) =>
              p.podcastId === podcast.podcastId
                ? { ...p, playCount: p.playCount + 1 }
                : p
            )
          );
          setFeatured((prev) =>
            prev.map((p) =>
              p.podcastId === podcast.podcastId
                ? { ...p, playCount: p.playCount + 1 }
                : p
            )
          );
          setLatest((prev) =>
            prev.map((p) =>
              p.podcastId === podcast.podcastId
                ? { ...p, playCount: p.playCount + 1 }
                : p
            )
          );
        } catch (error) {
          console.error("Error incrementing play count:", error);
        }
      }
    } catch (error) {
      console.error("Error playing podcast:", error);
      Alert.alert("Lỗi", "Không thể phát podcast này. Vui lòng thử lại sau.");
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Filter podcasts based on search query
  const filteredLatest = latest.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.desc &&
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filter === "all" || item.type === filter;

    return matchesSearch && matchesFilter;
  });

  const handleFilterPress = () => {
    // Cycle through filter options: all -> podcast -> video -> all
    if (filter === "all") setFilter("podcast");
    else if (filter === "podcast") setFilter("video");
    else setFilter("all");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Videos & Podcasts</Text>
          <Text style={styles.subtitle}>
            Watch expert analysis and listen to market insights from top
            financial professionals
          </Text>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={18}
              color="#aaa"
              style={{ marginRight: 6 }}
            />
            <TextInput
              placeholder="Search videos and podcasts..."
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              filter !== "all" && {
                backgroundColor: "#fff5f5",
                borderColor: "#ef4444",
              },
            ]}
            onPress={handleFilterPress}
          >
            <Text style={{ color: "#ef4444", fontWeight: "bold" }}>
              {filter === "all"
                ? "Filter"
                : filter === "podcast"
                ? "Podcasts"
                : "Videos"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Featured Podcasts - Horizontal scroll */}
        {featured.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Featured Content</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 20 }}
            >
              {featured.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.featuredCard}
                  onPress={() => handlePlayPodcast(item)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.featuredImage}
                  />
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>FEATURED</Text>
                  </View>
                  <View style={styles.featuredContent}>
                    <View style={styles.tagRow}>
                      <Text style={styles.tag}>{item.tag}</Text>
                      <Text style={styles.typeTag}>{item.type}</Text>
                    </View>
                    <Text style={styles.featuredTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.desc && (
                      <Text style={styles.featuredDesc} numberOfLines={2}>
                        {item.desc}
                      </Text>
                    )}
                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>{item.author}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Text style={styles.metaText}>{item.date}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* Latest Podcasts - Stack view */}
        <Text style={styles.sectionTitle}>Latest Podcasts</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ef4444" />
            <Text style={styles.loadingText}>Loading podcasts...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : filteredLatest.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="albums-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Không tìm thấy podcast nào</Text>
            {searchQuery ? (
              <Text style={styles.emptySubtext}>
                Hãy thử từ khóa tìm kiếm khác
              </Text>
            ) : (
              <Text style={styles.emptySubtext}>
                Hiện không có podcast nào khả dụng
              </Text>
            )}
          </View>
        ) : (
          <>
            <View style={styles.podcastStack}>
              {filteredLatest.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.podcastCard}
                  onPress={() => handlePlayPodcast(item)}
                >
                  <Image
                    source={{
                      uri:
                        item.image ||
                        "https://dummyimage.com/150x150/222/fff.png&text=Podcast",
                    }}
                    style={styles.podcastImage}
                  />
                  <View style={styles.podcastInfo}>
                    <Text style={styles.podcastTitle}>{item.title}</Text>
                    <Text style={styles.podcastAuthor}>{item.author}</Text>
                    <View style={styles.podcastMeta}>
                      <Text style={styles.podcastTime}>
                        <Ionicons name="time" size={13} /> {item.time}
                      </Text>
                      {item.playCount > 0 && (
                        <Text style={styles.podcastPlays}>
                          <Ionicons name="play" size={13} />{" "}
                          {item.playCount.toLocaleString()}
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={() => handlePlayPodcast(item)}
                  >
                    <Ionicons
                      name={
                        playingId === item.id ? "pause-circle" : "play-circle"
                      }
                      size={38}
                      color="#ef4444"
                    />
                  </TouchableOpacity>
                </Pressable>
              ))}
            </View>

            {/* Pagination */}
            {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Ionicons
                    name="chevron-back"
                    size={18}
                    color={currentPage === 1 ? "#ccc" : "#666"}
                  />
                  <Text
                    style={[
                      styles.paginationButtonText,
                      currentPage === 1 && styles.paginationButtonTextDisabled,
                    ]}
                  >
                    Trước
                  </Text>
                </TouchableOpacity>

                <Text style={styles.paginationInfo}>
                  {currentPage} / {totalPages}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === totalPages &&
                      styles.paginationButtonDisabled,
                  ]}
                  onPress={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Text
                    style={[
                      styles.paginationButtonText,
                      currentPage === totalPages &&
                        styles.paginationButtonTextDisabled,
                    ]}
                  >
                    Sau
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={currentPage === totalPages ? "#ccc" : "#666"}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 32 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#222", marginBottom: 4 },
  subtitle: { color: "#666", fontSize: 14, marginBottom: 8 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    elevation: 1,
  },
  input: { flex: 1, fontSize: 15, padding: 0 },
  filterBtn: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
    color: "#222",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: { marginTop: 10, color: "#666", fontSize: 14 },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  errorText: {
    marginTop: 10,
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: { marginTop: 10, color: "#666", fontSize: 16, fontWeight: "bold" },
  emptySubtext: { color: "#999", fontSize: 14, marginTop: 5 },
  podcastAuthor: { color: "#555", fontSize: 12, marginBottom: 2 },
  featuredCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginLeft: 16,
    marginRight: 8,
    elevation: 2,
    overflow: "hidden",
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  featuredBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  featuredContent: { padding: 12 },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  tag: {
    backgroundColor: "#e0e7ff",
    color: "#2563eb",
    fontSize: 11,
    borderRadius: 6,
    paddingHorizontal: 6,
    marginRight: 6,
  },
  typeTag: {
    backgroundColor: "#f3f4f6",
    color: "#222",
    fontSize: 11,
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  featuredTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
    color: "#222",
  },
  featuredDesc: { color: "#444", fontSize: 13, marginBottom: 8 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 2,
  },
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
  podcastImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  podcastInfo: { flex: 1, marginLeft: 14, justifyContent: "center" },
  podcastTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
    marginBottom: 4,
  },
  podcastMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  podcastTime: {
    color: "#888",
    fontSize: 13,
    marginRight: 10,
  },
  podcastPlays: {
    color: "#888",
    fontSize: 13,
  },
  playBtn: { marginLeft: 8, alignItems: "center", justifyContent: "center" },

  // Pagination styles
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paginationButtonDisabled: {
    backgroundColor: "#f9fafb",
    borderColor: "#f3f4f6",
  },
  paginationButtonText: {
    color: "#374151",
    fontSize: 14,
    marginHorizontal: 4,
  },
  paginationButtonTextDisabled: {
    color: "#9ca3af",
  },
  paginationInfo: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#4b5563",
  },
});
