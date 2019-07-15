import { connect } from 'react-redux';
import { createBrowserHistory } from 'history'

import WeatherWidget from './WeatherWidget'
import { setFormSearch, fetchCurrentWeather } from './WeatherWidget.ducks';

const mapStateToProps = state => {
  const { location, temperature, humidity, wind, search, message } = state.weather;
  return { location, temperature, humidity, wind, search, message };
};

const mapDispatchToProps = dispatch => {
  const history = createBrowserHistory()

  const locationListener = location => {
    const query = new URLSearchParams(location.search)
    dispatch(fetchCurrentWeather(query.get('city') || 'Copenhagen'));
  }

  history.listen(locationListener)
  locationListener(history.location)

  return {
    onSearchChange: event => dispatch(setFormSearch(event.target.value)),
    onSearchSubmit: (event, search) => {
      event.preventDefault();
      history.push({
        search: `?${new URLSearchParams({city: search}).toString()}`,
      })
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WeatherWidget)
