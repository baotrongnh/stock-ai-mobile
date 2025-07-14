import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Image } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile } from "../apis/profile";
import { updateProfile } from "../apis/profile";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [tab, setTab] = useState("personal");
  const [edit, setEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    const data = await getProfile();
    setProfile(data.user); // chỉ lấy đúng object user
  };

  useEffect(() => {
    fetchProfile();
    setEdit(false);
  }, []);

  const handleEdit = () => {
    setEditName(profile.fullName || "");
    setEdit(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log(editName, profile, "editName, profile.id");
      await updateProfile(editName, profile?.userId);
      await fetchProfile();
      setEdit(false);
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
            <TouchableOpacity style={styles.editIconBtn} onPress={() => handleSave()} disabled={loading}>
              <Ionicons name="checkmark-circle" size={22} color={loading ? "#bbb" : "#22c55e"} />
            </TouchableOpacity>
          )}
        </View>
        {/* <Text style={styles.subtitle}>Quản lý tài khoản và cài đặt</Text> */}

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={{ alignItems: "center", width: "100%" }}>
            <View style={styles.avatarWrapper}>{profile.avatarUrl ? <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} /> : <Ionicons name="person" size={60} color="#ef4444" />}</View>
            {!edit ? <Text style={styles.name}>{profile.fullName || "Chưa cập nhật"}</Text> : <TextInput style={styles.editNameInput} value={editName} onChangeText={setEditName} placeholder="Họ và tên" placeholderTextColor="#bbb" editable={!loading} />}
            {profile.isExpert && <Text style={styles.expertBadge}>Chuyên gia</Text>}
            <Text style={styles.meta}>
              <Ionicons name="mail-outline" size={14} color="#888" /> {profile.email || "Chưa cập nhật"}
            </Text>
          </View>
        </View>

        {/* Tab Content */}
        {tab === "personal" && (
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <View style={styles.infoFieldRow}>
                <Ionicons name="checkmark-circle" size={16} color={profile.status === 1 ? "#16a34a" : "#888"} style={{ marginRight: 8 }} />
                <Text style={styles.infoLabel}>Trạng thái</Text>
                <Text style={[styles.infoValue, { color: profile.status === 1 ? "#16a34a" : "#888" }]}> {profile.status === 1 ? "Active" : "Inactive"}</Text>
              </View>
              <View style={styles.infoFieldRow}>
                <Ionicons name="calendar-outline" size={16} color="#888" style={{ marginRight: 8 }} />
                <Text style={styles.infoLabel}>Ngày tạo</Text>
                <Text style={styles.infoValue}>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Chưa cập nhật"}</Text>
              </View>
              <View style={styles.infoFieldRow}>
                <MaterialIcons name="update" size={16} color="#888" style={{ marginRight: 8 }} />
                <Text style={styles.infoLabel}>Cập nhật</Text>
                <Text style={styles.infoValue}>{profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : "Chưa cập nhật"}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#f3f4f6" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#ef4444" },
  subtitle: { color: "#666", fontSize: 14, marginLeft: 18, marginBottom: 8 },
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
  name: { fontSize: 22, fontWeight: "bold", color: "#222", textAlign: "center" },
  expertBadge: { backgroundColor: "#e0e7ff", color: "#3730a3", fontWeight: "bold", fontSize: 13, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, alignSelf: "center", marginTop: 6, marginBottom: 2 },
  meta: { color: "#888", fontSize: 14, marginTop: 4, textAlign: "center" },
  infoRow: { flexDirection: "column", gap: 18, marginHorizontal: 18, marginTop: 8 },
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
  editNameInput: { borderWidth: 1, borderColor: "#f3f4f6", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 20, backgroundColor: "#f9fafb", color: "#222", fontWeight: "bold", textAlign: "center", marginBottom: 4, width: 220, alignSelf: "center" },
});
