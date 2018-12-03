import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import Login from '@pages/header/Login';

describe('<Login />', () => {
  test('Renders properly', () => {
    const component = renderer.create(
      <Router>
        <Login />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
