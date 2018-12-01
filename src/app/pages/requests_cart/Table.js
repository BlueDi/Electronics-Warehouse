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

const RowDetail = ({ row }) => <InDepthItem id={row.id} />;

class TableRow extends Component {
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

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete Request">
    <DeleteIcon />
  </IconButton>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit Request">
    <EditIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return <CommandButton onExecute={onExecute} />;
};

const Cell = props => {
  return <Table.Cell {...props} />;
};

const EditCell = props => {
  return <TableEditRow.Cell {...props} />;
};

class RequestsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'description', title: 'Description' },
        { name: 'amount', title: 'Amount' },
        { name: 'details', title: 'Details' },
        { name: 'location', title: 'Location' }
      ],
      tableColumnExtensions: [
        { columnName: 'amount', width: 120, align: 'center' }
      ],
      cart: this.props.cart,
      detailsColumns: ['details', 'properties'],
      rowChanges: {},
      editingRowIds: []
    };
    this.commitChanges = this.commitChanges.bind(this);
    this.changeEditingRowIds = editingRowIds =>
      this.setState({ editingRowIds });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
  }

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
            return {...item, ...changed[item.id]};
          }
          else if (changed[item.id].amount == 0) {
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

  render() {
    const {
      cart,
      columns,
      editingRowIds,
      rowChanges,
      tableColumnExtensions,
      detailsColumns
    } = this.state;

    return (
      <Grid rows={cart} columns={columns} getRowId={row => row.id}>
        <EditingState
          columnExtensions={[{ columnName: 'amount', editingEnabled: true }]}
          columnEditingEnabled={false}
          editingRowIds={editingRowIds}
          onEditingRowIdsChange={this.changeEditingRowIds}
          rowChanges={rowChanges}
          onRowChangesChange={this.changeRowChanges}
          onCommitChanges={this.commitChanges}
        />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: 'description', direction: 'asc' }]}
        />
        <IntegratedSorting />
        <DetailsTypeProvider for={detailsColumns} />
        <RowDetailState />
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <IntegratedPaging />
        <Table
          columnExtensions={tableColumnExtensions}
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
        <TableRowDetail contentComponent={RowDetail} toggleColumnWidth={50} />
      </Grid>
    );
  }
}

export default withCookies(RequestsTable);
