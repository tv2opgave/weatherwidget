// actions
export const WEATHER_CURRENT_LOAD = 'WEATHER_CURRENT_LOAD';
export const WEATHER_CURRENT_UPDATE = 'WEATHER_CURRENT_UPDATE';
export const WEATHER_CURRENT_ERROR = 'WEATHER_CURRENT_ERROR';
export const WEATHER_FORM_SEARCH_SET = 'WEATHER_FORM_SEARCH_SET';

// action creators
export const loadCurrentWeather = () => ({
  type: WEATHER_CURRENT_LOAD
});

export const updateCurrentWeather = ({ location, wind, temperature, humidity, message }) => ({
  type: WEATHER_CURRENT_UPDATE,
  payload: { location, wind, temperature, humidity, message },
});

export const failCurrentWeather = message => ({
  type: WEATHER_CURRENT_ERROR,
  payload: message,
});

export const clearErrorCurrentWeather = () => ({
  type: WEATHER_CURRENT_ERROR,
  payload: '',
});

export const setFormSearch = search => ({
  type: WEATHER_FORM_SEARCH_SET,
  payload: search,
});

// thunks
export const fetchCurrentWeather = search => async dispatch => {
  dispatch(clearErrorCurrentWeather()); // clear any error message

  try {
    dispatch(loadCurrentWeather()); // clear search form
    const response = await fetch(`/api/weather/${search}`);
    const data = await response.json();
    dispatch(updateCurrentWeather(data));
  } catch (e) {
    const message = 'No connection to server';
    dispatch(failCurrentWeather(message));
  }
};

// reducer
const initialState = (window.__INITIALSTATE__ && window.__INITIALSTATE__.weather) || {
  location: 'Copenhagen',
  wind: '',
  temperature: '',
  humidity: '',
  search: '',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case WEATHER_FORM_SEARCH_SET: {
      return { ...state, search: payload };
    }

    case WEATHER_CURRENT_LOAD: {
      return { ...state, search: '' };
    }

    case WEATHER_CURRENT_UPDATE: {
      return { ...state, ...payload };
    }

    case WEATHER_CURRENT_ERROR: {
      return { ...state, message: payload };
    }

    default:
        return state;
    }
};
