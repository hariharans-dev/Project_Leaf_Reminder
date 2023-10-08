const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const weather = async (req, res) => {
  const body = req.body;
  console.log(body);
  const latitude = body.latitude;
  const longitude = body.longitude;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    response.data.status = 200;
    console.log("success");
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching weather data:");
    res.status(500).json({ error: "Error fetching weather data" });
  }
};

module.exports = { weather };
