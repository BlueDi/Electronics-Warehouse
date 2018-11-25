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
      var i;
      for (i = 0; i < cart.length; i++) {
        if (cart[i].id == item.id) {
          cart[i]['amount'] = +cart[i].amount + +amount;
          break;
        }
      }
      if (i === cart.length) {
        cart.push(this.makeItemCopy(item, amount));
      }
    }
    cookies.set('cart', cart, { path: '/' });
    console.log(cookies.get('cart'));
  };

  makeItemCopy = (item, amount) => {
    const ignore = ['image'];
    let item_copy = {amount};

    for (let property in item) {
      if (ignore.indexOf(property) === -1) {
        item_copy[property] = item[property];
      }
    }

    return item_copy;
  }

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
