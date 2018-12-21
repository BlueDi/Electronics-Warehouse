import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Dropdown, Icon, Label, Menu } from 'semantic-ui-react';
import { service } from '@utils';

class UserMenu extends Component {
  render() {
    var { userCartLength, userName, userPath } = this.props;
    var emptyCart = userCartLength <= 0;
    return (
      <Dropdown
        icon={!emptyCart && <Label circular>{userCartLength}</Label>}
        item
        pointing
        trigger={userName}
      >
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={userPath}>
            <Icon name="cart" />
            Cart
          </Dropdown.Item>
          <Dropdown.Item as={Link} to={'/requests_list'}>
            <Icon name="clipboard" />
            Requests
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

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
    var userPath = this.props.cookies.get('user_path') || '/';
    var userCart = this.props.cookies.get('cart') || [];
    var userName = this.props.cookies.get('name') || undefined;
    var cartLength = userCart.length;

    return (
      <Menu.Menu position="right">
        <UserMenu
          userName={userName}
          userCartLength={cartLength}
          userPath={userPath}
        />
        <Menu.Item link onClick={this.handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Menu>
    );
  }
}

export { UserMenu };
export default withRouter(withCookies(Logout));
