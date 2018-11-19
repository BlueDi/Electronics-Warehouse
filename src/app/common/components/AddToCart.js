import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
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

  renderButton() {
    return this.props.simple ? (
      <Input
        action={<Button color="teal" icon="cart" onClick={this.handleClick} />}
        actionPosition="left"
        fluid
        placeholder="Buy"
        defaultValue="1"
      />
    ) : (
      <Button onClick={this.handleClick}>Add to Cart</Button>
    );
  }

  render() {
    var canRequest = this.props.cookies.get('can_request') === 'true';
    return canRequest && this.renderButton();
  }
}

export default withCookies(AddToCart);
