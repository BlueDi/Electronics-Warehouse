import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { Dropdown, Header, Menu, Modal } from 'semantic-ui-react';
import { service } from '@utils';

const options = [
  { key: 1, text: 'Manager  ', value: 0 },
  { key: 2, text: 'Professor', value: 1 },
  { key: 3, text: 'Student  ', value: 2 }
];

const values = [
  { key: 1, name: 'Manager', password: 'admin' },
  { key: 2, name: 'Professor', password: 'prof' },
  { key: 3, name: 'Student', password: 'student' }
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
    cookies.set('id', value.id, { path: '/' });
    cookies.set('name', value.name, { path: '/' });
    cookies.set('security', value.security, { path: '/' });
    cookies.set('userPath', value.userPath, { path: '/' });
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
