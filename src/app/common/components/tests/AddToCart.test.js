import React from 'react';
import renderer from 'react-test-renderer';
import AddToCart from '../AddToCart';

var item1 = {
  id: 1,
  amount: 2,
  description: 'BMW motor',
  details: { details: 'Super detailed description', manufacturer: 'Multicomp' },
  image:
    'iVBORw0KGgoAAAANSUhEUgAAAG8AAABYCAYAAAD7uql1AAAgAElEQVR4Xu29e5RV5Znu+5vfN6/r\nVmtVFXWjoChABFERVCKgUUAjthFzMZqYxLjT3aP79D456d49zj5nZJzTo0f/0+fsHumT7O6xY/be\n2umklcSEaFRuIiiIF0AUFQVFQSAlRRVVRdW6zut3/phrLs…',
  last_edit: '2018-11-20T11:46:01.628Z',
  last_price: 89.12,
  location: 'HHD12U',
  reference: '213748227'
};
var item2 = {
  id: 2,
  amount: 3,
  description: 'Blue LED',
  details: { details: 'Super detailed description', manufacturer: 'Farnell' },
  image:
    'iVBORw0KGgoAAAANSUhEUgAAAG8AAABYCAYAAAD7uql1AAAgAElEQVR4Xu29e5RV5Znu+5vfN6/r\nVmtVFXWjoChABFERVCKgUUAjthFzMZqYxLjT3aP79D456d49zj5nZJzTo0f/0+fsHumT7O6xY/be\n2umklcSEaFRuIiiIF0AUFQVFQSAlRRVVRdW6zut3/phrLs…',
  last_edit: '2018-11-19T17:29:35.629Z',
  last_price: 1.98,
  location: 'DDS98K',
  reference: '68760203'
};

test('AddToCart Button Render', () => {
  const component = renderer.create(<AddToCart items={[item1, item2]} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
