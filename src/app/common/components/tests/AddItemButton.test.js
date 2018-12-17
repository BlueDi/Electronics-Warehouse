import React from 'react';
import renderer from 'react-test-renderer';
import AddItemButton from '../AddItemButton';

test('AddItemButton Button Render', () => {
  const component = renderer.create(<AddItemButton />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
