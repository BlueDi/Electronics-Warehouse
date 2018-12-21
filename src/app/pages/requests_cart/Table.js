import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import {
  PagingState,
  IntegratedPaging,
  FilteringState,
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
  TableFilterRow,
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
   * Constructs the Requests Table
   * @param {Object} props                          The properties of the table
   * @param {Object} props.items                    Items to show
   * @param {Object} props.columns                  Columns to be shown
   * @param {Boolean} props.withDelete              Whether to allow deletion of rows
   * @param {Boolean} props.withEdit                Whether to allow edition of rows
   * @param {Object} props.tableColumnExtensions    Extensions to the columns to be shown
   * @param {Object} props.editingColumnExtensions  Extensions to the editing columns
   * @param {Object} props.onCommitChanges           Callback after confirmation of row edit
   */
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      columns: this.props.columns,
      withDelete: this.props.withDelete,
      withEdit: this.props.withEdit,
      onCommitChanges: this.props.onCommitChanges,
      detailsColumns: ['details', 'properties'],
      rowChanges: {},
      editingRowIds: [],
      editingColumnExtensions: this.props.editingColumnExtensions,
      tableColumnExtensions: this.props.tableColumnExtensions
    };
    this.changeEditingRowIds = editingRowIds =>
      this.setState({ editingRowIds });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
  }

  tableEditColumn(w_delete, w_edit) {
    if (w_delete && w_edit) {
      return (
        <TableEditColumn
          showDeleteCommand
          showEditCommand
          commandComponent={Command}
        />
      );
    } else if (w_delete && !w_edit) {
      return <TableEditColumn showDeleteCommand commandComponent={Command} />;
    } else if (!w_delete && w_edit) {
      console.log('Returning this');
      return <TableEditColumn showEditCommand commandComponent={Command} />;
    }
    return undefined;
  }

  /**
   * Callback that is called after an edit button is clicked
   * @param  {Object} changed On component change this is not undefined and contains information about it
   * @param  {Object} deleted On components delete this is not undefined and contains information about it
   */
  commitChanges({ changed, deleted }) {
    let cart;
    if (deleted) {
      const deletedSet = new Set(deleted);
      cart = this.state.cart.filter(item => !deletedSet.has(item.id));
      this.setState({ cart });
    }
    if (changed) {
      var delete_rows = [];

      cart = this.state.cart.map(item => {
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
        cart = this.state.cart.filter(item => !delete_rows.includes(item.id));
      }
      this.setState({ cart });
    }
    return undefined;
  }

  /**
   * Render the component
   * @return {Object} Requests List Table
   */
  render() {
    return (
      <Grid
        rows={this.state.items}
        columns={this.state.columns}
        getRowId={row => row.id}
      >
        <FilteringState />
        <IntegratedFiltering />
        <EditingState
          columnExtensions={this.state.editingColumnExtensions}
          columnEditingEnabled={false}
          editingRowIds={this.state.editingRowIds}
          onEditingRowIdsChange={this.changeEditingRowIds}
          rowChanges={this.state.rowChanges}
          onRowChangesChange={this.changeRowChanges}
          onCommitChanges={this.state.onCommitChanges}
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
        <TableFilterRow />
        <TableEditRow cellComponent={EditCell} />
        {this.tableEditColumn(this.state.withDelete, this.state.withEdit)}
        <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
        <TableRowDetail contentComponent={RowDetail} />
      </Grid>
    );
  }
}

export default withCookies(RequestsTable);
