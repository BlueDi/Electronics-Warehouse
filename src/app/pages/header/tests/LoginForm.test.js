import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter as Router } from 'react-router-dom';
import LoginForm from '@pages/header/LoginForm';

describe('<LoginForm />', () => {
  const component = renderer.create(
    <Router>
      <LoginForm />
    </Router>
  );

  test('Renders properly', () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Renders error message properly', () => {
    const instance = component.root;
    const input_name = instance.find(
      el => el.type === 'input' && el.props.name === 'name'
    );
    input_name.props.onChange({
      target: { value: 'stu' }
    });

    const form = instance.find(el => el.type === 'form');
    form.props.onSubmit();

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
