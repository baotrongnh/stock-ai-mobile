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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { createPost } from "../apis/blog";

export default function CreatePost() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [level, setLevel] = useState("MARKET"); // MARKET or STOCK
  const [session, setSession] = useState(1); // 1: morning, 2: afternoon, 3: full day
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
        setImage(result.assets[0].uri);
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

    try {
      setIsSubmitting(true);

      const postData = {
        title: title.trim(),
        content: content.trim(),
        level,
        session,
        image,
      };

      const response = await createPost(postData);

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
        {/* Level Selection */}
        <View style={styles.radioGroup}>
          <Text style={styles.label}>Level:</Text>
          <View style={styles.radioOptions}>
            <TouchableOpacity
              style={[
                styles.radioOption,
                level === "MARKET" && styles.radioOptionSelected,
              ]}
              onPress={() => setLevel("MARKET")}
            >
              <Text
                style={[
                  styles.radioText,
                  level === "MARKET" && styles.radioTextSelected,
                ]}
              >
                Market Level
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioOption,
                level === "STOCK" && styles.radioOptionSelected,
              ]}
              onPress={() => setLevel("STOCK")}
            >
              <Text
                style={[
                  styles.radioText,
                  level === "STOCK" && styles.radioTextSelected,
                ]}
              >
                Stock Level
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Session Selection */}
        <View style={styles.radioGroup}>
          <Text style={styles.label}>Session:</Text>
          <View style={styles.radioOptions}>
            <TouchableOpacity
              style={[
                styles.radioOption,
                session === 1 && styles.radioOptionSelected,
              ]}
              onPress={() => setSession(1)}
            >
              <Text
                style={[
                  styles.radioText,
                  session === 1 && styles.radioTextSelected,
                ]}
              >
                Morning
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioOption,
                session === 2 && styles.radioOptionSelected,
              ]}
              onPress={() => setSession(2)}
            >
              <Text
                style={[
                  styles.radioText,
                  session === 2 && styles.radioTextSelected,
                ]}
              >
                Afternoon
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioOption,
                session === 3 && styles.radioOptionSelected,
              ]}
              onPress={() => setSession(3)}
            >
              <Text
                style={[
                  styles.radioText,
                  session === 3 && styles.radioTextSelected,
                ]}
              >
                Full Day
              </Text>
            </TouchableOpacity>
          </View>
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
        <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
          <Text style={styles.imageUploadText}>
            {image ? "Change Image" : "Add Image"}
          </Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
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
