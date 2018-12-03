import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import WHMenu from '@pages/menu';

describe('<InDepthItemButtons />', () => {
  test('Renders properly', () => {
    const component = renderer.create(
      <Router>
        <WHMenu />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
