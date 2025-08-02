import { fetchMovieDetails, fetchMovieTrailer } from "@/services/tmdb";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";

const Trailer = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { data: movie } = useFetch(() => fetchMovieDetails(id as string));

  useLayoutEffect(() => {
    navigation.setOptions({
      title: movie?.title || "Movie Video",
    });
  }, [id, navigation, movie]);

  const insets = useSafeAreaInsets();
  const playerRef = useRef(null);

  const [trailer, setTrailer] = useState<MovieTrailer[]>([]);
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const data = await fetchMovieTrailer(id as string);
        setTrailer(data);
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };
    fetchTrailer();
  }, [id]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <YoutubePlayer
        ref={playerRef}
        height={220}
        play={false}
        videoId={trailer[0]?.key} // Replace with your YouTube video ID
      />
    </View>
  );
};

export default Trailer;
