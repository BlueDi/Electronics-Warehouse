import React from 'react';
import CardItem from '../Card';
import renderer from 'react-test-renderer';

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

test('Create a Card the Request Cart List', () => {
  const component = renderer.create(<CardItem item={item} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
