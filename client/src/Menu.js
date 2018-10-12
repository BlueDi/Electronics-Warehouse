import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Accordion, Grid, Icon, Select } from "semantic-ui-react";

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
        <Grid.Column width={3} style={{ backgroundColor: "#D2E0E8", paddingTop: "0px" }}>
          <Accordion id="sidebarC" fluid vertical style={{ fontSize: "15pt", fontWeight: "300", textAlign: "center", paddingTop: "none" }} >
            <Accordion.Title
              class="a"
              id="sidebarInventory"
              active={activeIndex === 3}
              index={3}
              onClick={this.handleClick}
              style={{ borderBottom: "1px solid grey", paddingTop: "1em", paddingBottom: "1em" }}
            >
              <Link to="/table/1" style={{ color: "black", textDecoration: "none" }}>
                Inventory
                </Link>
              <Icon name="dropdown" />
            </Accordion.Title>
            <Accordion.Content
              id="sidebarSearch"
              active={activeIndex === 3}
              style={{ fontSize: "12.5pt", textAlign: "center" }}
            >
              <div class="ui category search">
                <div class="ui icon input">
                  <input class="prompt" placeholder="Search filters..." type="text" style={{ width: "10%" }} />
                </div>
              </div>
            </Accordion.Content>

            <Accordion.Title class="a" style={{ borderBottom: "1px solid grey", paddingTop: "1em", paddingBottom: "1em" }}>
              Buy Supplies
            </Accordion.Title>

            <Accordion.Title style={{ borderBottom: "1px solid grey", paddingTop: "1em", paddingBottom: "1em" }}>
              Manage Users
            </Accordion.Title>
          </Accordion>
        </Grid.Column>

        <Grid.Column width={13}>
          {this.props.content}
        </Grid.Column>
      </Grid>
    );
  }
}

export default HWMenu;
