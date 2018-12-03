import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { service } from '@utils';
import { Loader, PageTitle } from '@common/components';
import RequestsTable from './Table';

class RequestsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: props.cookies.get('id') || -1,
      isFetching: true,
      user_permissions: -1
    };
  }

  componentDidMount() {
    this.getRole();
  }

  getRole() {
    if (this.state.user_id === -1) return;

    const urlGetRole = `/user_permissions/${this.state.user_id}`;
    service
      .get(urlGetRole)
      .then(response => {
        this.setState({ user_permissions: response.data.user_permissions });
      })
      .then(response => {
        console.log(response);
        this.getData();
      })
      .catch(e => {
        this.setState({
          isFetching: false
        });
        throw e;
      });
  }

  getData() {
    let DataUrl = `none`;
    if (this.state.user_permissions === 1)
      DataUrl = `/request_student_all/${this.state.user_id}`;
    else if (this.state.user_permissions === 2)
      DataUrl = `/request_professor_all/${this.state.user_id}`;
    else if (this.state.user_permissions === 3)
      DataUrl = `/request_manager_all`;

    service
      .get(DataUrl)
      .then(response => {
        this.setState({ requests: response.data, isFetching: false });
      })
      .catch(e => {
        this.setState({
          isFetching: false
        });
        throw e;
      });
  }

  default_column_order() {
    var columnOrder = [];
    this.state.requests.forEach(component => {
      columnOrder = columnOrder.concat(Object.keys(component));
    });
    columnOrder = [...new Set(columnOrder)];
    return columnOrder;
  }

  render() {
    return this.state.user_id === -1 ? (
      <Redirect to="/" />
    ) : this.state.isFetching ? (
      <Loader text="Preparing Table" />
    ) : (
      <PageTitle title="Requests List">
        <RequestsTable
          components={this.state.requests}
          columnsOrder={this.default_column_order()}
        />
      </PageTitle>
    );
  }
}

export default withCookies(RequestsList);
