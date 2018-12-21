import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import RequestsTable from '../Table';

var item = {
  description: 'BMW motor',
  details: { details: 'Super detailed description', manufacturer: 'Multicomp' },
  free_stock: 1,
  image:
    'iVBORw0KGgoAAAANSUhEUgAAAG8AAABYCAYAAAD7uql1AAAgAElEQVR4Xu29e5RV5Znu+5vfN6/r\nVmtVFXWjoChABFERVCKgUUAjthFzMZqYxLjT3aP79D456d49zj5nZJzTo0f/0+fsHumT7O6xY/be\n2umklcSEaFRuIiiIF0AUFQVFQSAlRRVVRdW6zut3/phrLs…',
  last_edit: '2018-11-20T11:46:01.628Z',
  last_price: 89.12,
  location: 'HHD12U',
  reference: '213748227'
};

var columns = [
  { name: 'description', title: 'Description' },
  { name: 'image', title: 'Image' },
  { name: 'total_stock', title: 'Total Stock' },
  { name: 'free_stock', title: 'Free Stock' },
  { name: 'last_price', title: 'Last Price' },
  { name: 'location', title: 'Location' },
  { name: 'user_comments', title: 'User Comments' },
  { name: 'details', title: 'Details' },
  { name: 'reference', title: 'Reference' },
  { name: 'packaging_id', title: 'Packaging ID' },
  { name: 'last_edit', title: 'Last Edit' },
  { name: 'properties', title: 'Properties' },
  { name: 'category', title: 'Category' }
];

describe('RequestsTable', () => {
  it('should be defined', () => {
    expect(RequestsTable).toBeDefined();
  });

  it('renders properly', () => {
    const component = renderer.create(
      <Router>
        <RequestsTable items={[item]} columns={columns} />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
