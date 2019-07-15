var express = require("express");
const { fetchCurrentWeatherData } = require("../lib/openweathermap");

var router = express.Router();

router.get("/weather/:search", async (req, res) => {
  try {
    const data = await fetchCurrentWeatherData(req.params.search);
    res.json(data);
  } catch (e) {
    res.json({
      message: "Ooops, something went wrong."
    });
  }
});

module.exports = router;
