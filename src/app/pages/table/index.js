import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Menu } from 'semantic-ui-react';
import { service } from '@utils';
import {
  AddItemButton,
  Loader,
  PageTitle,
  SearchBar
} from '@common/components';
import ComponentsTable from './Table';

const urlForData = id => `/table/${id}`;

class WHTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: null,
      direction: null,
      id: this.props.match.params.id,
      isFetching: true
    };

    this.updateComponents = this.updateComponents.bind(this);
  }

  componentDidMount() {
    service
      .get(urlForData(this.state.id))
      .then(response => {
        this.setState({
          components: response.data,
          pages: 50,
          isFetching: false
        });
      })
      .catch(e => {
        this.setState({
          isFetching: false
        });
        throw e;
      });
  }

  updateComponents(data) {
    this.setState({
      components: data,
      isFetching: false
    });
    this.componentsTable.mount_table(data);
  }

  mount_pagination() {
    var pagination = [];
    for (var i = 1; i <= this.state.pages && i <= 8; i++) {
      pagination.push(
        <Menu.Item key={i} as={Link} to={'/table/' + i}>
          {i}
        </Menu.Item>
      );
    }
    return pagination;
  }

  renderUserFunctions() {
    return (
      <Grid>
        <Grid.Column floated="left" width={5}>
          <AddItemButton />
        </Grid.Column>
        <Grid.Column floated="right" width={11}>
          <SearchBar
            id={this.state.id}
            updateComponents={this.updateComponents}
          />
        </Grid.Column>
      </Grid>
    );
  }
  renderPagination() {
    return (
      <Menu key={'menu'} compact pagination style={{ float: 'right' }}>
        <Menu.Item as={Link} to={'/table/' + (this.state.id - 1)} icon>
          <Icon name="chevron left" />
        </Menu.Item>
        {this.mount_pagination()}
        <Menu.Item as={Link} to={'/table/' + (this.state.id + 1)} icon>
          <Icon name="chevron right" />
        </Menu.Item>
      </Menu>
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
          onRef={ref => (this.componentsTable = ref)}
        />
        {this.renderPagination()}
      </PageTitle>
    );
  }
}

export default WHTable;
