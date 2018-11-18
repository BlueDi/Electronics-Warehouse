import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Menu } from 'semantic-ui-react';
import Login from './Login';
import Logout from './Logout';

class WHHeader extends Component {
  checkSecurity() {
    const { cookies } = this.props;
    const emptyCookie =
      Object.keys(cookies.cookies).length === 0 &&
      cookies.cookies.constructor === Object;
    const validSecurity = cookies.get('security') !== '0';
    return !emptyCookie && validSecurity;
  }

  render() {
    return (
      <Menu attached size="huge">
        <Menu.Item as={Link} to="/">
          <Header size="medium">Warehouse</Header>
        </Menu.Item>

        {this.checkSecurity() ? <Logout /> : <Login />}
      </Menu>
    );
  }
}

export default withCookies(WHHeader);
