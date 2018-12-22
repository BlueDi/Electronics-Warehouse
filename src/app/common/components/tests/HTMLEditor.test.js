import React from 'react';
import renderer from 'react-test-renderer';
import HTMLEditor from '../HTMLEditor';

test('HTMLEditor Field Render', () => {
  const component = renderer.create(
    <HTMLEditor displayOnly={true} value={''} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
