import React from 'react';
import { shallow } from 'enzyme';
import WeatherWidget from '../WeatherWidget';

describe('WeatherWidget', () => {
  it('should show temperature humidity wind and location', () => {
    const props = {
      location: 'Copenhagen',
      temperature: '25 C',
      wind: 'Stormy',
      humidity: 'wet',
    };

    const wrapper = shallow(<WeatherWidget {...props} />);

    expect(wrapper).not.toContainMatchingElement('.alert');
    expect(wrapper).toIncludeText(props.location);
    expect(wrapper).toIncludeText(props.temperature);
    expect(wrapper).toIncludeText(props.wind);
    expect(wrapper).toIncludeText(props.humidity);
  });

  it('should show message when provided', () => {
    const props = {
      message: 'This is a message',
    };

    const wrapper = shallow(<WeatherWidget {...props} />);

    expect(wrapper).toContainMatchingElement('.alert');
    expect(wrapper).toIncludeText(props.message);
  });

  it('should callback on submit', () => {
    const props = {
      onSearchSubmit: jest.fn(),
    };

    const wrapper = shallow(<WeatherWidget {...props} />);
    wrapper.find('form').simulate('submit');

    // Enzyme does not support event propagation, so even though this should test submit, it doesn't
    wrapper.find('button[type="submit"]').simulate('click');

    expect(wrapper.find('button[type="submit"]')).toIncludeText('Search');
    expect(props.onSearchSubmit.mock.calls.length).toBe(1);
  });

  it('should callback on form input change', () => {
    const props = {
      onSearchChange: jest.fn(),
    };

    const wrapper = shallow(<WeatherWidget {...props} />);
    wrapper.find('input').simulate('change', {
      target: { value: 'Copenhagen' },
    });

    // Enzyme does not support event propagation, so even though this should test submit, it doesn't
    wrapper.find('button[type="submit"]').simulate('click');

    expect(props.onSearchChange.mock.calls.length).toBe(1);
  });
});
