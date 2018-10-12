import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Accordion, Grid, Icon, Menu, Search } from "semantic-ui-react";

class HWMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
    };
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    const inventory = document.getElementById("sidebarInventory");

    if (inventory.style.borderBottom === "1px solid grey")
      inventory.style.borderBottom = "none";
    else inventory.style.borderBottom = "1px solid grey";

    const search = document.getElementById("sidebarSearch");
    search.style.borderBottom = "1px solid grey";

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

    return (
      <Grid padded="horizontally">
        <Grid.Column width={3} color="teal">
          <Accordion as={Menu} vertical>
            <Menu.Item>
              <Accordion.Title
                id="sidebarInventory"
                active={activeIndex === 3}
                index={3}
                onClick={this.handleClick}
              >
                Inventory
                <Icon name="dropdown" />
              </Accordion.Title>
              <Accordion.Content id="sidebarSearch" active={activeIndex === 3}>
                <Search fluid input={{ fluid: true }} />
              </Accordion.Content>
            </Menu.Item>

            <Menu.Item as={Link} to="/suppliers">
              Buy Supplies
            </Menu.Item>

            <Menu.Item as={Link} to="/users">
              Manage Users
            </Menu.Item>
          </Accordion>
        </Grid.Column>

        <Grid.Column
          width={13}
          style={{
            backgroundColor: "#D2E0E8"
          }}
        >
          {this.props.content}
        </Grid.Column>
      </Grid>
    );
  }
}

export default HWMenu;
