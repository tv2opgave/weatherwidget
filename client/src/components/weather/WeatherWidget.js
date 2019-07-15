import React from 'react';

export default ({
  location,
  temperature,
  humidity,
  wind,
  search,
  message,
  onSearchChange,
  onSearchSubmit,
}) => (
  <div className="widget" style={{margin: 10, width: 300}}>
    {message && (
      <div className="alert alert-warning" role="alert">
        {message}
      </div>
    )}
    <div className="panel panel-info">
      <div className="panel-heading">
        Weather in <b>{location}</b>
      </div>
      <ul className="list-group">
        <li className="list-group-item">
          Temperature: <b>{temperature}</b>
        </li>
        <li className="list-group-item">
          Humidity: <b>{humidity}</b>
        </li>
        <li className="list-group-item">
          Wind: <b>{wind}</b>
        </li>
        <li className="list-group-item">
          <form className="form-inline" onSubmit={event => onSearchSubmit(event, search)}>
            <div className="form-group">
              <input
                type="text"
                name="city"
                className="form-control"
                value={search}
                onChange={onSearchChange}
                placeholder="City"
              />
            </div>
            <button type="submit" className="btn btn-default">
              Search
            </button>
          </form>
        </li>
      </ul>
    </div>
  </div>
);
