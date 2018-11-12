import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { service } from '@utils';
import {
  AddItemButton,
  Loader,
  PageTitle,
  SearchBar
} from '@common/components';
import ComponentsTable from './Table';

const urlAllItems = `/all_items`;
const urlCategories = `/all_categories`;
const urlItemCategory = id => `/item_category/${id}`;
const urlItemProperties = id => `/item_properties2/${id}`;

class WHTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      isFetching: true
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
        this.setState({
          isFetching: false
        });
        throw e;
      });
  }

  getItemsAdditionalInfo(components) {
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
            isFinishedProperties: true
          },
          this.checkFinishedGets()
        );
      })
      .catch(e => {
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
            isFinishedCategory: true
          },
          this.checkFinishedGets()
        );
      })
      .catch(e => {
        throw e;
      });
  }

  checkFinishedGets() {
    if (this.state.isFinishedCategory && this.state.isFinishedProperties)
      this.setState({ isFetching: false });
  }

  default_column_order() {
    var columnOrder = [];
    for (var i in this.state.components) {
      for (var param in this.state.components[i]) {
        if (columnOrder.indexOf(param) === -1) columnOrder.push(param);
      }
    }
    return columnOrder;
  }

  renderUserFunctions() {
    return (
      <Grid>
        <Grid.Column floated="left" width={5}>
          <AddItemButton />
        </Grid.Column>
        <Grid.Column floated="right" width={5}>
          <SearchBar />
        </Grid.Column>
      </Grid>
    );
  }
  render() {
    return this.state.isFetching ? (
      <Loader text="Preparing Table" />
    ) : (
      <PageTitle title="Table">
        {this.renderUserFunctions()}
        <ComponentsTable
          components={this.state.components}
          columnsOrder={this.default_column_order()}
        />
      </PageTitle>
    );
  }
}

export default WHTable;
