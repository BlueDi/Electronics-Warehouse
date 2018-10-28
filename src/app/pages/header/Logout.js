import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Menu } from 'semantic-ui-react';

class Logout extends Component {
  handleLogout = () => {
    const { cookies } = this.props;
    cookies.set('id', null, { path: '/' });
    cookies.set('name', null, { path: '/' });
    cookies.set('security', 0, { path: '/' });
  };

  render() {
    var userID = this.props.cookies.get('id');
    var userName = this.props.cookies.get('name');

    return (
      <Menu.Menu position="right">
        <Menu.Item as={Link} to={'/user/' + userID}>
          {userName}
        </Menu.Item>
        <Menu.Item as={Link} to={'/'} onClick={this.handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Menu>
    );
  }
}

export default withCookies(Logout);
