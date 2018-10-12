import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import WHHeader from "./Header";
import WHMenu from "./Menu";
import { Grid } from "semantic-ui-react";

class App extends Component {
  render() {
    return (
      <Grid stretched style={{ height: "100vh" }}>
        <Grid.Row
          style={{
            height: "9%"
          }}
        >
          <Grid.Column width={16}>
            <WHHeader />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row
          style={{
            height: "91%",
            padding: "0px"
          }}
        >
          <Grid.Column width={16}>
            <WHMenu
              content={routes.map((route, i) => <Route key={i} {...route} />)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
