"use strict";

// REQUIRE
// required from npm
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const axios = require("axios");

// instantiate express server by calling express
const app = express();

// USE
app.use(cors());

// Define port and proof that env works
const PORT = process.env.PORT || 3002;

// ROUTES
app.get("/weather", async (request, response) => {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let weatherBitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBITAPI_SERVER_URL}&lat=${lat}&lon=${lon}&units=I&days=5`;
  let weatherBitData = await axios.get(weatherBitUrl);
  console.log(weatherBitData);

  try {
    const weatherArray = weatherBitData.data.data.map((day) => new Forecast(day));
    response.status(200).send(weatherArray);
  } catch (error) {
    response.status(500).send("something went wrong");
    console.log(error.message);
  }
});

app.get("/", (request, response) => {
  response.send("hello, from our server");
});

app.get("*", (request, response) => {
  response.send("The thing you are looking for doesn't exist");
});

// CLASSES
class Forecast {
  constructor(day) {
    console.log("each day object", day);
    this.description = ` Low of ${day.low_temp}, high of ${
      day.high_temp
    } with ${day.weather.description.toLowerCase()}`;
    this.date = day.valid_date;
  }
}

// ERRORS
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

// Listen
// need to listen to keep server running
app.listen(PORT, () => console.log(`listening on ${PORT}`));
