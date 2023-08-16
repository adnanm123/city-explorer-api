'use strict';
const axios = require("axios");

let displayMovie = async (request, response) => {
  let location = request.query.location;
  let movieAPI = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&query=${location}`;
  let movieData = await axios.get(movieAPI);
  try {
    const movieArray = movieData.data.results.map((movie) => new Movie(movie));
    response.status(200).send(movieArray);
  } catch (error) {
    response.status(500).send("something went wrong");
    console.log(error.message);
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
  }
}

module.exports = displayMovie;
