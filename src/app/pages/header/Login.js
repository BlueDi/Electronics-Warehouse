import React, { Component } from 'react';
import { Header, Menu, Modal } from 'semantic-ui-react';
import LoginForm from './LoginForm';

class LoginModal extends Component {
  render() {
    return (
      <Modal size="tiny" trigger={<Menu.Item>Login</Menu.Item>}>
        <Modal.Content>
          <LoginForm />
        </Modal.Content>
      </Modal>
    );
  }
}

class SignupModal extends Component {
  render() {
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
}

class Login extends Component {
  render() {
    return (
      <Menu.Menu position="right">
        <SignupModal />
        <LoginModal />
      </Menu.Menu>
    );
  }
}

export { LoginModal, SignupModal };
export default Login;
