import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import routes from "./routes";
import WHHeader from "./Header";
import WHMenu from "./Menu";
import ErrorBoundary from "./ErrorBoundary";

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

  render() {
    return [
      <WHHeader key={"header"} />,
      <WHMenu
        key={"menu"}
        content={routes.map((route, i) => <Route key={i} {...route} />)}
      />
    ];
  }
}

export default App;
