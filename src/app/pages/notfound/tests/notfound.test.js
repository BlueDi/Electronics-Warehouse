import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import NotFound from '@pages/notfound';

test('<NotFound />', () => {
  const component = renderer.create(
    <Router>
      <NotFound />
    </Router>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
