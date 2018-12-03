import React from 'react';
import renderer from 'react-test-renderer';
import InDepthItem from '@pages/inDepthItem';

describe('<InDepthItem />', () => {
  test('Renders properly', async () => {
    const component = renderer.create(<InDepthItem id="1" />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
