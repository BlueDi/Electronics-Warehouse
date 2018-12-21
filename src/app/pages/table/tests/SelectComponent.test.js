import React from 'react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import SelectComponent from '../SelectComponent';

var item1 = {
  description: 'BMW motor',
  details: { details: 'Super detailed description', manufacturer: 'Multicomp' },
  image:
    'iVBORw0KGgoAAAANSUhEUgAAAG8AAABYCAYAAAD7uql1AAAgAElEQVR4Xu29e5RV5Znu+5vfN6/r\nVmtVFXWjoChABFERVCKgUUAjthFzMZqYxLjT3aP79D456d49zj5nZJzTo0f/0+fsHumT7O6xY/be\n2umklcSEaFRuIiiIF0AUFQVFQSAlRRVVRdW6zut3/phrLs…',
  last_edit: '2018-11-20T11:46:01.628Z',
  last_price: 89.12,
  location: 'HHD12U',
  reference: '213748227'
};

describe('SelectComponent', () => {
  it('should be defined', () => {
    expect(SelectComponent).toBeDefined();
  });

  it('creates a selection button for 1 item', () => {
    const component = TestRenderer.create(
      <Router>
        <SelectComponent row={item1} />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
