import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import { createStore, applyMiddleware } from 'redux';

import reducer, { fetchCurrentWeather, clearErrorCurrentWeather, loadCurrentWeather, updateCurrentWeather, failCurrentWeather} from '../WeatherWidget.ducks';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('WeatherWidget.store', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('triggers actions when using thunk to request data from remote api', () => {
    const body = {
      location: 'Copenhagen',
      temperature: '25 C',
      wind: 'Stormy',
      humidity: 'wet'
    };

    fetchMock.getOnce('/api/weather/London', {
      body,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      clearErrorCurrentWeather(),
      loadCurrentWeather(),
      updateCurrentWeather(body)
    ]
    const store = mockStore({ })

    return store.dispatch(fetchCurrentWeather('London')).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('updates the store from remote api', () => {
    const body = {
      location: 'Copenhagen',
      temperature: '25 C',
      wind: 'Stormy',
      humidity: 'wet'
    };

    const expectedState = {
      ...body,
      message: undefined, 
      search: ''
    }

    fetchMock.getOnce('/api/weather/London', {
      body,
      headers: { 'content-type': 'application/json' }
    })

    const store = createStore(
      reducer,
      applyMiddleware(thunk)
    );

    return store.dispatch(fetchCurrentWeather('London')).then(() => {
      // return of async actions
      expect(store.getState()).toEqual(expectedState)
    })

  })

  it('updates store with error from server when location is not found', () => {
    const body = {
      location: undefined,
      temperature: undefined,
      wind: undefined,
      humidity: undefined,
      message: 'Some error'
    };

    const expectedState = {
      ...body,
      search: ''
    }

    fetchMock.getOnce('/api/weather/unknown', {
      body,
      headers: { 'content-type': 'application/json' }
    })

    const store = createStore(
      reducer,
      applyMiddleware(thunk)
    );

    return store.dispatch(fetchCurrentWeather('unknown')).then(() => {
      // return of async actions
      expect(store.getState()).toEqual(expectedState)
    })
  })

})