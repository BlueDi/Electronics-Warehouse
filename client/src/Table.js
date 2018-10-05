import React, { Component } from "react";
import { Dimmer, Icon, Loader, Menu, Table } from "semantic-ui-react";

const urlForData = id => `/api/table/${id}`;

class TableExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    fetch(urlForData(this.props.match.params.id))
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

  render() {
    return this.state.isFetching ? (
      <Dimmer active>
        <Loader indeterminate inverted>
          Preparing Files
        </Loader>
      </Dimmer>
    ) : (
      <Table celled>
        {this.state.table_header}
        <Table.Body>{this.state.table_rows}</Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="3">
              <Menu floated="right" pagination>
                <Menu.Item as="a" icon>
                  <Icon name="chevron left" />
                </Menu.Item>
                <Menu.Item as="a">1</Menu.Item>
                <Menu.Item as="a">2</Menu.Item>
                <Menu.Item as="a">3</Menu.Item>
                <Menu.Item as="a">4</Menu.Item>
                <Menu.Item as="a" icon>
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

export default TableExample;
