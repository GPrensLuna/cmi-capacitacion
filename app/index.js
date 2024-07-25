import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { videos } from "../components/videos";

export default function VideoScreen() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0].url);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const player = videoRef.current;

    if (player) {
      player.playAsync().catch((e) => {
        console.error("Error starting video playback:", e);
        setError("Error starting video playback.");
      });
    }

    return () => {
      if (player) {
        player.pauseAsync().catch((e) => {
          console.error("Error pausing video playback:", e);
          setError("Error pausing video playback.");
        });
      }
    };
  }, [selectedVideo]);

  const handlePlayPause = () => {
    if (isLoaded) {
      if (isPlaying) {
        videoRef.current.pauseAsync().catch((e) => {
          console.error("Error pausing video playback:", e);
          setError("Error pausing video playback.");
        });
      } else {
        videoRef.current.playAsync().catch((e) => {
          console.error("Error resuming video playback:", e);
          setError("Error resuming video playback.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
    setIsBuffering(false);
  };

  const handleVideoBuffer = () => {
    setIsBuffering(true);
  };

  const handleVideoError = (error) => {
    console.error("Video error:", error);
    setError("Video loading error.");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: selectedVideo }}
          useNativeControls
          style={styles.video}
          shouldPlay
          isLooping
          onLoad={handleVideoLoad}
          onBuffer={handleVideoBuffer}
          onError={handleVideoError}
        />
        {isBuffering && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => setSelectedVideo(item.url)}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        style={styles.buttonList}
      />

      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? "Pause" : "Play"}
          onPress={handlePlayPause}
          color={isPlaying ? "#FF5722" : "#4CAF50"}
        />
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");
const videoHeight = width * 0.56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  videoContainer: {
    backgroundColor: "#000",
  },
  video: {
    width: "100vh",
    height: "100vh",
    resizeMode: "contain",
  },
  buttonList: {
    width: "100%",
  },
  buttonContainer: {
    marginBottom: 10,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    borderColor: "#BDBDBD",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  controlsContainer: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 20,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  errorText: {
    color: "red",
    marginTop: 20,
    textAlign: "center",
  },
});
