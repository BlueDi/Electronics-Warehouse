import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Dimmer, Icon, Loader, Menu, Table } from "semantic-ui-react";

const urlForData = id => `/api/table/${id}`;

class TableExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      isFetching: true,
      components: [
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
      ]
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

  mount_table() {
    var header_params = [];
    for (var param in this.state.components[0]) {
      header_params.push(
        <Table.HeaderCell key={param}>{param}</Table.HeaderCell>
      );
    }
    var table_header = (
      <Table.Header>
        <Table.Row>{header_params}</Table.Row>
      </Table.Header>
    );

    var table_rows = [];
    this.state.components.forEach((comp, cindex) => {
      var row_params = [
        comp.number,
        comp.code,
        //comp.description,
        comp.availability,
        comp.price
      ];
      var all_rows = [];
      row_params.forEach((param, pindex) => {
        all_rows.push(<Table.Cell key={pindex}>{param}</Table.Cell>);
      });
      table_rows.push(<Table.Row key={cindex}>{all_rows}</Table.Row>);
    });

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
      <Dimmer active>
        <Loader indeterminate inverted>
          Preparing Files
        </Loader>
      </Dimmer>
    ) : (
        [
          <Table key={"content"} celled>
            {this.state.table_header}
            <Table.Body>{this.state.table_rows}</Table.Body>
          </Table>,
          <Menu key={"pagination"} pagination
            style={{
              textAlign: "center",
              height: "5%",
              width: "40%",
            }
            }>
            <Menu.Item as={Link} to={"/table/" + (this.state.id - 1)} icon>
              <Icon name="chevron left" />
            </Menu.Item>
            {this.mount_pagination()}
            <Menu.Item as={Link} to={"/table/" + (this.state.id + 1)} icon>
              <Icon name="chevron right" />
            </Menu.Item>
          </Menu >
        ]
      );
  }
}

export default TableExample;
