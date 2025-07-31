import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { images } from "@/constants/images";
import { getTrendingMovies } from "@/services/appwrite";
import { fetchTMDB, fetchTrendingMovies } from "@/services/tmdb";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, View } from "react-native";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  // const {
  //   data: trendingMovies,
  //   loading: trendingLoading,
  //   error: trendingError,
  //   refetch: refetchTrending,
  // } = useFetch(getTrendingMovies);
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch(() => fetchTMDB({ query: "" }));
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchTrending(), refetchMovies()]);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useFetch(() => fetchTrendingMovies());

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0"></Image>
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" /> */}
        <Text className="text-accent text-xl font-bold text-center mt-20 mb-5">Stream Cove</Text>
        {moviesLoading || trendingLoading ? (
          <ActivityIndicator size={"large"} color={"#0000ff"} className="mt-10 self-center" />
        ) : moviesError || trendingError ? (
          <Text className="text-white">Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
          <View>
            <SearchBar onPress={() => router.push("/search")} placeholder="Search for movies" />
            {trendingMovies && (
              <View className="mt-10 pr-10">
                <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  data={trendingMovies}
                  renderItem={({ item, index }) => <TrendingCard movie={item} index={index} />}
                  keyExtractor={(item) => item?.id?.toString()}
                />
              </View>
            )}
            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id?.toString()}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: "flex-start", gap: 20, paddingRight: 5, marginBottom: 10 }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
