import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { createPost } from "../apis/blog";

export default function CreatePost() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [stockId, setStockId] = useState(1);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        // Lấy tên file từ uri
        let fileName = asset.uri.split("/").pop() || `image_${Date.now()}.jpg`;
        // Lấy type
        let fileType = asset.type || "image";
        if (asset.mimeType) fileType = asset.mimeType;
        else if (fileName.includes("."))
          fileType = `image/${fileName.split(".").pop()}`;
        setImage({ uri: asset.uri, name: fileName, type: fileType });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Error", "Please enter content");
      return;
    }

    if (!stockId || isNaN(Number(stockId))) {
      Alert.alert("Error", "Please enter a valid stockId (number)");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createPost(
        title.trim(),
        content.trim(),
        Number(stockId),
        image // có thể là null hoặc object { uri, name, type }
      );

      if (!response.error) {
        Alert.alert("Success", "Post created successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.message || "Failed to create post");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Post</Text>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isSubmitting || !title.trim() || !content.trim()) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* StockId Input */}
          <View style={styles.radioGroup}>
            <Text style={styles.label}>Stock ID:</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter stockId (number)"
              value={stockId.toString()}
              onChangeText={(v) => setStockId(v.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Post Title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          {/* Content Input */}
          <TextInput
            style={styles.contentInput}
            placeholder="Write your post content here..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {/* Image Upload */}
          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={pickImage}
          >
            <Text style={styles.imageUploadText}>
              {image ? "Change Image" : "Add Image"}
            </Text>
          </TouchableOpacity>

          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImage(null)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    color: "#f43f5e",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  submitButton: {
    backgroundColor: "#f43f5e",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#fca5a5",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  form: {
    padding: 16,
  },
  radioGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  radioOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  radioOptionSelected: {
    backgroundColor: "#fecdd3",
    borderColor: "#f43f5e",
  },
  radioText: {
    color: "#374151",
    fontWeight: "500",
  },
  radioTextSelected: {
    color: "#f43f5e",
  },
  titleInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  contentInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  imageUploadButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  imageUploadText: {
    color: "#f43f5e",
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    marginTop: 16,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
