import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Menu } from 'semantic-ui-react';
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
    var userID = this.props.cookies.get('id');
    var userName = this.props.cookies.get('name');

    return (
      <Menu.Menu position="right">
        <Menu.Item as={Link} to={'/user/' + userID}>
          {userName}
        </Menu.Item>
        <Menu.Item link onClick={this.handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Menu>
    );
  }
}

export default withRouter(withCookies(Logout));
