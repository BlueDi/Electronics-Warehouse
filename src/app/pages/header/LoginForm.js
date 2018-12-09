import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { Form, Header, Image, Message } from 'semantic-ui-react';
import { service } from '@utils';
import logo from '@assets/images/logo.png';

class LoginForm extends Component {
  state = { error: false, error_msg: '', name: '', password: '' };

  handleChange = (e, { name, value }) =>
    this.setState({ error: false, [name]: value });

  handleAuthenticate = () => {
    service
      .post('/login', this.state)
      .then(response => {
        this.setupLoggedUser(response.data);
      })
      .catch(err => {
        this.failedLogin(err.response.data);
      });
  };

  setupLoggedUser = value => {
    console.log(value);
    const { cookies } = this.props;
    for (var property in value) {
      cookies.set(property, value[property], { path: '/' });
    }
    cookies.set('cart', [], { path: '/' });
  };

  failedLogin = err => {
    this.setState({ error: true, error_msg: err });
  };

  nameField = () => {
    return (
      <Form.Input
        fluid
        icon="user"
        iconPosition="left"
        name="name"
        label="Name or E-mail"
        placeholder="Name or E-mail"
        required
        onChange={this.handleChange}
      />
    );
  };

  passwordField = () => {
    return (
      <Form.Input
        fluid
        icon="lock"
        iconPosition="left"
        name="password"
        label="Password"
        placeholder="Password"
        required
        type="password"
        onChange={this.handleChange}
      />
    );
  };

  errorMessage = () => {
    return (
      <Message error header="Failed Login" content={this.state.error_msg} />
    );
  };

  render() {
    return (
      <React.Fragment>
        <Header size="large">
          <Image src={logo} /> Login to your account
        </Header>
        <Form
          size="large"
          error={this.state.error}
          onSubmit={this.handleAuthenticate}
        >
          {this.nameField()}
          {this.passwordField()}
          {this.errorMessage()}
          <Form.Button fluid>Login</Form.Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default withRouter(withCookies(LoginForm));
