import React from 'react';
import renderer from 'react-test-renderer';
import InDepthItemField from '@pages/inDepthItem/InDepthItemField';

describe('<InDepthItemField />', () => {
  test('Renders properly', () => {
    const component = renderer.create(<InDepthItemField />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Breadcrumb Field', () => {
    const myMock = jest.fn();
    const component = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={[]}
        fieldName="breadcrumb"
        handleChange={[myMock, myMock]}
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const component2 = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={[
          { key: '1', id: '1', name: 'test' },
          { key: '2', id: '2', name: 'test2' }
        ]}
        fieldName="breadcrumb"
        handleChange={[myMock, myMock]}
      />
    );
    tree = component2.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Category Field', () => {
    const component = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={{
          breadcrumb: [{ key: 1, id: '1', name: 'test' }],
          categoryList: [
            {
              key: 1,
              text: 'Electronic Components',
              value: 'Electronic Components'
            }
          ],
          dropdown: [
            { key: 1, text: 'c1', value: 'c1' },
            { key: 2, text: 'c2', value: 'c2' }
          ],
          itemCategory: { id: '2', name: '2' }
        }}
        fieldName="category"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const component2 = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={{
          itemCategory: { id: '1' },
          dropdown: [
            { key: 1, text: 'c1', value: 'c1' },
            { key: 2, text: 'c2', value: 'c2' }
          ]
        }}
        fieldName="category"
      />
    );
    tree = component2.toJSON();
    expect(tree).toMatchSnapshot();

    const component3 = renderer.create(
      <InDepthItemField
        editable={false}
        fieldContent={[
          {
            key: 1,
            id: '1',
            name: 'test'
          }
        ]}
        fieldName="category"
      />
    );
    tree = component3.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Description Field', () => {
    var value = 1;
    const component = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={value}
        fieldName="description"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const component2 = renderer.create(
      <InDepthItemField
        editable={false}
        fieldContent={value}
        fieldName="description"
      />
    );
    tree = component2.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Image Field', () => {
    const component = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={
          'iVBORw0KGgoAAAANSUhEUgAAAG8AAABYCAYAAAD7uql1AAAgAElEQVR4Xu29e5RV5Znu+5vfN6/r\nVmtVFXWjoChABFERVCKgUUAjthFzMZqYxLjT3aP79D456d49zj5nZJzTo0f/0+fsHumT7O6xY/be\n2umklcSEaFRuIiiIF0AUFQVFQSAlRRVVRdW6zut3/phrLs…'
        }
        fieldName="image"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const component2 = renderer.create(
      <InDepthItemField
        editable={false}
        fieldContent={
          'iVBORw0KGgoAAAANSUhEUgAAAG8AAABYCAYAAAD7uql1AAAgAElEQVR4Xu29e5RV5Znu+5vfN6/r\nVmtVFXWjoChABFERVCKgUUAjthFzMZqYxLjT3aP79D456d49zj5nZJzTo0f/0+fsHumT7O6xY/be\n2umklcSEaFRuIiiIF0AUFQVFQSAlRRVVRdW6zut3/phrLs…'
        }
        fieldName="image"
      />
    );
    tree = component2.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Other Field', () => {
    const component = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={'other'}
        fieldName="other"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Packaging Field', () => {
    const component = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={{
          itemPackaging: { id: '1', name: 'test' },
          packagingList: [{ key: '1', text: 'p1', value: 'p1' }]
        }}
        fieldName="packaging"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Properties Field', () => {
    const component = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={[{ key: 1, name: 'test', value: '1' }]}
        fieldName="properties"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const component2 = renderer.create(
      <InDepthItemField
        editable={false}
        fieldContent={[{ key: 1, name: 'test', value: '1', unit: 'w' }]}
        fieldName="properties"
      />
    );
    tree = component2.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Properties Invalid Field', () => {
    const component = renderer.create(
      <InDepthItemField
        editable={true}
        fieldContent={[{ key: 1, name: 'test', isNumber: true }]}
        fieldName="properties"
      />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const component2 = renderer.create(
      <InDepthItemField
        editable={false}
        fieldContent={[{ key: 1, name: 'test' }]}
        fieldName="properties"
      />
    );
    tree = component2.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
