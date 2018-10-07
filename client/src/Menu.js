import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import ErrorBoundary from "./ErrorBoundary.js";
import { Grid, Menu, Segment, Sidebar } from "semantic-ui-react";

class HWMenu extends Component {
  render() {
    return (
      <Grid key={2}>
        <Grid.Column width={3}>
          <Menu borderless fluid vertical tabular>
            <Menu.Item as={Link} to="/inventory">
              Inventory
            </Menu.Item>
            <Menu.Item as={Link} to="/suppliers">
              Buy Supplies
            </Menu.Item>
            <Menu.Item as={Link} to="/users">
              Manage Users
            </Menu.Item>
          </Menu>
        </Grid.Column>

        <Grid.Column width={10}>{this.props.content}</Grid.Column>
      </Grid>
    );
  }
}

export default HWMenu;
