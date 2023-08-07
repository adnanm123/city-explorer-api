"use strict";

const express = require("express");

require("dotenv").config();

let data = require("./data/weather.json");

const cors = require("cors");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get("/weather", handleWeather);

app.get("/", (request, response) => {
  response.send("hello, from our server");
});
function handleWeather(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;

  const latData = data.find(
    (location) => location.lat === lat && location.lon === lon
  );
  try {
    const weatherArray = latData.data.map((day) => new Forecast(day));
    response.status(200).send(weatherArray);
  } catch (error) {
    response.status(500).send("something went wrong");
    console.log(error.message);
  }
}

app.get("*", (request, response) => {
  response.send("The thing you are looking for doesn't exist");
});

class Forecast {
  constructor(day) {
    console.log("each day object", day);
    this.description = ` Low of ${day.low_temp}, high of ${
      day.high_temp
    } with ${day.weather.description.toLowerCase()}`;
    this.date = day.valid_date;
  }
}

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
