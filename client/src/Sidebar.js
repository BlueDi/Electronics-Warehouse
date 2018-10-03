import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Sidebar } from "semantic-ui-react";

class WHSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  handleButtonClick = () => this.setState({ visible: !this.state.visible });

  handleSidebarHide = () => this.setState({ visible: false });

  render() {
    return (
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={this.props.visible}
          width="thin"
        >
          <Menu.Item as={Link} to="/inventory">
            Inventory
          </Menu.Item>
          <Menu.Item as={Link} to="/suppliers">
            Buy Supplies
          </Menu.Item>
          <Menu.Item as={Link} to="/users">
            Manage Users
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher>{this.props.content}</Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default WHSidebar;
