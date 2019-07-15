import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import weather from './components/weather/WeatherWidget.ducks';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
  combineReducers({
    weather
  }),
  composeEnhancers (
    applyMiddleware(thunk)
  ),
);
