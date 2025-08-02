import { fetchMovieDetails } from "@/services/tmdb";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const VideoEmbed = () => {
  const { id, title } = useLocalSearchParams();
  const navigation = useNavigation();
  const { data: movie } = useFetch(() => fetchMovieDetails(id as string));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: movie?.title || "Movie Video",
    });
  }, [id, navigation, movie]);

  const insets = useSafeAreaInsets();

  const injectedJS = `
  (function() {
    const applyCustomStyles = () => {
      const style = document.createElement('style');
      style.innerHTML = \`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100% !important;
          background-color: black;
        }
        video, iframe {
          max-height: 300px !important;
          height: 300px !important;
          width: 100% !important;
          object-fit: contain;
        }
      \`;
      document.head.appendChild(style);

      const video = document.querySelector('video');
      if (video) {
        video.volume = 1.0;
        video.muted = false;
        video.play();
      }
    };

    document.addEventListener("DOMContentLoaded", function() {
      applyCustomStyles();
    });

    // Retry in case elements load late
    setTimeout(applyCustomStyles, 1000);
  })();
  true;
`;

  return (
    <View style={{ paddingBottom: insets.bottom + 5 }} className="flex-1 bg-primary">
      <WebView
        source={{ uri: `https://vidlink.pro/movie/${id}` }}
        style={{ height: 300, width: "100%" }} // or any height in pixels
        javaScriptEnabled
        volume={1.0}
        domStorageEnabled
        injectedJavaScript={injectedJS}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={false}
        scalesPageToFit={false}
        scrollEnabled={false}
      />
    </View>
  );
};

export default VideoEmbed;
