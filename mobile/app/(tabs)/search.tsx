import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants/images";
import { updateSearchCount } from "@/services/appwrite";
import { fetchTMDB } from "@/services/tmdb";
import useFetch from "@/services/useFetch";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

const search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const { data: movies, loading, error, refetch, reset } = useFetch(() => fetchTMDB({ query: searchQuery }), false);

  useEffect(() => {
    const func = setTimeout(async () => {
      if (searchQuery.trim()) {
        await refetch();
        // if (movies?.length! > 0 && movies?.[0]) {
        //   await updateSearchCount(searchQuery, movies[0]);
        // }
      } else {
        reset();
      }
    }, 1000);

    return () => clearTimeout(func);
  }, [searchQuery]);

  // useEffect(() => {
  //   if (movies?.length! > 0 && movies?.[0]) {
  //     updateSearchCount(searchQuery, movies[0]);
  //   }
  // }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover" />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center items-center mt-20">
              {/* <Image source={icons.logo} className="w-12 h-10" /> */}
              <Text className="text-accent text-xl font-bold text-center">Stream Cove</Text>
            </View>
            <View className="my-5">
              <SearchBar placeholder="Search for movies" value={searchQuery} onChangeText={handleSearch} />
            </View>

            {loading && <ActivityIndicator size="large" color="#0000ff" className="my-3" />}

            {error && <Text className="text-red-500 px-5 my-3">Error: {error?.message}</Text>}

            {!loading && !error && searchQuery.trim() && movies?.length! > 0 && (
              <Text className="text-xl text-white font-bold">
                Search Results for <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? "No results found." : "Please enter a search term to find movies."}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default search;
