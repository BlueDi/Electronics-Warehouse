import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import Course from '@pages/course';

describe('<Course />', () => {
  test('Renders properly', () => {
    const component = renderer.create(
      <Router>
        <Course />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
