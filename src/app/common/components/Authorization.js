import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

/**
 * Wrapper component that checks if the user has permission to see the page.
 * The cookie that is being checked must be received as a prop named "param".
 */
class Authorization extends Component {
  checkAuth() {
    const security = this.props.param;
    const authValue = this.props.cookies.get(security);
    return authValue === 'true';
  }

  render() {
    var isAuth = this.checkAuth();
    return isAuth ? this.props.children : <Redirect to="/" />;
  }
}

export default withCookies(Authorization);
