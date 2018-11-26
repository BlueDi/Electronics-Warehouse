import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { Dropdown, Header, Menu, Modal } from 'semantic-ui-react';
import { service } from '@utils';

const options = [
  { key: 1, text: 'Student1  ', value: 0 },
  { key: 2, text: 'Student2  ', value: 1 },
  { key: 3, text: 'Professor1', value: 2 },
  { key: 4, text: 'Professor2', value: 3 },
  { key: 5, text: 'Manager1  ', value: 4 },
  { key: 6, text: 'Manager2  ', value: 5 }
];

const values = [
  { key: 1, name: 'student1', password: '1234' },
  { key: 2, name: 'student2', password: 'qwer' },
  { key: 3, name: 'professor1', password: '1234' },
  { key: 4, name: 'professor2', password: 'qwer' },
  { key: 5, name: 'manager1', password: '1234' },
  { key: 6, name: 'manager2', password: 'qwer' }
];

class Login extends Component {
  handleAuthenticate = (e, { value }) => {
    service
      .post('/login', values[value])
      .then(response => {
        response.data != 0
          ? this.handleChange(response.data)
          : console.warn('Invalid login');
      })
      .catch(error => {
        throw error;
      });
  };

  handleChange = value => {
    const { cookies, history } = this.props;
    for (var property in value) {
      cookies.set(property, value[property], { path: '/' });
    }
    history.push(value.userPath);
  };

  renderSignUp() {
    return (
      <Modal trigger={<Menu.Item>Signup</Menu.Item>}>
        <Modal.Header>Sign Up</Modal.Header>
        <Modal.Content>
          <Header>Shibboleth</Header>
          <p>Maybe use a modal for the login.</p>
          <p>To do.</p>
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    return (
      <Menu.Menu position="right">
        {this.renderSignUp()}
        <Dropdown
          item
          lazyLoad
          simple
          text="Login"
          direction="right"
          options={options}
          onChange={this.handleAuthenticate}
        />
      </Menu.Menu>
    );
  }
}

export default withRouter(withCookies(Login));
