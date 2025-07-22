import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../apis/profile";
import { updateProfile } from "../apis/profile";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function Profile() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({});
  const [edit, setEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // "profile", "favorites", "posts"
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      setIsRefreshing(true);
      const data = await getProfile();
      setProfile(data.user || data.data || {});
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Gọi fetchProfile khi component mount lần đầu
  useEffect(() => {
    fetchProfile();
    setEdit(false);
    setActiveTab("profile");
  }, []);

  // Cập nhật dữ liệu mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      // Cập nhật lại dữ liệu profile khi màn hình được focus lại
      console.log("Profile screen focused - refreshing data");
      fetchProfile();
      return () => {
        // Cleanup nếu cần
      };
    }, [])
  );

  const handleEdit = () => {
    setEditName(profile.fullName || "");
    setAvatarFile(null);
    setEdit(true);
  };

  const handlePickAvatar = async () => {
    // Check current permission status first
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    let finalStatus = status;
    if (status !== "granted") {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      finalStatus = permissionResult.status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Không có quyền truy cập",
        "Bạn cần cho phép ứng dụng truy cập thư viện ảnh để chọn avatar. Vui lòng vào phần cài đặt và cấp quyền cho ứng dụng."
      );
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      const asset = pickerResult.assets[0];
      setAvatarFile({
        uri: asset.uri,
        name: asset.fileName || "avatar.jpg",
        type: asset.type || "image/jpeg",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(editName, profile?.userId, avatarFile);
      await fetchProfile();
      setEdit(false);
      setAvatarFile(null);
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>User Profile</Text>
          {!edit ? (
            <TouchableOpacity style={styles.editIconBtn} onPress={handleEdit}>
              <Ionicons name="create-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editIconBtn}
              onPress={() => handleSave()}
              disabled={loading}
            >
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={loading ? "#bbb" : "#22c55e"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={{ alignItems: "center", width: "100%" }}>
            <View style={styles.avatarWrapper}>
              {edit ? (
                <TouchableOpacity
                  onPress={handlePickAvatar}
                  disabled={loading}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  {avatarFile ? (
                    <Image
                      source={{ uri: avatarFile.uri }}
                      style={styles.avatarImageEdit}
                    />
                  ) : profile.avatarUrl ? (
                    <Image
                      source={{ uri: profile.avatarUrl }}
                      style={styles.avatarImageEdit}
                    />
                  ) : (
                    <Ionicons name="person" size={60} color="#ef4444" />
                  )}
                  <Text
                    style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}
                  >
                    Chọn ảnh
                  </Text>
                </TouchableOpacity>
              ) : profile.avatarUrl ? (
                <Image
                  source={{ uri: profile.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={60} color="#ef4444" />
              )}
            </View>
            {!edit ? (
              <Text style={styles.name}>
                {profile.fullName || "Chưa cập nhật"}
              </Text>
            ) : (
              <TextInput
                style={styles.editNameInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Họ và tên"
                placeholderTextColor="#bbb"
                editable={!loading}
              />
            )}
            {profile.isExpert && (
              <Text style={styles.expertBadge}>Chuyên gia</Text>
            )}
            <Text style={styles.meta}>
              <Ionicons name="mail-outline" size={14} color="#888" />{" "}
              {profile.email || "Chưa cập nhật"}
            </Text>
          </View>
        </View>

        {/* Tabs Navigation */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "profile" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("profile")}
          >
            <Ionicons
              name="person"
              size={20}
              color={activeTab === "profile" ? "#ef4444" : "#888"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "profile" && styles.activeTabText,
              ]}
            >
              Thông tin
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "favorites" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("favorites")}
          >
            <Ionicons
              name="heart"
              size={20}
              color={activeTab === "favorites" ? "#ef4444" : "#888"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "favorites" && styles.activeTabText,
              ]}
            >
              Yêu thích
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "posts" && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab("posts")}
          >
            <Ionicons
              name="newspaper"
              size={20}
              color={activeTab === "posts" ? "#ef4444" : "#888"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "posts" && styles.activeTabText,
              ]}
            >
              Bài viết
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <View style={styles.tabContent}>
            <View style={styles.infoCard}>
              <View style={styles.infoFieldRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={profile.status === 1 ? "#16a34a" : "#888"}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.infoLabel}>Trạng thái</Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: profile.status === 1 ? "#16a34a" : "#888" },
                  ]}
                >
                  {" "}
                  {profile.status === 1 ? "Active" : "Inactive"}
                </Text>
              </View>
              <View style={styles.infoFieldRow}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#888"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.infoLabel}>Ngày tạo</Text>
                <Text style={styles.infoValue}>
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "Chưa cập nhật"}
                </Text>
              </View>
              <View style={styles.infoFieldRow}>
                <MaterialIcons
                  name="update"
                  size={16}
                  color="#888"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.infoLabel}>Cập nhật</Text>
                <Text style={styles.infoValue}>
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleDateString()
                    : "Chưa cập nhật"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Favorite Posts Tab */}
        {activeTab === "favorites" && (
          <View style={styles.tabContent}>
            {isRefreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ef4444" />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
              </View>
            ) : Array.isArray(profile.favoritePosts) &&
              profile.favoritePosts.length > 0 ? (
              profile.favoritePosts.map((post) => (
                <TouchableOpacity
                  key={post.postId}
                  style={styles.postItem}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("BlogDetail", { blogId: post.postId })
                  }
                >
                  <Image
                    source={{
                      uri:
                        post.sourceUrl ||
                        "https://dummyimage.com/60x60/ccc/333.png&text=Post",
                    }}
                    style={styles.postImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.postTitle} numberOfLines={2}>
                      {post.title}
                    </Text>
                    <Text style={styles.postMeta}>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ""}
                    </Text>
                    <Text style={styles.postMeta}>
                      👁 {post.viewCount || 0} lượt xem
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="heart-outline" size={40} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  Bạn chưa có bài viết yêu thích nào
                </Text>
              </View>
            )}
          </View>
        )}

        {/* User Posts Tab */}
        {activeTab === "posts" && (
          <View style={styles.tabContent}>
            {isRefreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ef4444" />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
              </View>
            ) : Array.isArray(profile.posts) && profile.posts.length > 0 ? (
              profile.posts.map((post) => (
                <TouchableOpacity
                  key={post.postId || post.id}
                  style={styles.postItem}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("BlogDetail", {
                      blogId: post.postId || post.id,
                    })
                  }
                >
                  <Image
                    source={{
                      uri:
                        post.sourceUrl ||
                        "https://dummyimage.com/60x60/ccc/333.png&text=Post",
                    }}
                    style={styles.postImage}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.postTitle} numberOfLines={2}>
                      {post.title}
                    </Text>
                    <Text style={styles.postMeta}>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ""}
                    </Text>
                    <Text style={styles.postMeta}>
                      👁 {post.viewCount || 0} lượt xem
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="newspaper-outline" size={40} color="#ccc" />
                <Text style={styles.emptyStateText}>
                  Bạn chưa đăng bài viết nào
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#ef4444" },
  subtitle: { color: "#666", fontSize: 14, marginLeft: 18, marginBottom: 8 },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 0,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 5,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: "#fef2f2",
  },
  tabText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  tabContent: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
  },
  postItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  postContent: {
    flex: 1,
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
  postMeta: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyStateText: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    color: "#888",
    fontSize: 14,
    marginTop: 12,
  },
  profileCard: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 10,
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 24,
    elevation: 3,
    shadowColor: "#ef4444",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fde68a",
    marginBottom: 10,
  },
  avatarImage: { width: 86, height: 86, borderRadius: 43 },
  avatarImageEdit: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginTop: 18,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  expertBadge: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    fontWeight: "bold",
    fontSize: 13,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  meta: { color: "#888", fontSize: 14, marginTop: 4, textAlign: "center" },
  infoRow: {
    flexDirection: "column",
    gap: 18,
    marginHorizontal: 18,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    marginHorizontal: 18,
  },
  infoFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  infoLabel: { color: "#888", fontSize: 15, minWidth: 90 },
  infoValue: { color: "#222", fontSize: 15, flex: 1, textAlign: "right" },
  editIconBtn: { marginLeft: 8, padding: 6, borderRadius: 8 },
  editNameInput: {
    borderWidth: 1,
    borderColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 20,
    backgroundColor: "#f9fafb",
    color: "#222",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    width: 220,
    alignSelf: "center",
    marginTop: 8,
  },
});
