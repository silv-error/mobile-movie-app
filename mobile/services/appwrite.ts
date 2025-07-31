// track search made by the user

import { Alert } from "react-native";
import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal("searchTerm", query)]);

    if (res.documents.length > 0) {
      const existingMovie = res.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
        count: existingMovie.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
    console.log(res);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update search count");
  }

  /**
   * check if a record of that search has already been stored
   * if a document is found, increment the count
   * if no document, create a new document in appwrite database
   */
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const res = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(5), Query.orderDesc("count")]);

    return res.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return undefined;
  }
};

export const saveMovie = async (movie: SavedMovie) => {
  try {
    const existingMovie = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("movie_id", movie.movie_id),
    ]);

    if (existingMovie.documents.length > 0) {
      await database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, existingMovie.documents[0].$id);

      return;
    }

    const res = await database.createDocument(DATABASE_ID, SAVED_COLLECTION_ID, ID.unique(), {
      movie_id: movie.movie_id,
      title: movie.title,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_url}`,
      vote_average: Math.round(movie?.vote_average! / 1),
      release_date: movie.release_date?.split("-")[0],
    });

    return res;
  } catch (error) {
    console.error("Failed to save movie:", error);
    throw new Error("Failed to save movie");
  }
};

export const getSavedMovies = async (): Promise<SavedMovie[] | undefined> => {
  try {
    const res = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [Query.limit(50)]);
    return res.documents as unknown as SavedMovie[];
  } catch (error) {
    console.error("Failed to fetch saved movies:", error);
    return undefined;
  }
};

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const res = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [Query.equal("movie_id", movieId | 0)]);
    return res.documents.length > 0;
  } catch (error) {
    console.error("Failed to check if movie is saved:", error);
    return false;
  }
};
