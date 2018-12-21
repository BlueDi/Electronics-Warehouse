import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import RequestsList from '@pages/requests_list';

describe('RequestsList', () => {
  it('should be defined', () => {
    expect(RequestsList).toBeDefined();
  });

  it('renders properly', () => {
    const component = renderer.create(
      <Router>
        <RequestsList />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
