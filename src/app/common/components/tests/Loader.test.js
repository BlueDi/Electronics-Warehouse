import React from 'react';
import renderer from 'react-test-renderer';
import Loader from '../Loader';

test('Loader Render', () => {
  const component = renderer.create(<Loader />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
