import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';

class AddToCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 1,
      items: this.props.items,
      simple: this.props.simple
    };
  }

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value
    });
  };

  handleClick = () => {
    const { cookies } = this.props;
    const { amount, items } = this.state;
    var cart = cookies.get('cart');
    for (var item of items) {
      if (!cart.some(i => i.item.id == item.id)) {
        delete item.image;
        cart.push({ item, amount: amount });
      }
    }
    cookies.set('cart', cart, { path: '/' });
  };

  renderButton() {
    const { simple } = this.state;
    return simple ? (
      <Input
        action={<Button color="teal" icon="cart" onClick={this.handleClick} />}
        actionPosition="left"
        fluid
        placeholder="Buy"
        name="amount"
        value={this.state.amount}
        onChange={this.handleChange}
      />
    ) : (
      <Button onClick={this.handleClick}>Add to Cart</Button>
    );
  }

  render() {
    const { cookies } = this.props;
    var canRequest = cookies.get('can_request') === 'true';
    return canRequest && this.renderButton();
  }
}

export default withCookies(AddToCart);
