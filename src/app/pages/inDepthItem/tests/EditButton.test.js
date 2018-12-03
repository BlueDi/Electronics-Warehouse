import React from 'react';
import renderer from 'react-test-renderer';
import EditButton from '@pages/inDepthItem/EditButton';

describe('<EditButton />', () => {
  test('Renders properly', () => {
    const component = renderer.create(<EditButton />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Renders with edit enabled', () => {
    const component = renderer.create(<EditButton editing={true} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
