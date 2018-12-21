import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import Logout, { UserMenu } from '@pages/header/Logout';

describe('UserMenu', () => {
  it('should be defined', () => {
    expect(UserMenu).toBeDefined();
  });

  it('renders properly', () => {
    const component = renderer.create(
      <Router>
        <UserMenu userName={'Test'} userCartLength={1} userPath={'/test'} />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Logout', () => {
  it('should be defined', () => {
    expect(Logout).toBeDefined();
  });

  it('renders properly', () => {
    const component = renderer.create(
      <Router>
        <Logout />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
