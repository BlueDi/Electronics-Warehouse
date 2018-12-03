import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {
  PagingState,
  IntegratedPaging,
  SearchState,
  IntegratedFiltering,
  SortingState,
  IntegratedSorting,
  DataTypeProvider,
  SelectionState
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
  Toolbar,
  TableSelection
} from '@devexpress/dx-react-grid-material-ui';
import { Button, Icon, Image } from 'semantic-ui-react';

const SortingIcon = ({ direction }) =>
  direction === 'asc' ? <Icon name="arrow up" /> : <Icon name="arrow down" />;

const SortLabel = ({ onSort, children, direction }) => {
  return children.props.children !== 'image' &&
    children.props.children !== 'details' &&
    children.props.children !== 'properties' ? (
    <Button fluid icon labelPosition="right" onClick={onSort}>
      {children}
      {direction && <SortingIcon direction={direction} />}
    </Button>
  ) : (
    <Button fluid>{children}</Button>
  );
};

const DetailsFormatter = ({ value }) => {
  var details_list = [];
  for (const param in value) {
    if (value.hasOwnProperty(param)) {
      details_list.push(<p>{param + ': ' + value[param]}</p>);
    }
  }
  return details_list;
};

const DetailsTypeProvider = props => (
  <DataTypeProvider formatterComponent={DetailsFormatter} {...props} />
);

const ImageFormatter = ({ value }) => (
  <Image src={`data:image/png;base64,${value}`} size="small" />
);

const ImageTypeProvider = props => (
  <DataTypeProvider formatterComponent={ImageFormatter} {...props} />
);

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
    console.log(props);
    this.state = {
      columns: [],
      tableColumnExtensions: [],
      detailsColumns: ['details', 'properties'],
      imageColumns: ['image'],
      rows: this.props.components,
      selection: []
    };
  }

  componentDidMount() {
    this.mount_header();
  }

  changeSelection = selection => this.setState({ selection });

  getItemsFromSelection() {
    const { rows, selection } = this.state;
    var selected = [];
    for (var i in selection) selected.push(rows[i]);
    return selected;
  }

  mount_header() {
    var header_params = [];
    for (var param in this.state.rows[0]) {
      header_params.push({ name: param, title: param });
    }
    this.setState({ columns: header_params });
  }

  render() {
    const {
      rows,
      columns,
      tableColumnExtensions,
      detailsColumns,
      imageColumns,
      selection
    } = this.state;

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
        <DetailsTypeProvider for={detailsColumns} />
        <ImageTypeProvider for={imageColumns} />
        <SelectionState
          selection={selection}
          onSelectionChange={this.changeSelection}
        />
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
        <TableSelection />
      </Grid>
    );
  }
}

export default RequestsTable;
