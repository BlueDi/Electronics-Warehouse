import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Dimmer,
  Grid,
  Icon,
  Image,
  Loader,
  Menu,
  Table
} from 'semantic-ui-react';
import { service } from '@utils';
import { PageTitle } from '@common/components';

const urlForData = id => `/table/${id}`;

class DescriptionParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content
    };
  }

  mount_content() {
    var organized_content = [];
    for (var param in this.state.content) {
      organized_content.push(
        <Grid.Row key={param}>
          {param + ': ' + this.state.content[param]}
        </Grid.Row>
      );
    }
    return organized_content;
  }

  render() {
    return (
      <Grid celled="internally" textAlign="center">
        {this.mount_content()}
      </Grid>
    );
  }
}

class GeneralParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      parameter: this.props.parameter,
      value: this.props.value
    };
  }

  isImage() {}

  render() {
    var value = this.state.value;
    var param = this.state.parameter;

    return (
      <Table.Cell key={param}>
        {value === null ? (
          '-'
        ) : typeof value === 'object' ? (
          <DescriptionParam content={value} />
        ) : (
          <Link to={`/item/${this.state.id}`} style={{ color: 'black' }}>
            {this.state.parameter.match(/image/gi) ? (
              <Image src={this.state.value} size="small" />
            ) : (
              this.state.value
            )}
          </Link>
        )}
      </Table.Cell>
    );
  }
}

class TableExample extends Component {
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
      <Dimmer active inverted>
        <Loader indeterminate inverted>
          Preparing Table
        </Loader>
      </Dimmer>
    ) : (
      <PageTitle title="Table">
        <Table key={'content'} celled selectable sortable striped>
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

export default TableExample;
