import React, { Component } from 'react';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';
import GeneralParam from './GeneralParam';

class ComponentsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: this.props.components
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.mount_table();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  handleSort = clickedColumn => () => {
    if (clickedColumn === 'image') return;

    const { column, components, direction } = this.state;

    this.setState(
      column !== clickedColumn
        ? {
            column: clickedColumn,
            components: _.sortBy(components, [clickedColumn]),
            direction: 'ascending'
          }
        : {
            components: components.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending'
          },
      () => this.mount_table()
    );
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
    var i;

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
        else i = comp[param];
      }
      table_rows.push(<Table.Row key={i}>{row_cells}</Table.Row>);
    }
    return <Table.Body>{table_rows}</Table.Body>;
  }

  mount_table(data) {
    this.setState({
      components: data
    });
    var table_header = this.mount_header();
    var table_rows = this.mount_rows();

    this.setState({
      table_header: table_header,
      table_rows: table_rows
    });
  }

  render() {
    return (
      <Table key={'content'} celled selectable sortable striped>
        {this.state.table_header}
        {this.state.table_rows}
      </Table>
    );
  }
}

export default ComponentsTable;
