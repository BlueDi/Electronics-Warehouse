import React, { Component } from 'react';

import RequestsTable from './Table';
import { withCookies } from 'react-cookie';
import { service } from '@utils';
import { PageTitle } from '@common/components'

class RequestList extends Component {
  columns_name = ['description', 'amount', 'details', 'location'];
  state = {
    data: [],
    columns: [],
  };

  constructor(props) {
    super(props);
    const { cookies } = this.props;
    const cart = cookies.get('cart');
    console.log(cart);

    for (let i = 0; i < cart.length; i++) {
      let cart_item = cart[i].item;
      cart_item['amount']= cart[i].amount;
      this.state.data.push(cart_item);
    }
    for (let i = 0; i < this.columns_name.length; i++) {
      const name = this.columns_name[i];
      this.state.columns.push({title: name, name: name});
    }
  }

  render() {
    return (
      <PageTitle title="Requests Table">
        <RequestsTable cart={this.state.data} columns={this.state.columns}/>
      </PageTitle>
    );
  }
}

export default withCookies(RequestList);
