import React from 'react';
import renderer from 'react-test-renderer';
import SearchBar from '../SearchBar';

test('SearchBar Field Render', () => {
  const component = renderer.create(<SearchBar value={undefined} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
