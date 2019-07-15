import React from 'react';
import { mount } from 'enzyme';
import WeatherWidget from '../WeatherWidget.container';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import reducer, {
  fetchCurrentWeather,
  clearErrorCurrentWeather,
  loadCurrentWeather,
  updateCurrentWeather,
  failCurrentWeather,
} from '../WeatherWidget.ducks';

describe('Mounted WeatherWidget container with store', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('displays values from remote api', () => {
    const store = createStore(
      combineReducers({
        weather: reducer,
      }),
      applyMiddleware(thunk)
    );

    const body = {
      location: 'Copenhagen',
      temperature: '25 C',
      wind: 'Stormy',
      humidity: 'wet',
    };

    fetchMock.get('/api/weather/Copenhagen', {
      body,
      headers: { 'content-type': 'application/json' },
    });

    const wrapper = mount(
      <Provider store={store}>
        <WeatherWidget />
      </Provider>
    );

    return store.dispatch(fetchCurrentWeather('Copenhagen')).then(() => {
      expect(wrapper).toIncludeText(body.location);
      expect(wrapper).toIncludeText(body.temperature);
      expect(wrapper).toIncludeText(body.wind);
      expect(wrapper).toIncludeText(body.humidity);
      expect(wrapper).toIncludeText('Search');
    });
  });

  it('displays message when unable to connect to remote api', () => {
    const store = fakeStore()

    fetchMock.get('/api/weather/Copenhagen', {
      throws: new TypeError('Failed to fetch')
    });

    const wrapper = mount(
      <Provider store={store}>
        <WeatherWidget />
      </Provider>
    );

    return store.dispatch(fetchCurrentWeather('Copenhagen')).then(() => {
      expect(wrapper).toIncludeText('No connection to server');
    });
  });

});


const fakeStore = () => createStore(
  combineReducers({
    weather: reducer,
  }),
  applyMiddleware(thunk)
);
