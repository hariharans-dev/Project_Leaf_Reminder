const express = require("express");
const axios = require("axios");
// require("dotenv").config();

const app = express();
const port = 3000; // You can use any port you prefer

// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key

// Middleware to handle CORS (Cross-Origin Resource Sharing) if needed
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// Weather API endpoint
app.post("/weather", async (req, res) => {
  const { latitude, longitude } = req.query;
  console.log(process.env.WEATHER_API_KEY);
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.WEATHER_API_KEY}`;

  try {
    const response = await axios.get(apiUrl);
    const weatherData = response.data;
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching weather data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
