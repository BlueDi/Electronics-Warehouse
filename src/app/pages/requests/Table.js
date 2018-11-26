import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {
  PagingState,
  IntegratedPaging,
  SearchState,
  IntegratedFiltering,
  SortingState,
  IntegratedSorting
} from '@devexpress/dx-react-grid';
import {
  Grid,
  DragDropProvider,
  Table,
  TableHeaderRow,
  TableColumnReordering,
  PagingPanel,
  ColumnChooser,
  TableColumnVisibility,
  SearchPanel,
  Toolbar
} from '@devexpress/dx-react-grid-material-ui';
import { Button, Icon } from 'semantic-ui-react';

const SortingIcon = ({ direction }) =>
  direction === 'asc' ? <Icon name="arrow up" /> : <Icon name="arrow down" />;

const SortLabel = ({ onSort, children, direction }) => {
  return (
    <Button fluid icon labelPosition="right" onClick={onSort}>
      {children}
      {direction && <SortingIcon direction={direction} />}
    </Button>
  );
};

class TableRow extends Component {
  render() {
    return (
      <Route
        render={({ history }) => (
          <Table.Row
            {...this.props}
            onClick={() =>
              history.push('/request/' + this.props.tableRow.row.id)
            }
          />
        )}
      />
    );
  }
}

class RequestsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      tableColumnExtensions: [],
      rows: this.props.requests
    };
  }

  componentDidMount() {
    this.mount_header();
  }

  mount_header() {
    var header_params = [];
    for (var param in this.state.rows[0]) {
      header_params.push({ name: param, title: param });
    }
    this.setState({ columns: header_params });
  }

  render() {
    const { rows, columns, tableColumnExtensions } = this.state;

    return (
      <Grid rows={rows} columns={columns}>
        <PagingState defaultCurrentPage={0} pageSize={7} />
        <IntegratedPaging />
        <DragDropProvider />
        <SearchState />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: 'description', direction: 'asc' }]}
        />
        <IntegratedSorting />
        <Table
          rowComponent={TableRow}
          columnExtensions={tableColumnExtensions}
        />
        <TableColumnReordering defaultOrder={this.props.columnsOrder} />
        <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
        <TableColumnVisibility defaultHiddenColumnNames={[]} />
        <Toolbar />
        <SearchPanel />
        <ColumnChooser />
        <PagingPanel />
      </Grid>
    );
  }
}

export default RequestsTable;
