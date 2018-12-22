import React from 'react';
import renderer from 'react-test-renderer';
import WHTable from '../index';

test('Create a table', () => {
  const component = renderer.create(<WHTable match={{ params: { id: 2 } }} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
