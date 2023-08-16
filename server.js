"use strict";

// REQUIRE
// required from npm
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const displayWeather = require('./modules/weather');
const displayMovie = require('./modules/movie');

// instantiate express server by calling express
const app = express();

// USE
app.use(cors());

// Define port and proof that env works
const PORT = process.env.PORT || 3002;

// ROUTES
app.get("/weather", displayWeather);

app.get("/movies", displayMovie);

app.get("/", (request, response) => {
  response.send("hello, from our server");
});

app.get("*", (request, response) => {
  response.send("The thing you are looking for doesn't exist");
});

// ERRORS
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// Listen
// need to listen to keep server running
app.listen(PORT, () => console.log(`listening on ${PORT}`));
