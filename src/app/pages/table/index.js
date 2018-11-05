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

const urlForData = id => `/table/${id}`;

class WHTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      isFetching: true
    };
  }

  componentDidMount() {
    service
      .get(urlForData(this.state.id))
      .then(response => {
        this.setState({
          components: response.data,
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
        <ComponentsTable components={this.state.components} />
      </PageTitle>
    );
  }
}

export default WHTable;
