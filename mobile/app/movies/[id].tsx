import { icons } from "@/constants/icons";
import { getSavedMovies, isMovieSaved, saveMovie } from "@/services/appwrite";
import { fetchMovieDetails } from "@/services/tmdb";
import useFetch from "@/services/useFetch";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MovieInfoProps {
  label: string;
  value: string | number | null | undefined;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => {
  return (
    <View className="flex-col justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-200 font-bold text-sm mt-2 ">{value || "N/A"}</Text>
    </View>
  );
};

const MovieDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [savedMovie, setSavedMovie] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));
  const movieToSave: SavedMovie = {
    movie_id: movie?.id!,
    title: movie?.title!,
    poster_url: movie?.poster_path!,
    vote_average: movie?.vote_average!,
    release_date: movie?.release_date!,
  };

  useEffect(() => {
    const checkIfMovieSaved = async () => {
      const saved = await isMovieSaved(Number(id));
      if (saved) {
        setSavedMovie(true);
      }
    };
    checkIfMovieSaved();
  }, [id]);

  const handleSaveMovie = async () => {
    try {
      setIsLoading(true);
      await saveMovie(movieToSave);
      (await isMovieSaved(movie?.id!)) ? setSavedMovie(true) : setSavedMovie(false);
    } catch (error) {
      console.error("Error saving movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const insets = useSafeAreaInsets();
  return (
    <View className="bg-primary flex-1" style={{ paddingBottom: insets.bottom }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
            className="w-full h-[550px]"
          />
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">{movie?.release_date?.split("-")[0]}</Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} />
            <Text className="text-white font-bold text-sm">{Math.round(movie?.vote_average || 0)}/10</Text>
            <Text className="text-light-200 text-sm">({movie?.vote_count} votes)</Text>
          </View>
          <MovieInfo label={"Overview"} value={movie?.overview} />
          <MovieInfo label={"Genres"} value={movie?.genres.map((g: any) => g.name).join(" - ")} />
          <View className="flex-row justify-between w-1/2">
            <MovieInfo label="Budget" value={`$${(movie?.budget ?? 0) / 1_000_000} million`} />
            <MovieInfo label="Revenue" value={`$${Math.round((movie?.revenue ?? 0) / 1_000_000)} million`} />
          </View>
        </View>
      </ScrollView>
      <View className="fixed bottom-10 left-0 right-0 mx-5 rounded-lg py-3.5 flex-col gap-4 items-center justify-center z-50">
        <TouchableOpacity
          className="relative top-1/2 -translate-y-1/2 bg-gray-400 w-full py-3.5 rounded-lg justify-center items-center flex-row gap-x-2"
          onPress={() => handleSaveMovie()}
          style={{
            bottom: insets.bottom,
          }}
          disabled={isLoading}
        >
          {!isLoading && <Image source={icons.save} className="size-5 mr-1 mt-0.5 rotate-180" tintColor={"#fff"} />}
          <Text className="text-white font-semibold text-base">
            {isLoading ? (
              <ActivityIndicator
                size={"small"}
                className="text-white mt-10 self-center flex items-center justify-center"
              />
            ) : savedMovie ? (
              "Remove from Watchlist"
            ) : (
              "Save to Watchlist"
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="relative top-1/2 -translate-y-1/2 bg-accent w-full py-3.5 rounded-lg justify-center items-center flex-row gap-x-2"
          onPress={() => router.back()}
          style={{
            bottom: insets.bottom,
          }}
        >
          <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor={"#fff"} />
          <Text className="text-white font-semibold text-base">Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MovieDetails;
