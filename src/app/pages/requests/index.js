import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react';
import RequestsTable from './Table';
import { withCookies } from 'react-cookie';
import { service } from '@utils';
import { PageTitle } from '@common/components'

const professors_path = '/professors'
const request_path = '/request_items'

class RequestList extends Component {
  columns_name = ['description', 'amount', 'details', 'location'];
  state = {
    data: [],
    columns: [],
    professors: [],
    professor_id: undefined,
    details: undefined
  };

  constructor(props) {
    super(props);
    const { cookies } = this.props;
    this.state.data = cookies.get('cart');

    console.log(this.state.data);

    for (let i = 0; i < this.columns_name.length; i++) {
      const name = this.columns_name[i];
      this.state.columns.push({title: name, name: name});
    }
  }

  componentDidMount() {
    service
      .get(professors_path)
      .then(response => {
        if (response) {
          let professors = []
          for (let i = 0; i < response.data.length; i++) {
            const { login, id } = response.data[i];
            professors.push({key: id, value: id, flag: id, text: login});
          }
          this.setState({professors});
        }
      })
      .catch(e => {
        console.error('Failed to fetch professors!');
      });
  }

  handleProfessorChange = (e, {value}) => {
    this.state.professor_id = value;
  };

  handleDetailsChange = (e, {value}) => {
    this.state.details = value;
  }

  clearRequests = () => {
    let { cookies } = this.props;
    cookies.set('cart', []);
    this.state.data = [];
  }

  sendRequest = () => {
    if (this.state.professor_id != undefined) {
      const cart = [];
      for (let i = 0; i < this.state.data.length; i++) {
        const item = this.state.data[i];
        cart.push({id: item.id, amount: item.amount});
      }
      const body = {
        cart,
        details: this.state.details,
        professor_id: this.state.professor_id,
        user_id: this.props.allCookies.id
      }

      service
      .post(request_path, body)
      .then(response => {
        const { cookies } = this.props;
        cookies.set('cart', []);
        this.setState({data: []});
        this.props.history.goBack();
      })
      .catch (e => {
        console.error('Failed to send request!');
      });
    }
  }

  render() {
    return (
      <PageTitle title="Requests Table">
        <RequestsTable cart={this.state.data} columns={this.state.columns}/>
        <div style={{paddingTop: '2em', float: 'left'}}>
          <Form>
            <Form.Dropdown
              required
              fluid
              search
              selection
              placeholder='Professor Name'
              label='Professor'
              options={this.state.professors}
              onChange={this.handleProfessorChange}
            />

            <Form.TextArea
              required
              label='Request Details'
              placeholder='Details'
              onChange={this.handleDetailsChange}
            />

            <Button.Group>
              <Button positive onClick={this.sendRequest}>
                Send Request
              </Button>
              <Button.Or />
              <Button negative onClick={this.clearRequests}>Clear All</Button>
            </Button.Group>
          </Form>
        </div>
      </PageTitle>
    );
  }
}

export default withCookies(RequestList);
