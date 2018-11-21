import React, { Component } from 'react';
//import { Grid } from 'semantic-ui-react';
import { service } from '@utils';
import { Loader, PageTitle } from '@common/components';
import RequestsTable from './Table';

const urlAllRequests = `/request_all`;

class Requests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      isFetching: true
    };
  }

  componentDidMount() {
    console.log('test');
    this.getData();
    console.log('test2');
  }

  getData() {
    service
      .get(urlAllRequests)
      .then(response => {
        console.log(response.data);
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
    return this.state.isFetching ? (
      <Loader text="Preparing Table" />
    ) : (
      <PageTitle title="Requests">
        <RequestsTable
          components={this.state.requests}
          columnsOrder={this.default_column_order()}
        />
      </PageTitle>
    );
  }
}

export default Requests;
