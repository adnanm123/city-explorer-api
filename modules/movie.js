const axios = require("axios");
const cache = require("./cache"); // Adjust the path to the cache module

function getMovies(location) {
  const key = "movies-" + location;
  const URL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&query=${location}`;

  if (!cache[key]) {
    console.log("cache missed for movie data");
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = axios.get(URL).then((data) => parseMovieData(data.data));
  }
  return cache[key].data;
}

function parseMovieData(data) {
  try {
    const movies = data.results.map((movie) => {
      return new Movie(movie);
    });
    return Promise.resolve(movies);
  } catch (error) {
    return Promise.reject(error);
  }
}

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = movie.poster_path;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
    this.timestamp = Date.now();
  }
}

module.exports = getMovies;
