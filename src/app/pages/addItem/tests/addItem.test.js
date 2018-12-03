import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import AddItem from '@pages/addItem';

test('<AddItem />', () => {
  const component = renderer.create(
    <Router>
      <AddItem />
    </Router>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
