import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import Authorization from '../Authorization';

test('Authorization Render', () => {
  const component = renderer.create(
    <Router>
      <Authorization
        param={'cenas'}
        cookies={{
          cenas: 'true',
          getAll: () => {},
          get: () => {
            return true;
          },
          addChangeListener: () => {}
        }}
      />
    </Router>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
