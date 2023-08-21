const axios = require("axios");
const cache = require("./cache"); // Make sure to adjust the path to the cache module
require("dotenv").config();

async function displayWeather(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let key = "weather-" + lat + lon;

  if (cache[key] && Date.now() - cache[key].timeStamp < 50000) {
    console.log("Using cached weather data");
    response.status(200).send(cache[key].data);
  } else {
    try {
      // Fetch weather data from the API
      console.log("cache missed for weather");
      let params = {
        key: process.env.WEATHERBITAPI_SERVER_URL,
        lat: lat,
        lon: lon,
        units: "I",
        days: "5",
      };
      let weatherBitUrl = "https://api.weatherbit.io/v2.0/forecast/daily";
      let weatherBitData = await axios.get(weatherBitUrl, { params });
      console.log("weather data from api", weatherBitData);
      // Transform data and save to cache
      const weatherArray = weatherBitData.data.data.map(
        (day) => new Forecast(day)
      );
      cache[key] = {
        data: weatherArray,
        timeStamp: Date.now(),
      };

      response.status(200).send(cache[key].data);
    } catch (error) {
      response.status(500).send("Something went wrong");
      console.log(error.message);
    }
  }
}

class Forecast {
  constructor(day) {
    this.description = ` Low of ${day.low_temp}, high of ${
      day.high_temp
    } with ${day.weather.description.toLowerCase()}`;
    this.date = day.valid_date;
    this.timeStamp = Date.now();
  }
}

module.exports = displayWeather;
