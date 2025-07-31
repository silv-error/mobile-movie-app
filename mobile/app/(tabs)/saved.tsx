import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies } from "@/services/appwrite";
import React, { useEffect } from "react";
import { FlatList, Image, RefreshControl, ScrollView, Text, View } from "react-native";

const saved = () => {
  const [movies, setMovies] = React.useState<SavedMovie[] | undefined>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const savedMovies = await getSavedMovies();
        console.log("Saved Movies:", savedMovies);
        setMovies(savedMovies);
      } catch (error) {
        console.error("Error fetching saved movies:", error);
      }
    };

    fetchSavedMovies();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await getSavedMovies().then((data) => {
      setMovies(data);
    });
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-accent text-xl font-bold text-center mt-20 mb-5">Your Watchlist</Text>

        {movies && movies.length > 0 ? (
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              <MovieCard
                id={item.movie_id}
                poster_path={item?.poster_url || ""}
                title={item.title}
                vote_average={item.vote_average || 0}
                release_date={item.release_date || ""}
                adult={false}
                backdrop_path={""}
                genre_ids={[]}
                original_language={""}
                original_title={""}
                overview={""}
                popularity={0}
                video={false}
                vote_count={0}
              />
            )}
            keyExtractor={(item) => item.movie_id.toString()}
            scrollEnabled={false}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "flex-start", gap: 20, paddingRight: 5, marginBottom: 10 }}
            className="mt-2 pb-32"
          />
        ) : null}
      </ScrollView>
      {/* <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <Image source={icons.save} className="size-10" tintColor={"#fff"} />
        <Text className="text-gray-500 text-base">Saved</Text>
      </View> */}
    </View>
  );
};

export default saved;
