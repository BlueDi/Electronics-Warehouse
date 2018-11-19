import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {
  PagingState,
  IntegratedPaging,
  SearchState,
  IntegratedFiltering,
  SortingState,
  IntegratedSorting,
  RowDetailState,
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
  TableRowDetail,
  SearchPanel,
  Toolbar,
  TableSelection
} from '@devexpress/dx-react-grid-material-ui';
import { Button, Icon, Image } from 'semantic-ui-react';
import CompareItems from './Compare';
import { AddToCart } from '@common/components';
import InDepthItem from '@pages/inDepthItem';

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
      details_list.push(<p key={param}>{param + ': ' + value[param]}</p>);
    }
  }
  return details_list;
};

const DetailsTypeProvider = props => (
  <DataTypeProvider formatterComponent={DetailsFormatter} {...props} />
);

const ImageFormatter = ({ row }) => (
  <Image
    src={`data:image/png;base64,${row.image}`}
    size="small"
    alt={row.description}
  />
);

const ImageTypeProvider = props => (
  <DataTypeProvider formatterComponent={ImageFormatter} {...props} />
);

const RowDetail = ({ row }) => <InDepthItem id={row.id} />;

class TableRow extends Component {
  render() {
    return (
      <Route
        render={({ history }) => (
          <Table.Row
            {...this.props}
            onClick={() => history.push('/item/' + this.props.tableRow.row.id)}
          />
        )}
      />
    );
  }
}

class ComponentsTable extends Component {
  constructor(props) {
    super(props);
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
    for (var i of selection) selected.push(rows[i]);
    return selected;
  }

  mount_header() {
    var header_params = [];
    for (var param in this.state.rows[0]) {
      if (param !== 'id') header_params.push({ name: param, title: param });
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

    let compare_items;
    let addToCart;
    if (selection.length > 0) {
      var selected_items = this.getItemsFromSelection();
      compare_items = <CompareItems items={selected_items} />;
      addToCart = <AddToCart items={selected_items} />;
    }

    return (
      <Grid rows={rows} columns={columns}>
        <DragDropProvider />
        <SearchState />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: 'description', direction: 'asc' }]}
        />
        <IntegratedSorting />
        <DetailsTypeProvider for={detailsColumns} />
        <ImageTypeProvider for={imageColumns} />
        <RowDetailState />
        <SelectionState
          selection={selection}
          onSelectionChange={this.changeSelection}
        />
        <PagingState defaultCurrentPage={0} pageSize={7} />
        <IntegratedPaging />
        <Table
          rowComponent={TableRow}
          columnExtensions={tableColumnExtensions}
        />
        <TableColumnReordering defaultOrder={this.props.columnsOrder} />
        <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
        <TableRowDetail contentComponent={RowDetail} />
        <TableColumnVisibility defaultHiddenColumnNames={[]} />
        <Toolbar />
        <SearchPanel />
        <ColumnChooser />
        <PagingPanel />
        <TableSelection />
        {compare_items}
        {addToCart}
      </Grid>
    );
  }
}

export default ComponentsTable;
