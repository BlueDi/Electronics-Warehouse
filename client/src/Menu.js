import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Accordion, Grid, Icon, Menu } from "semantic-ui-react";

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

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

    return (
      <Grid key={2}>
        <Grid.Column width={3}>
          <Accordion as={Menu} fluid vertical>
            <Menu.Item>
              <Accordion.Title
                active={activeIndex === 3}
                index={3}
                onClick={this.handleClick}
              >
                Inventory
                <Icon name="dropdown" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 3}>
                Search
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

        <Grid.Column width={10}>{this.props.content}</Grid.Column>
      </Grid>
    );
  }
}

export default HWMenu;
