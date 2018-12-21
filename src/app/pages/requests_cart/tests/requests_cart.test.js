import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import RequestsCartList from '@pages/requests_cart';

describe('RequestsCartList', () => {
  it('should be defined', () => {
    expect(RequestsCartList).toBeDefined();
  });

  it('renders properly', () => {
    const component = renderer.create(
      <Router>
        <RequestsCartList />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
