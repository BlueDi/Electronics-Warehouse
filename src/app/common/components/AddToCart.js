import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';

class AddToCart extends Component {
  handleClick = () => {
    const { cookies, items } = this.props;
    var cart = cookies.get('cart');
    for (var item of items) {
      if (!cart.some(i => i.item.id == item.id)) {
        delete item.image;
        cart.push({ item, ammount: 1 });
      }
    }
    cookies.set('cart', cart, { path: '/' });
  };

  render() {
    var canRequest = this.props.cookies.get('can_request') === 'true';
    return (
      canRequest && <Button onClick={this.handleClick}>Add to Cart</Button>
    );
  }
}

export default withCookies(AddToCart);
