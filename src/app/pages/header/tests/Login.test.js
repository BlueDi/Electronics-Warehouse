import React from 'react';
import renderer from 'react-test-renderer';
import Login, { LoginModal, SignupModal } from '@pages/header/Login';

describe('<Login />', () => {
  test('Renders properly', () => {
    const component = renderer.create(<Login />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('<LoginModal />', () => {
  test('Renders properly', () => {
    const component = renderer.create(<LoginModal />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('<SignupModal />', () => {
  test('Renders properly', () => {
    const component = renderer.create(<SignupModal />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
