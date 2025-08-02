export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_TMDB_ACCESS_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_ACCESS_KEY}`,
  },
};

interface FetchTMDBOptions {
  query?: string;
  totalMovies?: number; // e.g., 100
}

export const fetchTMDB = async ({ query, totalMovies = 50 }: FetchTMDBOptions) => {
  const moviesPerPage = 20;
  const totalPages = Math.ceil(totalMovies / moviesPerPage);

  const urls = Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    const endpoint = query
      ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
      : `${TMDB_CONFIG.BASE_URL}/movie/popular?page=${page}`;
    return endpoint;
  });

  try {
    const responses = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          method: "GET",
          headers: TMDB_CONFIG.headers,
        })
      )
    );

    const data = await Promise.all(responses.map((res) => res.json()));
    const allMovies = data.flatMap((d) => d.results).slice(0, totalMovies);
    return allMovies;
  } catch (err: any) {
    throw new Error(`Error fetching TMDB data: ${err.message}`);
  }
};

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try {
    const res = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch movie details: ${res.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching movie details for ID ${movieId}`);
  }
};

export const fetchTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const res = await fetch(`${TMDB_CONFIG.BASE_URL}/trending/movie/day?limit=9&api_key=${TMDB_CONFIG.API_KEY}`, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch trending movies: ${res.statusText}`);
    }
    return data.results.slice(0, 9);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching trending movies");
  }
};

export const fetchMovieTrailer = async (movieId: string): Promise<MovieTrailer[]> => {
  try {
    const res = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch movie trailer: ${res.statusText}`);
    }

    return data.results;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching movie trailer for ID ${movieId}`);
  }
};
