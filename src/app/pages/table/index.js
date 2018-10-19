import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Grid, Icon, Menu, Table } from 'semantic-ui-react';
import { service } from '@utils';
import {
  AddItemButton,
  Loader,
  PageTitle,
  SearchBar
} from '@common/components';
import GeneralParam from './GeneralParam';

const urlForData = id => `/table/${id}`;

class WHTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      column: null,
      direction: null,
      id: this.props.match.params.id,
      isFetching: true
    };
  }

  componentDidMount() {
    service
      .get(urlForData(this.state.id))
      .then(response => {
        this.setState({
          components: response.data,
          pages: 50,
          isFetching: false
        });
        this.mount_table();
      })
      .catch(e => {
        this.setState({
          isFetching: false
        });
        throw e;
      });
  }

  handleSort = clickedColumn => () => {
    const { column, components, direction } = this.state;

    column !== clickedColumn
      ? this.setState({
          column: clickedColumn,
          components: _.sortBy(components, [clickedColumn]),
          direction: 'ascending'
        })
      : this.setState({
          components: components.reverse(),
          direction: direction === 'ascending' ? 'descending' : 'ascending'
        });

    this.mount_table();
  };

  mount_header() {
    var header_params = [];
    for (var param in this.state.components[0]) {
      if (param !== 'id')
        header_params.push(
          <Table.HeaderCell
            key={param}
            sorted={this.state.column === param ? this.state.direction : null}
            onClick={this.handleSort(param)}
          >
            {param}
          </Table.HeaderCell>
        );
    }
    return (
      <Table.Header>
        <Table.Row>{header_params}</Table.Row>
      </Table.Header>
    );
  }

  mount_rows() {
    var table_rows = [];
    for (let comp of this.state.components) {
      var row_cells = [];
      for (var param in comp) {
        if (param !== 'id')
          row_cells.push(
            <GeneralParam
              key={param}
              id={comp['id']}
              value={comp[param]}
              parameter={param}
            />
          );
      }
      table_rows.push(<Table.Row key={comp.id}>{row_cells}</Table.Row>);
    }
    return table_rows;
  }

  mount_table() {
    var table_header = this.mount_header();
    var table_rows = this.mount_rows();

    this.setState({
      table_header: table_header,
      table_rows: table_rows
    });
  }

  mount_pagination() {
    var pagination = [];
    for (var i = 1; i <= this.state.pages && i <= 8; i++) {
      pagination.push(
        <Menu.Item key={i} as={Link} to={'/table/' + i}>
          {i}
        </Menu.Item>
      );
    }
    return pagination;
  }

  render() {
    return this.state.isFetching ? (
      <Loader text="Preparing Table" />
    ) : (
      <PageTitle title="Table">
        <Grid>
          <Grid.Column floated="left" width={5}>
            <AddItemButton />
          </Grid.Column>
          <Grid.Column floated="right" width={5}>
            <SearchBar />
          </Grid.Column>
        </Grid>

        <Table
          key={'content'}
          celled
          selectable
          sortable
          striped
          style={{ marginTop: '5em' }}
        >
          {this.state.table_header}
          <Table.Body>{this.state.table_rows}</Table.Body>
        </Table>
        <Menu key={'menu'} compact pagination style={{ float: 'right' }}>
          <Menu.Item as={Link} to={'/table/' + (this.state.id - 1)} icon>
            <Icon name="chevron left" />
          </Menu.Item>
          {this.mount_pagination()}
          <Menu.Item as={Link} to={'/table/' + (this.state.id + 1)} icon>
            <Icon name="chevron right" />
          </Menu.Item>
        </Menu>
      </PageTitle>
    );
  }
}

export default WHTable;
