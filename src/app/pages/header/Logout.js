import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Label, Menu } from 'semantic-ui-react';
import { service } from '@utils';

class Logout extends Component {
  handleLogout = () => {
    service
      .post('/logout')
      .then(response => {
        response.data != 0
          ? this.props.history.push('/')
          : console.warn('Invalid logout');
      })
      .catch(error => {
        throw error;
      });
  };

  render() {
    var userPath = this.props.cookies.get('user_path');
    var userCart = this.props.cookies.get('cart') || [];
    var userName = this.props.cookies.get('name') || undefined;
    var cartLength = userCart.length;
    var emptyCart = cartLength <= 0;

    return (
      <Menu.Menu position="right">
        <Menu.Item as={Link} to={'/requests_list'}>
          Requests
        </Menu.Item>
        <Menu.Item as={Link} to={userPath}>
          {userName}
          {!emptyCart && <Label circular>{userCart.length}</Label>}
        </Menu.Item>
        <Menu.Item link onClick={this.handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Menu>
    );
  }
}

export default withRouter(withCookies(Logout));
