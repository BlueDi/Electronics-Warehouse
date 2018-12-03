import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import LoginForm from '@pages/header/LoginForm';

describe('<LoginForm />', () => {
  test('Renders properly', () => {
    const component = renderer.create(
      <Router>
        <LoginForm />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
