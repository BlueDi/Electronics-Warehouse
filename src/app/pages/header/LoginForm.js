import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';
import { Form, Header, Image, Message } from 'semantic-ui-react';
import { service } from '@utils';

class LoginForm extends Component {
  state = { error: false, name: '', password: '' };

  handleChange = (e, { name, value }) =>
    this.setState({ error: false, [name]: value });

  handleAuthenticate = () => {
    service
      .post('/login', this.state)
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
          <Image src="/logo.png" /> Login to your account
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
            name="name"
            placeholder="E-mail address"
            required
            onChange={this.handleChange}
          />
          <Form.Input
            fluid
            icon="lock"
            iconPosition="left"
            name="password"
            placeholder="Password"
            required
            type="password"
            onChange={this.handleChange}
          />
          <Message
            error
            header="Failed Login"
            content="Please check again your user's info."
          />
          <Form.Button fluid>Login</Form.Button>
        </Form>
      </React.Fragment>
    );
  }
}

export default withRouter(withCookies(LoginForm));
