import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import WHHeader from "./Header";
import WHMenu from "./Menu";
import ErrorBoundary from "./ErrorBoundary";
import { Grid } from "semantic-ui-react";

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
            height: "8%",
            paddingBottom: "0px",
          }}
        >
          <Grid.Column width={20}>
            <WHHeader key={"header"} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row
          style={{
            height: "95%",
            paddingBottom: "0px",
            paddingLeft: "1em"
          }}
        >
          <Grid.Column width={16}>
            <WHMenu
              key={"menu"}
              content={routes.map((route, i) => <Route key={i} {...route} />)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid >
    );
  }
}

export default App;
