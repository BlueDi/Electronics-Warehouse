import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import WHHeader from '@pages/header';

describe('<WHHeader />', () => {
  test('Renders properly', () => {
    const component = renderer.create(
      <Router>
        <WHHeader />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
