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
import SelectComponent from './SelectComponent';
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

/**
 * Row of ComponentsTable
 */
class TableRow extends Component {
  handleClick(history, id) {
    var pathName = history.location.pathname.split('/')[1];
    var redirect = pathName === 'requests' ? 'request' : 'item';
    return history.push('/' + redirect + '/' + id);
  }

  render() {
    return (
      <Route
        render={({ history }) => (
          <Table.Row
            {...this.props}
            onClick={e => {
              if (
                !['button', 'i', 'input', 'label'].includes(
                  e.target.tagName.toLowerCase()
                )
              ) {
                return this.handleClick(history, this.props.tableRow.row.id);
              }
            }}
          />
        )}
      />
    );
  }
}

/**
 * Creates a table to display our items.
 *
 * @param components Array of components to be displayed
 * @param withDetails Boolean if the table should display the item page
 * @param withImages Boolean, if true then components should have a param 'image'
 * @param withSelection Boolean, if the user can select the items in the table
 */
class ComponentsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      columnsOrder: this.props.columnsOrder,
      tableColumnExtensions: [],
      detailsColumns: ['details', 'properties'],
      imageColumns: ['image'],
      rows: this.props.components,
      selection: [],
      withDetails: this.props.withDetails,
      withImages: this.props.withImages,
      withSelection: this.props.withSelection
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
      columnsOrder,
      tableColumnExtensions,
      detailsColumns,
      imageColumns,
      selection,
      withDetails,
      withImages,
      withSelection
    } = this.state;

    let compare_items;
    let addToCart;
    if (withSelection && selection.length > 0) {
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
        {withDetails && <DetailsTypeProvider for={detailsColumns} />}
        {withImages && <ImageTypeProvider for={imageColumns} />}
        {withDetails && <RowDetailState />}
        {withSelection && (
          <SelectionState
            selection={selection}
            onSelectionChange={this.changeSelection}
          />
        )}
        <PagingState defaultCurrentPage={0} pageSize={7} />
        <IntegratedPaging />
        <Table
          rowComponent={TableRow}
          columnExtensions={tableColumnExtensions}
        />
        <TableColumnReordering defaultOrder={columnsOrder} />
        <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
        {withDetails && (
          <TableRowDetail contentComponent={RowDetail} toggleColumnWidth={50} />
        )}
        <TableColumnVisibility defaultHiddenColumnNames={[]} />
        <Toolbar />
        <SearchPanel />
        <ColumnChooser />
        <PagingPanel />
        {withSelection && (
          <TableSelection
            cellComponent={SelectComponent}
            selectionColumnWidth={85}
          />
        )}
        {withSelection && compare_items}
        {addToCart}
      </Grid>
    );
  }
}

export default ComponentsTable;
