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
  TableEditColumn
} from '@devexpress/dx-react-grid-material-ui';
import { Button, Icon } from 'semantic-ui-react';
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

class RequestsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.props.columns,
      cart: this.props.cart,
      tableColumnExtensions: [],
      detailsColumns: ['details', 'properties']
    };
    this.commitChanges = this.commitChanges.bind(this);
  }

  commitChanges(status) {
    const { deleted } = status;
    console.log(deleted);
    let { cart } = this.state;
    if (deleted) {
      const deletedSet = new Set(deleted);
      cart = cart.filter(item => !deletedSet.has(item.id));
      let { cookies } = this.props;
      cookies.set('cart', cart);
    }
    this.setState({ cart });
  }

  render() {
    const getRowId = row => row.id;
    const { cart, columns, tableColumnExtensions, detailsColumns } = this.state;

    return (
      <Grid rows={cart} columns={columns} getRowId={getRowId}>
        <EditingState onCommitChanges={this.commitChanges} />
        <Table
          rowComponent={TableRow}
          columnExtensions={tableColumnExtensions}
        />
        <TableEditColumn showDeleteCommand />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: 'description', direction: 'asc' }]}
        />
        <IntegratedSorting />
        <DetailsTypeProvider for={detailsColumns} />
        <RowDetailState />
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <IntegratedPaging />
        <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
        <TableRowDetail contentComponent={RowDetail} toggleColumnWidth={50} />
      </Grid>
    );
  }
}

export default withCookies(RequestsTable);
