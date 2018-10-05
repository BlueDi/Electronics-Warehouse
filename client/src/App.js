import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import WHHeader from "./Header.js";
import WHSidebar from "./Sidebar.js";
import ErrorBoundary from "./ErrorBoundary.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: "",
      showSidebar: false
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

  toggleSidebar = e =>
    this.setState({
      showSidebar: !this.state.showSidebar
    });

  render() {
    return [
      <WHHeader key={1} toggleSidebar={this.toggleSidebar} />,
      <WHSidebar
        key={2}
        visible={this.state.showSidebar}
        content={
          <Switch>
            <ErrorBoundary>
              {routes.map((route, i) => <Route key={i} {...route} />)}
            </ErrorBoundary>
          </Switch>
        }
      />
    ];
  }
}

export default App;
