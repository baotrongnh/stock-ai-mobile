import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getAllBlogs, getLatestBlogs, getTrendingBlogs } from "../apis/blog";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function Blog() {
  const navigation = useNavigation();
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    stockCode: "",
    sentiment: "",
    level: "",
    session: "",
  });

  const fetchLatestBlogs = async (pageNum = 1) => {
    try {
      const data = await getLatestBlogs(pageNum, pageSize);
      setLatestBlogs(data.data.data);
      if (data.data.pagination) {
        setPage(data.data.pagination.page);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      setLatestBlogs([]);
      setPage(1);
      setTotalPages(1);
    }
  };

  const fetchTrendingBlogs = async () => {
    const data = await getTrendingBlogs();
    setTrendingBlogs(data.data);
  };

  const applyFilters = (autoApply = false) => {
    setIsFiltering(true);

    let filtered = [...latestBlogs];

    // Filter by search term (stock symbol)
    if (searchTerm.trim()) {
      filtered = filtered.filter((blog) =>
        blog.stock?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by stock code (symbol) from filter panel
    if (filters.stockCode) {
      filtered = filtered.filter((blog) =>
        blog.stock?.symbol
          ?.toLowerCase()
          .includes(filters.stockCode.toLowerCase())
      );
    }

    // Filter by sentiment
    if (filters.sentiment) {
      filtered = filtered.filter(
        (blog) => blog.sentiment === filters.sentiment
      );
    }

    // Filter by level
    if (filters.level) {
      filtered = filtered.filter((blog) => blog.level === filters.level);
    }

    // Filter by session (1: sáng, 2: chiều, 3: ngày)
    if (filters.session) {
      let sessionValue;
      if (filters.session === "Phiên sáng") sessionValue = 1;
      else if (filters.session === "Phiên chiều") sessionValue = 2;
      else if (filters.session === "Cả ngày") sessionValue = 3;

      if (sessionValue) {
        filtered = filtered.filter((blog) => blog.session === sessionValue);
      }
    }

    setFilteredBlogs(filtered);
    setIsFiltering(false);

    // Only close filter panel if it's manual apply (not auto-apply)
    if (!autoApply) {
      setShowFilter(false);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({ stockCode: "", sentiment: "", level: "", session: "" });
    setFilteredBlogs([]);
    setIsFiltering(false);
  };

  // Determine which blogs to display
  const displayBlogs =
    isFiltering ||
    searchTerm.trim() ||
    Object.values(filters).some((value) => value !== "")
      ? filteredBlogs
      : latestBlogs;

  useEffect(() => {
    fetchLatestBlogs(page);
    fetchTrendingBlogs();
  }, [page]);

  // Clear filters when screen is focused (user comes back to this tab)
  useFocusEffect(
    useCallback(() => {
      // Clear filters when tab is focused
      setSearchTerm("");
      setFilters({ stockCode: "", sentiment: "", level: "", session: "" });
      setFilteredBlogs([]);
      setIsFiltering(false);
      setShowFilter(false);
    }, [])
  );

  // Auto-apply search when search term changes
  useEffect(() => {
    if (
      searchTerm.trim() ||
      Object.values(filters).some((value) => value !== "")
    ) {
      applyFilters(true); // Pass true for auto-apply
    } else {
      setFilteredBlogs([]);
      setIsFiltering(false);
    }
  }, [searchTerm, filters, latestBlogs]);

  // Hàm chuyển trang
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.logo}>Market Insights</Text>
              <View style={styles.blogBadge}>
                <Text style={styles.blogBadgeText}>Blog</Text>
              </View>
            </View>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons
                  name="search"
                  size={18}
                  color="#aaa"
                  style={{ marginRight: 6 }}
                />
                <TextInput
                  placeholder="Search by stock symbol..."
                  style={styles.input}
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  onSubmitEditing={() => applyFilters(false)}
                  returnKeyType="search"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                />
                {searchTerm.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchTerm("")}
                    style={{ marginLeft: 6 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={18} color="#aaa" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => setShowFilter(!showFilter)}
              >
                <Text style={{ color: "#ef4444", fontWeight: "bold" }}>
                  Filter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filter Panel */}
        {showFilter && (
          <View style={styles.filterPanel}>
            {/* Stock Code Input */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Mã cổ phiếu</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Nhập mã cổ phiếu (VD: VNM, FPT)..."
                value={filters.stockCode}
                onChangeText={(text) =>
                  setFilters({ ...filters, stockCode: text })
                }
              />
            </View>

            {/* Sentiment Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sentiment</Text>
              <View style={styles.filterOptions}>
                {["POSITIVE", "NEGATIVE", "NEUTRAL"].map((sentiment) => (
                  <TouchableOpacity
                    key={sentiment}
                    style={[
                      styles.filterOption,
                      filters.sentiment === sentiment &&
                        styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        sentiment:
                          filters.sentiment === sentiment ? "" : sentiment,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.sentiment === sentiment &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {sentiment}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Level Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Level</Text>
              <View style={styles.filterOptions}>
                {["MARKET", "SYMBOL"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.filterOption,
                      filters.level === level && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        level: filters.level === level ? "" : level,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.level === level &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Session Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Session</Text>
              <View style={styles.filterOptions}>
                {["Phiên sáng", "Phiên chiều", "Cả ngày"].map((session) => (
                  <TouchableOpacity
                    key={session}
                    style={[
                      styles.filterOption,
                      filters.session === session && styles.filterOptionActive,
                    ]}
                    onPress={() =>
                      setFilters({
                        ...filters,
                        session: filters.session === session ? "" : session,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.session === session &&
                          styles.filterOptionTextActive,
                      ]}
                    >
                      {session}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filter Actions */}
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearBtnText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => applyFilters(false)}
              >
                <Text style={styles.applyBtnText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Actions Row */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate("CreatePost", {})}
          >
            <Text style={styles.createBtnText}>+ Create</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Section */}
        <View>
          <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {(trendingBlogs || []).map((blog) => (
              <TouchableOpacity
                key={blog.postId}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("BlogDetail", { blogId: blog?.postId })
                }
              >
                <Image
                  source={{ uri: blog.sourceUrl }}
                  style={styles.cardImage}
                />
                <View style={styles.cardContent}>
                  <View style={styles.tagRow}>
                    {blog.topic && (
                      <Text style={styles.trendingTag}>{blog.topic}</Text>
                    )}
                    <Text
                      style={[
                        styles.tag,
                        blog?.sentiment === "POSITIVE"
                          ? styles.positiveTag
                          : blog?.sentiment === "NEGATIVE"
                          ? styles.negativeTag
                          : null,
                      ]}
                    >
                      {blog?.sentiment}
                    </Text>
                  </View>
                  <Text style={styles.cardTitle}>{blog.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {blog.content}
                  </Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>👁 {blog.viewCount}</Text>
                    <Text style={styles.footerText}>👍 {blog.likeCount}</Text>
                    <Text style={styles.readMore}>Read More</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Latest Articles Section */}
        <View>
          <Text style={styles.sectionTitle}>
            📚 Latest Articles
            {searchTerm.trim() && ` - "${searchTerm}"`}
            {(searchTerm.trim() ||
              Object.values(filters).some((value) => value !== "")) &&
              ` (${displayBlogs.length} results)`}
          </Text>
          {displayBlogs.length === 0 &&
          (searchTerm.trim() ||
            Object.values(filters).some((value) => value !== "")) ? (
            <View
              style={{
                alignItems: "center",
                padding: 32,
                marginHorizontal: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#666",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {searchTerm.trim()
                  ? `No articles found for stock symbol "${searchTerm}"`
                  : "No articles match your filters"}
              </Text>
              <TouchableOpacity
                onPress={clearAllFilters}
                style={{
                  backgroundColor: "#f59e42",
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}
                >
                  Clear search
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {(displayBlogs || []).map((blog) => (
                <TouchableOpacity
                  key={blog.postId}
                  style={styles.cardVertical}
                  onPress={() =>
                    navigation.navigate("BlogDetail", { blogId: blog.postId })
                  }
                >
                  <Image
                    source={{ uri: blog.sourceUrl }}
                    style={styles.cardImageVertical}
                  />
                  <View style={styles.cardContentVertical}>
                    <View style={styles.tagRow}>
                      <Text
                        style={[
                          styles.tag,
                          blog?.sentiment === "POSITIVE"
                            ? styles.positiveTag
                            : blog?.sentiment === "NEGATIVE"
                            ? styles.negativeTag
                            : null,
                        ]}
                      >
                        {blog?.sentiment}
                      </Text>
                    </View>
                    <Text style={styles.cardTitle}>{blog.title}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {blog.content}
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.footerText}>👍 {blog.upvoteCount}</Text>
                      <Text style={styles.footerText}> {blog.downvoteCount}</Text>
                      <Text style={styles.readMore}>Read More</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {/* Pagination Controls */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 16,
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: page > 1 ? "#ef4444" : "#f3f4f6",
                    borderRadius: 6,
                  }}
                  disabled={page <= 1}
                  onPress={handlePrevPage}
                >
                  <Text style={{ color: page > 1 ? "#fff" : "#888" }}>
                    Previous
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    alignSelf: "center",
                    color: "#222",
                    fontWeight: "bold",
                  }}
                >
                  Page {page} / {totalPages}
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 8,
                    backgroundColor: page < totalPages ? "#ef4444" : "#f3f4f6",
                    borderRadius: 6,
                  }}
                  disabled={page >= totalPages}
                  onPress={handleNextPage}
                >
                  <Text style={{ color: page < totalPages ? "#fff" : "#888" }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    padding: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  headerContent: {
    flex: 1,
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f59e42",
    marginRight: 8,
  },
  blogBadge: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#222",
  },
  blogBadgeText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 14,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    backgroundColor: "#fff",
    gap: 8,
  },
  input: { flex: 1, fontSize: 15, padding: 6 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#222",
  },
  card: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginLeft: 16,
    marginRight: 4,
    elevation: 2,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 110,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: { padding: 12 },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  trendingTag: {
    backgroundColor: "#fde68a",
    color: "#b45309",
    fontSize: 11,
    fontWeight: "bold",
    borderRadius: 6,
    paddingHorizontal: 6,
    marginRight: 6,
  },
  tag: {
    backgroundColor: "#f3f4f6",
    color: "#222",
    fontSize: 11,
    borderRadius: 6,
    paddingHorizontal: 6,
    marginRight: 6,
  },
  positiveTag: {
    backgroundColor: "#bbf7d0",
    color: "#166534",
    fontWeight: "bold",
  },
  negativeTag: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
    fontWeight: "bold",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
    color: "#222",
  },
  cardDesc: { color: "#444", fontSize: 13, marginBottom: 8 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: { color: "#888", fontSize: 12 },
  readMore: { color: "#f59e42", fontWeight: "bold", fontSize: 12 },
  cardVertical: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  cardImageVertical: { width: 90, height: 100 },
  cardContentVertical: { flex: 1, padding: 10, justifyContent: "center" },
  createBtn: {
    backgroundColor: "#f59e42",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    minWidth: 85,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 0,
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

  // Filter Panel Styles
  filterPanel: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#f9fafb",
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  filterOptionActive: {
    backgroundColor: "#f59e42",
    borderColor: "#f59e42",
  },
  filterOptionText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    alignItems: "center",
  },
  clearBtnText: {
    color: "#666",
    fontWeight: "500",
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f59e42",
    alignItems: "center",
  },
  applyBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
