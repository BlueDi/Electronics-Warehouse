import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { service } from '@utils';
import { AddItemButton, Loader, PageTitle } from '@common/components';
import ComponentsTable from './Table';

const urlAllItems = `/all_items`;
const urlCategories = `/all_categories`;
const urlItemCategory = id => `/item_category/${id}`;
const urlItemProperties = id => `/item_properties2/${id}`;

class WHTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'description', title: 'Description' },
        { name: 'image', title: 'Image' },
        { name: 'total_stock', title: 'Total Stock' },
        { name: 'free_stock', title: 'Free Stock' },
        { name: 'last_price', title: 'Last Price' },
        { name: 'location', title: 'Location' },
        { name: 'user_comments', title: 'User Comments' },
        { name: 'details', title: 'Details' },
        { name: 'reference', title: 'Reference' },
        { name: 'packaging_id', title: 'Packaging ID' },
        { name: 'last_edit', title: 'Last Edit' },
        { name: 'properties', title: 'Properties' },
        { name: 'category', title: 'Category' }
      ],
      tableColumnExtensions: [
        { columnName: 'total_stock', align: 'center' },
        { columnName: 'free_stock', align: 'center' },
        { columnName: 'last_price', align: 'center' },
        { columnName: 'reference', align: 'center' },
        { columnName: 'user_comments', wordWrapEnabled: true },
        { columnName: 'last_edit', align: 'center' }
      ],
      id: this.props.match.params.id,
      fetchDone: 0,
      fetchFailed: 0,
      fetchEnd: 1
    };
  }

  componentDidMount() {
    this.getAllCategories();
    this.getData();
  }

  getAllCategories() {
    service
      .get(urlCategories)
      .then(response => {
        let category_list = response.data.map(category => ({
          key: category.id,
          text: category.name
        }));

        this.setState({
          category_list: category_list
        });
      })
      .catch(e => {
        this.setState({ fetchEnd: -1 });
        throw e;
      });
  }

  getData() {
    service
      .get(urlAllItems)
      .then(response => {
        this.setState({ components: response.data }, () =>
          this.getItemsAdditionalInfo(response.data)
        );
      })
      .catch(e => {
        this.setState({ fetchEnd: -1 });
        throw e;
      });
  }

  getItemsAdditionalInfo(components) {
    this.setState({ fetchEnd: components.length * 2 });
    for (var i in components) {
      const id = components[i].id - 1;
      this.getItemProperties(id);
      this.getItemCategory(id);
    }
  }

  getItemProperties(id) {
    service
      .get(urlItemProperties(id + 1))
      .then(response => {
        let property_list = response.data.reduce((list, property) => {
          var units = property.unit == null ? '' : ' ' + property.unit;
          list[property.name] = '' + property.value + units;
          return list;
        }, {});
        var oldComponent = this.state.components[id];
        let newComponent = { ...oldComponent, properties: property_list };
        var newComponents = this.state.components;
        newComponents[id] = newComponent;
        this.setState(
          {
            components: newComponents,
            isFinishedProperties: true,
            fetchDone: this.state.fetchDone + 1
          },
          this.checkFinishedGets()
        );
      })
      .catch(e => {
        this.setState({ fetchFailed: this.state.fetchFailed + 1 });
        throw e;
      });
  }

  getItemCategory(id) {
    service
      .get(urlItemCategory(id + 1))
      .then(response => {
        let category_name = response.data[0].name;
        var oldComponent = this.state.components[id];
        let newComponent = { ...oldComponent, category: category_name };
        var newComponents = this.state.components;
        newComponents[id] = newComponent;
        this.setState(
          {
            components: newComponents,
            isFinishedCategory: true,
            fetchDone: this.state.fetchDone + 1
          },
          this.checkFinishedGets()
        );
      })
      .catch(e => {
        this.setState({ fetchFailed: this.state.fetchFailed + 1 });
        throw e;
      });
  }

  checkFinishedGets() {
    if (this.state.isFinishedCategory && this.state.isFinishedProperties)
      this.setState({ isFetching: false });
  }

  default_column_order() {
    var columnOrder = [];
    this.state.components.forEach(component => {
      columnOrder = columnOrder.concat(Object.keys(component));
    });
    columnOrder = [...new Set(columnOrder)];
    return columnOrder;
  }

  renderUserFunctions() {
    return (
      <Grid>
        <Grid.Column floated="left" width={5}>
          <AddItemButton />
        </Grid.Column>
      </Grid>
    );
  }

  render() {
    const { fetchDone, fetchFailed, fetchEnd } = this.state;

    return fetchDone + fetchFailed < fetchEnd ? (
      <Loader text="Preparing Table" />
    ) : (
      <PageTitle title="Table">
        {this.renderUserFunctions()}
        <ComponentsTable
          tableColumnExtensions={this.state.tableColumnExtensions}
          columns={this.state.columns}
          components={this.state.components}
          columnsOrder={this.default_column_order()}
          withDetails
          withImages
          withSelection
        />
      </PageTitle>
    );
  }
}

export default WHTable;
