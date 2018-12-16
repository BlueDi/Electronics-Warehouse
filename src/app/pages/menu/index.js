import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Grid, Menu, Search } from 'semantic-ui-react';

class WHMenu extends Component {
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
      <Grid padded="horizontally">
        <Grid.Column width={3}>
          <Accordion as={Menu} secondary size="huge" vertical>
            <Menu.Item link>
              <Accordion.Title
                id="sidebarInventory"
                active={activeIndex === 1}
                index={1}
                onClick={this.handleClick}
                content={
                  <Link to="/table/1" style={{ color: 'black' }}>
                    Inventory
                  </Link>
                }
              />
              <Accordion.Content active={activeIndex === 1}>
                <Search
                  fluid
                  input={{ fluid: true }}
                  placeholder="Search filters..."
                />
              </Accordion.Content>
            </Menu.Item>

            <Menu.Item link>
              <Link to="/supplies" style={{ color: 'black' }}>
                Buy Supplies
              </Link>
            </Menu.Item>

            <Menu.Item link>
              <Link to="/users" style={{ color: 'black' }}>
                Manage Users
              </Link>
            </Menu.Item>
          </Accordion>
        </Grid.Column>

        <Grid.Column width={13}>{this.props.content}</Grid.Column>
      </Grid>
    );
  }
}

export default WHMenu;
