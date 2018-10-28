import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

class Authorization extends Component {
  checkAuth(securityLevel) {
    return securityLevel > 1;
  }

  render() {
    var isAuth = this.checkAuth(this.props.cookies.get('security'));
    return isAuth ? this.props.children : <Redirect to="/" />;
  }
}

export default withCookies(Authorization);
