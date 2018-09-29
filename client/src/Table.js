import React, { Component } from "react";
import { Icon, Label, Menu, Table } from "semantic-ui-react";

class TableExample extends Component {
  constructor(props) {
    super(props);
    this.list = [
      {
        id: 0,
        title: "Project1",
        description: "hueee",
        location: "ali",
        earned: "",
        target: "",
        end_date: ""
      },
      {
        id: 1,
        title: "Project2",
        description: "",
        location: "",
        earned: "",
        target: "",
        end_date: ""
      }
    ];
    this.state = {};
    this.table_body = {};
  }

  table_cell = i => [
    <Table.Cell key={i}>
      <Label ribbon>{i}</Label>
    </Table.Cell>
  ];

  render() {
    var table_header = (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>
            Example {this.props.match.params.id}
          </Table.HeaderCell>
          <Table.HeaderCell>{this.props.match.params.id}</Table.HeaderCell>
          <Table.HeaderCell>
            Header {this.props.match.params.id}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
    var table_row = (
      <Table.Row>
        {this.table_cell(1)}
        {this.table_cell(2)}
        {this.table_cell(3)}
      </Table.Row>
    );

    return (
      <div>
        <Table celled>
          {table_header}
          <Table.Body>
            {table_row}
            {table_row}
            {table_row}
          </Table.Body>

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
      </div>
    );
  }
}

export default TableExample;
