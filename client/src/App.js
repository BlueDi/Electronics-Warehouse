import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import WHHeader from "./Header";
import WHMenu from "./Menu";
import TableExample from "./Table"
import ErrorBoundary from "./ErrorBoundary";
import { Grid, Dropdown } from "semantic-ui-react";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: "",
      showSidebar: true
    };
  }

  componentDidMount() {
    fetch("/api/hello")
      .then(response => {
        if (!response.ok) {
          throw Error("Network request failed");
        }
        return response;
      })
      .then(result => result.json())
      .then(
        result => {
          this.setState({
            response: result.express,
            isFetching: false
          });
        },
        e => {
          console.log(e, "Failed to fetch service data.");
        }
      );
  }

  render() {
    return (
      <Grid stretched style={{ height: "100vh" }}>
        <Grid.Row
          style={{
            height: "9%",
            paddingBottom: "0px",
            marginLeft: "1em",
            marginRight: "1em",
          }}
        >
          <WHHeader key={"header"} />
        </Grid.Row>
        <Grid.Row
          style={{
            height: "92.5%",
            paddingBottom: "0px",
            paddingLeft: "1em",
            paddingTop: "0px"
          }}
        >
          <Grid.Column
            style={{
              backgroundColor: "#D2E0E8",
              width: "17%"
            }}
          >
            <WHMenu
              key={"menu"}
              content={routes.map((route, i) => <Route key={i} {...route} />)}
            />
          </Grid.Column>

          <Grid.Column
            style={{
              paddingTop: "1em",
              width: "82.3%",
              height: "100%"
            }}>
            <Grid.Row>
              <TableExample />
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid >
    );
  }
}

export default App;
