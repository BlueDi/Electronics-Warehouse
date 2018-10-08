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
      <Grid>
        <Grid.Column width={3}
          style={{
            backgroundColor: "#CED8F8"
          }}>

          <Accordion fluid vertical
            style={{
              fontSize: "15pt",
              fontWeight: "300",
              textAlign: "center",
            }}
          >
            <Accordion.Title
              active={activeIndex === 3}
              index={3}
              onClick={this.handleClick}
              style={{
                borderBottom: "1px solid black"
              }}
            >
              Inventory
                <Icon name="dropdown" />
            </Accordion.Title>
            <Accordion.Content
              active={activeIndex === 3}
              style={{
                fontSize: "12.5pt",
                textAlign: "left",
                paddingLeft: "3em"
              }}
            >
              Search
              </Accordion.Content>

            <Accordion.Title
              style={{
                borderBottom: "1px solid black"
              }}
            >
              Buy Supplies
            </Accordion.Title>

            <Accordion.Title
              style={{
                borderBottom: "1px solid black"
              }}
            >
              Manage Users
            </Accordion.Title>
          </Accordion>
        </Grid.Column>

        <Grid.Column width={10}>{this.props.content}</Grid.Column>
      </Grid >
    );
  }
}

export default HWMenu;
