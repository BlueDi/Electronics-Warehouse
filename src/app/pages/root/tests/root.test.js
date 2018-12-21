import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import { Layout } from '@pages/root';

describe('Layout', () => {
  it('should be defined', () => {
    expect(Layout).toBeDefined();
  });

  it('renders properly', () => {
    const component = renderer.create(
      <Router>
        <Layout />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
