import React from 'react';
import renderer from 'react-test-renderer';
import InDepthItemButtons from '@pages/inDepthItem/InDepthItemButtons';

describe('<InDepthItemButtons />', () => {
  test('Renders properly', () => {
    const component = renderer.create(<InDepthItemButtons />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Renders with edit enabled', () => {
    const component = renderer.create(<InDepthItemButtons editing={true} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
