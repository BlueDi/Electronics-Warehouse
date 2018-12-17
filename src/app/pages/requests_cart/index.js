import React, { Component } from 'react';
import { Button, Form, Message, Grid } from 'semantic-ui-react';
import RequestsTable from './Table';
import { withAlert } from 'react-alert';
import { withCookies } from 'react-cookie';
import { service } from '@utils';
import { PageTitle } from '@common/components';
import { Divider } from 'semantic-ui-react';
import { Authorization } from '@common/components';

const professors_path = '/professors';
const request_path = '/request_items';

/**
 * The page of the requests cart
 * @extends Component
 */
class RequestsCartList extends Component {
  /**
   * Constructs a RequestsCartList
   * @param {Object} props Properties of the component
   */
  constructor(props) {
    super(props || undefined);
    const { cookies } = this.props;

    this.state = {
      columns_name: ['description', 'amount', 'details', 'location'],
      data: cookies.get('cart'),
      details: undefined,
      professor_id: undefined,
      professors: []
    };
  }

  /**
   * Called after the component is mounted, gets the professor's name list
   */
  componentDidMount() {
    service
      .get(professors_path)
      .then(response => {
        if (response.data) {
          let professors = [];
          for (let i = 0; i < response.data.length; i++) {
            const { login, id } = response.data[i];
            professors.push({ key: id, value: id, flag: id, text: login });
          }
          if (professors.length > 0) {
            this.setState({ professor_id: professors[0].value, professors });
          }
        }
      })
      .catch(e => {
        console.error('Failed to fetch professors!\n - ' + e);
      });
  }

  /**
   * Clears the requests cart
   */
  clearRequests = () => {
    let { cookies } = this.props;
    cookies.set('cart', []);
    this.setState({ data: [] });
  };

  /**
   * Sends the requests cart to the database
   */
  sendRequest = () => {
    const items = this.props.cookies.get('cart');
    if (
      this.state.details !== undefined &&
      this.state.details !== null &&
      this.state.details != ''
    ) {
      const cart = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        cart.push({ id: item.id, amount: item.amount });
      }
      const body = {
        cart,
        details: this.state.details,
        professor_id: this.state.professor_id,
        user_id: this.props.cookies.get('id'),
        user_name: this.props.cookies.get('user_name')
      };

      service
        .post(request_path, body)
        .then(() => {
          const { cookies } = this.props;
          cookies.set('cart', []);
          this.setState({ data: [] });
          this.props.history.goBack();
        })
        .catch(e => {
          this.props.alert.show('Failed to send cart!', { type: 'error' });
          console.error('Failed to send request!\n - ' + e);
        });
    }
  };

  /**
   * Renders the form requesting the professor to send the request to
   * @return {Object} The form
   */
  professorForm = () => {
    return (
      <Form.Dropdown
        selection
        search
        label="Professor"
        options={this.state.professors}
        value={this.state.professor_id}
        onChange={(e, { value }) => this.setState({ professor_id: value })}
      />
    );
  };

  /**
   * Renders the form text area to insert the details of the request
   * @return {Object} Text area to render
   */
  requestDetails = () => {
    return (
      <Form.TextArea
        required
        label="Request Details"
        placeholder="Details"
        onChange={(e, { value }) => this.setState({ details: value })}
      />
    );
  };

  /**
   * Renders the accept and clear buttons
   * @return {Object} The component to render
   */
  buttons = () => {
    return (
      <div>
        <Button
          positive
          floated="left"
          content="Send Request"
          onClick={this.sendRequest}
        />
        <Button
          negative
          floated="right"
          content="Clear Request"
          onClick={this.clearRequests}
        />
      </div>
    );
  };

  /**
   * Renders the page when the cart is empty
   * @return {Object} The empty cart page
   */
  renderEmptyCart() {
    return (
      <Authorization param="can_request">
        <PageTitle title="Requests Table">
          <div align="center">
            <Message
              compact
              warning
              align="center"
              header="No Data"
              content="No item added to the request!"
            />
          </div>
        </PageTitle>
      </Authorization>
    );
  }

  /**
   * Renders the page when there are items in the cart
   * @param  {Object} cart Array of items
   * @return {Object}      The filled cart page
   */
  renderFilledCart(cart) {
    return (
      <Authorization param="can_request">
        <PageTitle title="Requests Table">
          <RequestsTable cart={cart} />
          <Divider hidden />
          <Divider hidden />

          <Grid>
            <Grid.Row columns={3}>
              <Grid.Column />
              <Grid.Column>
                <Form>
                  {this.professorForm()}
                  {this.requestDetails()}
                  {this.buttons()}
                </Form>
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
          </Grid>
        </PageTitle>
      </Authorization>
    );
  }

  /**
   * Renders the page
   * @return {Object} The page to render
   */
  render() {
    let cart = this.props.cookies.get('cart');
    if (cart == undefined || cart.length == 0) {
      return this.renderEmptyCart();
    } else {
      return this.renderFilledCart(cart);
    }
  }
}

export default withAlert(withCookies(RequestsCartList));
