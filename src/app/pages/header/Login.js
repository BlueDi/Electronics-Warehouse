import React, { Component } from 'react';
import { Menu, Modal } from 'semantic-ui-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

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
      <Modal size="small" trigger={<Menu.Item>Signup</Menu.Item>}>
        <Modal.Content>
          <SignupForm />
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
