import React from 'react';
import renderer from 'react-test-renderer';
import Request from '../index';

test('Create request buttons', () => {
  const component = renderer.create(<Request id={1} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
