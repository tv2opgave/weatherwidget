var express = require('express');
var router = express.Router();
const { fetchCurrentWeatherData } = require('../lib/openweathermap');

/* GET home page. */
router.get('/', async (req, res) => {
  const data = await fetchCurrentWeatherData(req.query.city || 'Copenhagen')
  data.search = '';
  data.state = `<script>window.__INITIALSTATE__ = (window.__INITIALSTATE__ || {}).weather = ${JSON.stringify({weather: data})}</script>`

  res.render('index', data);
});

module.exports = router;
