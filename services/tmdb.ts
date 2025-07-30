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
