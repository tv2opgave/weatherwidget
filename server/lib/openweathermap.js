const fetch = require("isomorphic-unfetch");

const appid = process.env.API_KEY || "166d00e26d3ff2c6149e89feccc5c59a";
const direction = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];

const formatWeatherData = data => {
  if (data.cod === 200) {
    return {
      location: data.name,
      temperature: `${data.main.temp} °C`,
      humidity: data.main.humidity,
      wind: `${data.wind.speed} m/s ${
        data.wind.deg ? direction[Math.floor(data.wind.deg / 45)] : ""
      }`
    };
  }

  return {
    error: data.message
  };
};

const fetchCurrentWeatherData = async search => {
  const url = `https://api.openweathermap.org/data/2.5/weather?${new URLSearchParams(
    { q: search, appid, units: "metric" }
  ).toString()}`;

  console.log('fetching', url)

  try {
    const response = await fetch(url);
    const data = await response.json();
    return formatWeatherData(data)
  } catch (e) {
    console.info("Fetch failed", url, e);
    return {
      message: "Fetch failed"
    };
  }
};

exports.fetchCurrentWeatherData = fetchCurrentWeatherData;
