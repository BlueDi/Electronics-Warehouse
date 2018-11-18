import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';

class AddToCart extends Component {
  handleClick = () => {
    var newItems = this.props.items;
    delete newItems[0]['image'];
    var oldCart = this.props.cookies.get('cart') || [];
    var newUniqueItems = [];
    for (let item of newItems)
      if (!oldCart.some(i => i.id == item.id))
        newUniqueItems.push({ item, ammount: 1 });

    var newCart = [...oldCart, ...newUniqueItems];
    this.props.cookies.set('cart', newCart);
  };

  render() {
    var canRequest = this.props.cookies.get('can_request') === 'true';
    return (
      canRequest && <Button onClick={this.handleClick}>Add to Cart</Button>
    );
  }
}

export default withCookies(AddToCart);
