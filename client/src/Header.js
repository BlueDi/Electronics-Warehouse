import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

class WHHeader extends Component {
  state = {};

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu attached borderless>
        <Menu.Item
          as={Link}
          to="/"
          name="home"
          active={activeItem === "home"}
          onClick={this.handleItemClick}
          style={{
            fontSize: "16pt"
          }}
        >
          Warehouse
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            name="signup"
            active={activeItem === "signup"}
            onClick={this.handleItemClick}
            style={{
              fontSize: "11pt",
              textDecoration: "underline",
              borderRight: "1px solid grey"
            }}
          >
            Sign Up
          </Menu.Item>

          <Menu.Item
            name="signin"
            active={activeItem === "signin"}
            onClick={this.handleItemClick}
            style={{
              fontSize: "11pt",
              textDecoration: "underline"
            }}
          >
            Sign In
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default WHHeader;
