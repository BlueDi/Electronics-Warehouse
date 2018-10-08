import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Sidebar } from "semantic-ui-react";

class WHSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };
  }

  handleButtonClick = () => this.setState({ visible: this.state.visible });

  handleSidebarHide = () => this.setState({ visible: false });

  render() {
    return (
      <Sidebar.Pushable>
        <Sidebar
          className="SideBar"
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={this.props.visible}
          width="large"
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

        <Sidebar.Pusher>
          <div
            style={{
              height: "400em",
              display: "flex",
              flexFlow: "column nowrap"
            }}
          >
            {this.props.content}
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default WHSidebar;
