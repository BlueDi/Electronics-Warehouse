import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import {
  PagingState,
  IntegratedPaging,
  IntegratedFiltering,
  SortingState,
  EditingState,
  IntegratedSorting,
  RowDetailState,
  DataTypeProvider
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableRowDetail,
  TableEditRow,
  TableEditColumn
} from '@devexpress/dx-react-grid-material-ui';
import { Button, Icon } from 'semantic-ui-react';
import IconButton from '@material-ui/core/IconButton';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

import InDepthItem from '@pages/inDepthItem';

/**
 * Icon representing the sort state
 * @param {String} direction Either 'asc' -> Ascending or 'desc' -> Descending
 */
const SortingIcon = ({ direction }) =>
  direction === 'asc' ? <Icon name="arrow up" /> : <Icon name="arrow down" />;

/**
 * Renders the label of the column
 * @param {Object} onSort    Callback when the sorting state is activated
 * @param {Object} children  Children components of the label
 * @param {String} direction Direction of the request
 */
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

/**
 * Formatter of the details column, handles
 * @param {Object} value Object with the various details
 */
const DetailsFormatter = ({ value }) => {
  var details_list = [];
  for (const param in value) {
    if (value.hasOwnProperty(param)) {
      details_list.push(<p key={param}>{param + ': ' + value[param]}</p>);
    }
  }
  return details_list;
};

/**
 * Provider to render the details column cells
 * @param {Object} props Properties of the component
 */
const DetailsTypeProvider = props => (
  <DataTypeProvider formatterComponent={DetailsFormatter} {...props} />
);

/**
 * Detail rows
 * @param {Object} row Information of the row
 */
const RowDetail = ({ row }) => <InDepthItem id={row.id} />;

/**
 * Generic row of the table
 * @extends Component
 */
class TableRow extends Component {
  /**
   * Renders the component
   * @return {Object} A Row of the table
   */
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
                return history.push('/item/' + this.props.tableRow.row.id);
              }
            }}
          />
        )}
      />
    );
  }
}

/**
 * Delete button of the table
 * @param {Object} onExecute Callback to run onClick
 */
const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete Request">
    <DeleteIcon />
  </IconButton>
);

/**
 * Edit button of the table
 * @param {Object} onExecute Callback to run onClick
 */
const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit Request">
    <EditIcon />
  </IconButton>
);

/**
 * Commit button of the table
 * @param {Object} onExecute Callback to run onClick
 */
const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

/**
 * Cancel button of the table
 * @param {Object} onExecute Callback to run onClick
 */
const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

/**
 * Various command components
 * @type {Object}
 */
const commandComponents = {
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton
};

/**
 * Generic command component
 * @param {Number} id        The ID of the component to render
 * @param {Object} onExecute Callback to be called onClick
 */
const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} />;
};

/**
 * Generic cell of the table
 * @param {Object} props Properties of the parent object
 */
const Cell = props => {
  return <Table.Cell {...props} />;
};

/**
 * Edit cell of the table
 * @param {Object} props Properties of the parent object
 */
const EditCell = props => {
  return <TableEditRow.Cell {...props} />;
};

/**
 * The actual table of the components
 * @extends Component
 */
class RequestsTable extends Component {
  /**
   * Constructs the component
   * @param {Object} props Properties of the components
   */
  constructor(props) {
    super(props);
    const load = 'Loading...';
    this.state = {
      columns: [
        { name: 'description', title: 'Description' },
        { name: 'amount', title: 'Amount' },
        { name: 'details', title: 'Details' },
        { name: 'location', title: 'Location' }
      ],
      tableColumnExtensions: [
        { columnName: 'description', width: 200, align: 'center' },
        { columnName: 'amount', width: 120, align: 'center' },
        { columnName: 'location', width: 160, align: 'center' }
      ],
      cart: this.props.cart || [
        {
          description: load,
          amount: load,
          details: load,
          location: load,
          properties: load
        }
      ],
      detailsColumns: ['details', 'properties'],
      rowChanges: {},
      editingRowIds: []
    };
    this.commitChanges = this.commitChanges.bind(this);
    this.changeEditingRowIds = editingRowIds =>
      this.setState({ editingRowIds });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
  }

  /**
   * Callback that is called after an edit button is clicked
   * @param  {Object} changed On component change this is not undefined and contains information about it
   * @param  {Object} deleted On components delete this is not undefined and contains information about it
   */
  commitChanges({ changed, deleted }) {
    let { cart } = this.state;
    if (deleted) {
      const deletedSet = new Set(deleted);
      cart = cart.filter(item => !deletedSet.has(item.id));
    }
    if (changed) {
      var delete_rows = [];

      cart = cart.map(item => {
        if (changed[item.id]) {
          if (changed[item.id].amount > 0) {
            return { ...item, ...changed[item.id] };
          } else if (changed[item.id].amount == 0) {
            delete_rows.push(item.id);
          }
        }
        return item;
      });
      if (delete_rows.length > 0) {
        cart = cart.filter(item => !delete_rows.includes(item.id));
      }
    }
    this.props.cookies.set('cart', cart);
    this.setState({ cart });
  }

  /**
   * Render the component
   * @return {Object} Requests List Table
   */
  render() {
    return (
      <Grid
        rows={this.props.cart || this.state.cart}
        columns={this.state.columns}
        getRowId={row => row.id}
      >
        <EditingState
          columnExtensions={[{ columnName: 'amount', editingEnabled: true }]}
          columnEditingEnabled={false}
          editingRowIds={this.state.editingRowIds}
          onEditingRowIdsChange={this.changeEditingRowIds}
          rowChanges={this.state.rowChanges}
          onRowChangesChange={this.changeRowChanges}
          onCommitChanges={this.commitChanges}
        />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: 'description', direction: 'asc' }]}
        />
        <IntegratedSorting />
        <DetailsTypeProvider for={this.state.detailsColumns} />
        <RowDetailState />
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <IntegratedPaging />
        <Table
          columnExtensions={this.state.tableColumnExtensions}
          rowComponent={TableRow}
          cellComponent={Cell}
        />
        <TableEditRow cellComponent={EditCell} />
        <TableEditColumn
          showDeleteCommand
          showEditCommand
          commandComponent={Command}
        />
        <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
        <TableRowDetail contentComponent={RowDetail} />
      </Grid>
    );
  }
}

export default withCookies(RequestsTable);
