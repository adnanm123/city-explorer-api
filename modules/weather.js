"use strict";
const axios = require("axios");

let displayWeather = async (request, response) => {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let params = {
    key: process.env.WEATHERBITAPI_SERVER_URL,
    lat: lat,
    lon: lon,
    units: "I",
    days: "5",
  };
  let weatherBitUrl = "https://api.weatherbit.io/v2.0/forecast/daily";
  let weatherBitData = await axios.get(weatherBitUrl, { params });
  console.log(weatherBitData);

  try {
    const weatherArray = weatherBitData.data.data.map(
      (day) => new Forecast(day)
    );
    response.status(200).send(weatherArray);
  } catch (error) {
    response.status(500).send("something went wrong");
    console.log(error.message);
  }
};

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

module.exports = displayWeather;
