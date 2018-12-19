import React, { Component } from 'react';
import { withAlert } from 'react-alert';
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

  componentDidUpdate(prevProps) {
    if (prevProps.items.length != this.props.items.length) {
      this.setState({ items: this.props.items });
    }
  }

  transformTxt = text => {
    let clean_txt = text.substring(0, text.length - 1);
    return clean_txt.split('\n').map(function(txt) {
      return (
        <span key={txt}>
          {txt}
          <br />
        </span>
      );
    });
  };

  handleChange = ({ target }) => {
    this.setState({
      [target.name]: target.value
    });
  };

  handleClick = e => {
    e.preventDefault();
    const { alert, cookies } = this.props;
    const { amount, items } = this.state;
    var cart = cookies.get('cart'),
      requested_items = 'added to cart:\n';

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
      requested_items += amount + " of '" + item.description + "'\n";
    }

    alert.show(this.transformTxt(requested_items));
    cookies.set('cart', cart, { path: '/' });
  };

  makeItemCopy = (item, amount) => {
    const ignore = ['image'];
    let item_copy = { amount };

    for (let property in item) {
      if (ignore.indexOf(property) === -1) {
        item_copy[property] = item[property];
      }
    }

    return item_copy;
  };

  renderButton() {
    const { amount, simple } = this.state;

    return simple ? (
      <Input
        action={<Button color="teal" icon="cart" onClick={this.handleClick} />}
        actionPosition="left"
        fluid
        placeholder="Buy"
        name="amount"
        value={amount}
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

export default withCookies(withAlert(AddToCart));
