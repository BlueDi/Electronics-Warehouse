import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { Form, Header, Image, Message } from 'semantic-ui-react';
import { service } from '@utils';
import logo from '@assets/images/logo.png';

class SignupForm extends Component {
  state = {
    error: undefined,
    name: '',
    password: '',
    email: '',
    permission: ''
  };

  handleChange = (e, { name, value }) =>
    this.setState({ error: undefined, [name]: value });

  handleAuthenticate = () => {
    const body = {
      name: this.state.name,
      password: this.state.password,
      email: this.state.email,
      permission: this.state.permission
    };
    service
      .post('/signup', body)
      .then(response => {
        this.setupLoggedUser(response.data);
      })
      .catch(() => {
        this.failedLogin();
      });
  };

  setupLoggedUser = value => {
    const { cookies, history } = this.props;
    for (var property in value) {
      cookies.set(property, value[property], { path: '/' });
    }
    cookies.set('cart', [], { path: '/' });
    history.push(value.userPath);
  };

  failedLogin = () => {
    this.setState({ error: true });
  };

  render() {
    return (
      <React.Fragment>
        <Header size="large">
          <Image src={logo} /> Signup an account
        </Header>
        <Form
          size="large"
          error={this.state.error}
          onSubmit={this.handleAuthenticate}
        >
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label="Name"
            name="name"
            placeholder="User name"
            required
            onChange={this.handleChange}
          />
          <Form.Input
            fluid
            icon="at"
            iconPosition="left"
            name="email"
            label="E-mail"
            type="email"
            placeholder="E-mail address"
            required
            onChange={this.handleChange}
          />
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
          <Form.Input
            fluid
            icon="options"
            iconPosition="left"
            name="permission"
            label="Permission Key"
            type="password"
            placeholder="Permission key"
            onChange={this.handleChange}
          />
          <Message
            error
            header="Failed Login"
            content="Please check again your user's info."
          />
          <Form.Button fluid>Signup</Form.Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default withRouter(withCookies(SignupForm));
