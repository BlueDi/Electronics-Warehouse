import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react';
import RequestsTable from './Table';
import { withCookies } from 'react-cookie';
import { service } from '@utils';
import { PageTitle } from '@common/components';

const professors_path = '/professors';
const request_path = '/request_items';

class RequestsCartList extends Component {
  columns_name = ['description', 'amount', 'details', 'location'];
  state = {
    data: [],
    professors: [],
    professor_id: undefined,
    details: undefined
  };

  constructor(props) {
    super(props);
    const { cookies } = this.props;
    this.state.data = cookies.get('cart');
  }

  componentDidMount() {
    service
      .get(professors_path)
      .then(response => {
        if (response) {
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

  clearRequests = () => {
    let { cookies } = this.props;
    cookies.set('cart', []);
    this.setState({ data: [] });
  };

  sendRequest = () => {
    const items = this.props.cookies.get('cart');
    if (this.state.professor_id != undefined) {
      const cart = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        cart.push({ id: item.id, amount: item.amount });
      }
      const body = {
        cart,
        details: this.state.details,
        professor_id: this.state.professor_id,
        user_id: this.props.allCookies.id
      };

      service
        .post(request_path, body)
        .then(response => {
          console.log(response);
          const { cookies } = this.props;
          cookies.set('cart', []);
          this.setState({ data: [] });
          this.props.history.goBack();
        })
        .catch(e => {
          console.error('Failed to send request!\n - ' + e);
        });
    }
  };

  render() {
    return (
      <PageTitle title="Requests Table">
        <RequestsTable cart={this.state.data} columns={this.state.columns} />
        <div style={{ paddingTop: '2em', float: 'left' }}>
          <Form>
            <Form.Dropdown
              selection
              search
              label="Professor"
              options={this.state.professors}
              value={this.state.professor_id}
              onChange={(e, { value }) =>
                this.setState({ professor_id: value })
              }
            />

            <Form.TextArea
              required
              label="Request Details"
              placeholder="Details"
              onChange={(e, { value }) => this.setState({ details: value })}
            />

            <Button.Group>
              <Button positive onClick={this.sendRequest}>
                Send Request
              </Button>
              <Button.Or />
              <Button negative onClick={this.clearRequests}>
                Clear All
              </Button>
            </Button.Group>
          </Form>
        </div>
      </PageTitle>
    );
  }
}

export default withCookies(RequestsCartList);
