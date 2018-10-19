import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Menu, Table, Button, Search } from 'semantic-ui-react';
import _ from 'lodash';
import { service } from '@utils';
import { Loader, PageTitle } from '@common/components';
import GeneralParam from './GeneralParam';

const urlForData = id => `/table/${id}`;

const source = _.times(5, () => ({
  title: 'Facebook',
  description: 'Stealling your info since 1995'
}));

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: '' });

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch)
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;
    console.log(this.state.components);

    return (
      <Grid>
        <Grid.Column width={6}>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true
            })}
            results={results}
            value={value}
            {...this.props}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

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
          pages: 50,
          isFetching: false
        });
        this.mount_table();
      })
      .catch(e => {
        this.setState({
          isFetching: false
        });
        throw e;
      });
  }

  mount_header() {
    var header_params = [];
    for (var param in this.state.components[0]) {
      if (param !== 'id')
        header_params.push(
          <Table.HeaderCell key={param}>{param}</Table.HeaderCell>
        );
    }
    return (
      <Table.Header>
        <Table.Row>{header_params}</Table.Row>
      </Table.Header>
    );
  }

  mount_rows() {
    var table_rows = [];
    this.state.components.forEach((comp, cindex) => {
      var row_cells = [];
      for (var param in comp) {
        if (param !== 'id')
          row_cells.push(
            <GeneralParam
              key={param}
              id={comp['id']}
              value={comp[param]}
              parameter={param}
            />
          );
      }
      table_rows.push(<Table.Row key={cindex}>{row_cells}</Table.Row>);
    });
    return table_rows;
  }

  mount_table() {
    var table_header = this.mount_header();
    var table_rows = this.mount_rows();

    this.setState({
      table_header: table_header,
      table_rows: table_rows
    });
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

  render() {
    return this.state.isFetching ? (
      <Loader text="Preparing Table" />
    ) : (
      <PageTitle title="Table">
        <div style={{ marginTop: '0.5em' }}>
          <div style={{ float: 'right' }}>
            <SearchBar />
          </div>

          <div style={{ float: 'left' }}>
            <Link to="/addNewItem">
              <div>
                <Button
                  icon
                  labelPosition="left"
                  style={{ backgroundColor: '#87DC8E' }}
                >
                  <Icon name="plus" />
                  Add an item
                </Button>
              </div>
            </Link>
          </div>
        </div>
        <Table
          key={'content'}
          celled
          selectable
          sortable
          striped
          style={{ marginTop: '5em' }}
        >
          {this.state.table_header}
          <Table.Body>{this.state.table_rows}</Table.Body>
        </Table>
        <Menu key={'menu'} compact pagination style={{ float: 'right' }}>
          <Menu.Item as={Link} to={'/table/' + (this.state.id - 1)} icon>
            <Icon name="chevron left" />
          </Menu.Item>
          {this.mount_pagination()}
          <Menu.Item as={Link} to={'/table/' + (this.state.id + 1)} icon>
            <Icon name="chevron right" />
          </Menu.Item>
        </Menu>
      </PageTitle>
    );
  }
}

export default WHTable;
