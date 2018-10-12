import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dimmer, Grid, Icon, Loader, Menu, Table, Divider } from "semantic-ui-react";

const urlForData = id => `/api/table/${id}`;

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
          {param + ": " + this.state.content[param]}
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

class TableExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //id: this.props.match.params.id,
      isFetching: true,
      /*components: [
        {
          code: 0,
          number: "Project1",
          description: "hueee",
          location: "ali",
          availability: 1,
          price: 21.29
        },
        {
          id: 1,
          number: "Project2",
          description: "",
          location: "",
          availability: 0,
          price: 0
        }
      ]*/
    };
  }

  componentDidMount() {
    fetch(urlForData(this.state.id))
      .then(response => {
        if (!response.ok) {
          throw Error("Network request failed");
        }
        return response;
      })
      .then(result => result.json())
      .then(
        result => {
          this.setState({
            components: result,
            pages: 50,
            isFetching: false
          });
          this.mount_table();
        },
        e => {
          this.setState({
            isFetching: false
          });
          throw e;
        }
      );
  }

  mount_header() {
    var header_params = [];
    for (var param in this.state.components[0]) {
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
        console.log(param);
        if (param !== "id")
          row_cells.push(
            <Table.Cell key={param}>
              {comp[param] === null ? (
                "-"
              ) : typeof comp[param] === "object" ? (
                <DescriptionParam content={comp[param]} />
              ) : (
                    <Link to={`/item/${comp[param].id}`} style={{ color: "black" }}>
                      {comp[param]}
                    </Link>
                  )}
            </Table.Cell>
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
        <Menu.Item key={i} as={Link} to={"/table/" + i}>
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
        [
          <Table key={"content"} celled selectable>
            {this.state.table_header}
            <Table.Body>{this.state.table_rows}</Table.Body>
          </Table>,
          <Menu key={"menu"} compact pagination style={{ float: "right" }}>
            <Menu.Item as={Link} to={"/table/" + (this.state.id - 1)} icon>
              <Icon name="chevron left" />
            </Menu.Item>
            {this.mount_pagination()}
            <Menu.Item as={Link} to={"/table/" + (this.state.id + 1)} icon>
              <Icon name="chevron right" />
            </Menu.Item>
          </Menu>
        ]
      );
  }
}

export default TableExample;
