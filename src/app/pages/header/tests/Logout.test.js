import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import Logout from '@pages/header/Logout';

describe('<Logout />', () => {
  test('Renders properly', () => {
    const component = renderer.create(
      <Router>
        <Logout />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
