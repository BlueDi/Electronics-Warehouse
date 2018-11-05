import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import {
  PagingState,
  IntegratedPaging,
  SearchState,
  IntegratedFiltering,
  SortingState,
  IntegratedSorting,
  DataTypeProvider
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
import { Button, Icon, Image } from 'semantic-ui-react';

const SortingIcon = ({ direction }) =>
  direction === 'asc' ? <Icon name="arrow up" /> : <Icon name="arrow down" />;

const SortLabel = ({ onSort, children, direction }) => {
  return children.props.children !== 'image' &&
    children.props.children !== 'details' ? (
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
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'location', title: 'Location' },
        { name: 'reference', title: 'Reference' }
      ],
      tableColumnExtensions: [{ columnName: 'name', wordWrapEnabled: true }],
      detailsColumns: ['details'],
      imageColumns: ['image'],
      rows: this.props.components
    };
  }

  componentDidMount() {
    this.mount_header();
  }

  mount_header() {
    var header_params = [];
    for (var param in this.state.rows[0]) {
      if (param !== 'id') header_params.push({ name: param, title: param });
    }

    this.setState({
      columns: header_params
    });
  }

  render() {
    const {
      rows,
      columns,
      tableColumnExtensions,
      detailsColumns,
      imageColumns
    } = this.state;
    return (
      <Grid rows={rows} columns={columns}>
        <PagingState defaultCurrentPage={0} pageSize={2} />
        <IntegratedPaging />
        <DragDropProvider />
        <SearchState />
        <IntegratedFiltering />
        <SortingState
          defaultSorting={[{ columnName: 'name', direction: 'asc' }]}
        />
        <IntegratedSorting />
        <DetailsTypeProvider for={detailsColumns} />
        <ImageTypeProvider for={imageColumns} />
        <Table
          rowComponent={TableRow}
          columnExtensions={tableColumnExtensions}
        />
        <TableColumnReordering
          defaultOrder={[
            'name',
            'image',
            'location',
            'reference',
            'count',
            'details'
          ]}
        />
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

export default ComponentsTable;
