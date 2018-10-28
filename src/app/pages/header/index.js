import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Header, Menu } from 'semantic-ui-react';
import Login from './Login';
import Logout from './Logout';

class WHHeader extends Component {
  render() {
    const { cookies } = this.props;
    const security = cookies.get('security');

    return (
      <Menu attached size="huge">
        <Menu.Item as={Link} to="/">
          <Header size="medium">Warehouse</Header>
        </Menu.Item>

        {security !== '0' ? <Logout /> : <Login />}
      </Menu>
    );
  }
}

export default withCookies(WHHeader);
