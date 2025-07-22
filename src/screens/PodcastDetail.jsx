import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Slider,
  Modal,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Hàm để format thời gian từ milliseconds sang định dạng MM:SS
const formatTime = (milliseconds) => {
  if (!milliseconds) return "00:00";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default function PodcastDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { podcast } = route.params || {
    podcast: {
      id: 1,
      title: "Podcast: Đầu tư dài hạn và bí quyết thành công",
      expert: { fullName: "Nguyễn Văn A", avatarUrl: null },
      createdAt: "2024-07-04T19:34:31.504Z",
      date: "2 ngày trước",
      author: "Nguyễn Văn A",
      image: "https://dummyimage.com/400x400/222/fff.png&text=Podcast+1",
      tag: "Đầu tư",
      type: "podcast",
      desc: "Đây là nội dung podcast về đầu tư dài hạn và bí quyết thành công trên thị trường chứng khoán. ...",
      time: "45:12",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo URL
    },
  };

  // Audio states
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0); // milliseconds
  const [duration, setDuration] = useState(0); // milliseconds
  const [rate, setRate] = useState(1.0); // playback speed
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [error, setError] = useState(null);

  // Reference to keep track of timer for progress updates
  const updateIntervalRef = useRef(null);

  // Load audio when component mounts or podcast changes
  useEffect(() => {
    loadAudio();

    // Return cleanup function
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      unloadAudio();
    };
  }, [podcast?.audioUrl]); // Reload if the podcast audio URL changes

  // Function to load audio
  const loadAudio = async () => {
    try {
      setIsLoading(true);
      setError(null); // Reset any previous errors

      // Unload any existing audio
      if (sound) {
        await unloadAudio();
      }

      // Configure audio mode for better experience
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and load the Audio source
      if (!podcast.audioUrl) {
        throw new Error("Không tìm thấy URL audio");
      }

      // Thêm xử lý timeout cho việc tạo Sound object
      const loadPromise = Audio.Sound.createAsync(
        { uri: podcast.audioUrl },
        {
          shouldPlay: false,
          progressUpdateIntervalMillis: 500,
          positionMillis: 0,
        },
        onPlaybackStatusUpdate
      );

      // Tạo promise timeout để tránh đợi mãi mãi
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Tải audio bị timeout")), 15000);
      });

      // Chạy race giữa việc tạo sound và timeout
      const result = await Promise.race([loadPromise, timeoutPromise]);

      // Kiểm tra kết quả từ createAsync
      if (!result || !result.sound) {
        throw new Error("Không thể tạo đối tượng âm thanh");
      }

      const { sound: newSound } = result;

      // Thêm thời gian chờ ngắn để đảm bảo sound được tải đầy đủ
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Kiểm tra trạng thái của sound vừa tạo
      let status;
      try {
        status = await newSound.getStatusAsync();
      } catch (statusError) {
        console.error("Error getting sound status:", statusError);
        throw new Error("Không thể kiểm tra trạng thái âm thanh");
      }

      // Chỉ thiết lập sound nếu đã tải thành công
      if (status && status.isLoaded) {
        setSound(newSound);
        setDuration(status.durationMillis || 0);
        setPosition(0);
        setIsPlaying(false);
      } else {

        try {
          await newSound.unloadAsync();
        } catch (unloadError) {

        }
        throw new Error("Sound object không được tải đúng cách");
      }

      setIsLoading(false);
    } catch (err) {
      const errorMessage =
        "Không thể tải file audio: " + (err.message || "Lỗi không xác định");
      setError(errorMessage);
      setIsLoading(false);
      console.error("Error loading audio:", err);

      setSound(null);
      setIsPlaying(false);
    }
  };


  const unloadAudio = async () => {
    try {
      if (sound) {

        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            if (status.isPlaying) {
              await sound.stopAsync();
            }
            await sound.unloadAsync();
          }
        } catch (statusError) {
        }

        setSound(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error unloading audio:", error);

      setSound(null);
      setIsPlaying(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);

      if (duration !== status.durationMillis && status.durationMillis > 0) {
        setDuration(status.durationMillis);
      }
      const playStateChanged = isPlaying !== status.isPlaying;
      if (playStateChanged) {
        setIsPlaying(status.isPlaying);
      }

      if (
        status.didJustFinish ||
        (status.positionMillis >= status.durationMillis - 500 &&
          status.durationMillis > 0 &&
          !status.isPlaying)
      ) {
        setIsPlaying(false);
      }
    } else if (status.error) {
      console.error(`Audio playback error: ${status.error}`);
      setError(`Lỗi phát audio: ${status.error}`);
    }
  };


  const togglePlayback = async () => {
    try {
      if (!sound) {
        await loadAudio();
        return;
      }
      const status = await sound.getStatusAsync();

      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {

        if (
          status.positionMillis >= status.durationMillis - 1000 &&
          status.durationMillis > 0
        ) {
          await sound.setPositionAsync(0);
        }

        try {

          const prePlayStatus = await sound.getStatusAsync();
          if (!prePlayStatus.isLoaded) {
            await unloadAudio();
            await loadAudio();

            // Lấy sound object mới từ state
            if (!sound) {
              await new Promise((resolve) => setTimeout(resolve, 300));
            }

            // Phát lại với sound mới
            if (sound) {
              await sound.playAsync();
              setIsPlaying(true);
            } else {
              throw new Error("Không thể tải lại audio");
            }
          } else {
            const playResult = await sound.playAsync();
            setIsPlaying(true); // Cập nhật state ngay lập tức

            // Kiểm tra kết quả phát
            if (!playResult.isPlaying) {
              // Đợi một chút và kiểm tra lại trạng thái
              await new Promise((resolve) => setTimeout(resolve, 500));
              const postPlayStatus = await sound.getStatusAsync();

              if (!postPlayStatus.isPlaying) {
                await unloadAudio();
                await loadAudio();

                // Đợi sound state cập nhật
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Phát với sound mới
                if (sound) {
                  await sound.playAsync();
                  setIsPlaying(true);
                }
              }
            }
          }
        } catch (playError) {
          console.error("Error playing audio:", playError);
          await unloadAudio();
          await loadAudio();

          // Đợi một chút để state cập nhật
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Sau khi tải lại, thử phát audio một lần nữa
          if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      }
    } catch (error) {
      console.error("Error in togglePlayback:", error);
      // Thử load lại audio nếu có lỗi
      if (error.message?.includes("Player is not ready")) {
        await unloadAudio(); // Đảm bảo unload trước
        await loadAudio();
      } else {
        setError(
          `Lỗi khi ${isPlaying ? "dừng" : "phát"} audio: ${error.message}`
        );
        // Trong trường hợp lỗi, thử tạo lại đối tượng sound
        try {
          await unloadAudio();
          await loadAudio();
        } catch (recoveryError) {
          // Không làm gì cả
        }
      }
    }
  };

  // Change playback position
  const seekTo = async (millis) => {
    if (sound) {
      await sound.setPositionAsync(millis);
    }
  };

  // Set playback rate (speed)
  const setPlaybackRate = async (newRate) => {
    if (sound) {
      await sound.setRateAsync(newRate, true);
      setRate(newRate);
      setShowSpeedOptions(false);
    }
  };

  // Rewind 10 seconds
  const rewind = async () => {
    if (sound) {
      const newPosition = Math.max(0, position - 10000);
      await seekTo(newPosition);
    }
  };

  // Forward 10 seconds
  const forward = async () => {
    if (sound) {
      const newPosition = Math.min(duration, position + 10000);
      await seekTo(newPosition);
    }
  };

  const progressPercent = duration ? (position / duration) * 100 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#18181b" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Ảnh podcast lớn */}
        <Image
          source={{
            uri:
              podcast.image ||
              podcast.sourceUrl ||
              "https://dummyimage.com/400x400/222/fff.png&text=Podcast",
          }}
          style={styles.image}
        />

        {/* Tiêu đề và chuyên gia */}
        <Text style={styles.title}>{podcast.title}</Text>
        <Text style={styles.expert}>
          {podcast.expert?.fullName || podcast.author || "Chuyên gia"}
        </Text>

        {/* Loading indicator */}
        {isLoading && (
          <ActivityIndicator
            size="large"
            color="#ef4444"
            style={styles.loader}
          />
        )}

        {/* Error message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Progress + Play */}
        <View style={styles.playerBox}>
          {/* Time & Progress Bar */}
          <View style={styles.progressRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <View style={styles.progressBarBox}>
              <View style={styles.progressBarBg} />
              <View
                style={[styles.progressBarFg, { width: `${progressPercent}%` }]}
              />
              <Pressable
                style={styles.sliderTouchArea}
                onPress={(event) => {
                  const { locationX } = event.nativeEvent;
                  const percent = locationX / event.currentTarget.offsetWidth;
                  const newPosition = Math.max(
                    0,
                    Math.min(duration, duration * percent)
                  );
                  seekTo(newPosition);
                }}
              />
            </View>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* Playback Controls */}
          <View style={styles.controlsRow}>
            {/* Rewind Button */}
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={rewind}
              disabled={isLoading}
            >
              <Ionicons name="play-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Play/Pause Button */}
            <TouchableOpacity
              style={[styles.playBtn, isLoading && styles.playBtnDisabled]}
              onPress={togglePlayback}
              activeOpacity={0.8}
              disabled={isLoading || !sound}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={38}
                color="#fff"
                style={{ marginLeft: isPlaying ? 0 : 4 }}
              />
            </TouchableOpacity>

            {/* Forward Button */}
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={forward}
              disabled={isLoading}
            >
              <Ionicons name="play-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Speed Button */}
          <TouchableOpacity
            style={styles.speedButton}
            onPress={() => setShowSpeedOptions(true)}
          >
            <Text style={styles.speedText}>{rate}x</Text>
          </TouchableOpacity>

          {/* Actions Row */}
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
          <Text style={styles.contentText}>
            {podcast.desc ||
              podcast.content ||
              "Không có mô tả cho podcast này."}
          </Text>
        </View>
      </ScrollView>

      {/* Speed selection modal */}
      <Modal
        visible={showSpeedOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSpeedOptions(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSpeedOptions(false)}
        >
          <View style={styles.speedModal}>
            <Text style={styles.speedModalTitle}>Tốc độ phát</Text>
            {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((speedOption) => (
              <TouchableOpacity
                key={speedOption}
                style={[
                  styles.speedOption,
                  rate === speedOption && styles.activeSpeedOption,
                ]}
                onPress={() => setPlaybackRate(speedOption)}
              >
                <Text
                  style={[
                    styles.speedOptionText,
                    rate === speedOption && styles.activeSpeedOptionText,
                  ]}
                >
                  {speedOption}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 0,
    backgroundColor: "#18181b",
    minHeight: "100%",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 15,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 18,
    marginTop: 60,
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
  sliderTouchArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  timeText: { color: "#a1a1aa", fontSize: 12, width: 38, textAlign: "center" },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 8,
  },
  playBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 30,
    shadowColor: "#ef4444",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  playBtnDisabled: {
    backgroundColor: "#999",
    shadowOpacity: 0.1,
    opacity: 0.7,
  },
  controlBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 22,
  },
  speedButton: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    alignSelf: "center",
  },
  speedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
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
  contentText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "left",
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "#ef4444",
    marginVertical: 20,
    textAlign: "center",
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  speedModal: {
    width: width * 0.8,
    backgroundColor: "#23232b",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  speedModalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  speedOption: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  speedOptionText: {
    color: "#a1a1aa",
    fontSize: 16,
  },
  activeSpeedOption: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 8,
  },
  activeSpeedOptionText: {
    color: "#ef4444",
    fontWeight: "bold",
  },
});
