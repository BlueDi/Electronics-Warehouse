import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

class Home extends Component {
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

  toggleSidebar = e =>
    this.setState({
      showSidebar: this.state.showSidebar
    });

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">{this.state.response}</p>
        <p>
          To get started, edit
          <code>src/App.js</code>
          and save to reload.
        </p>
        <p>
          <Link to="/table/1">Table Example</Link>
        </p>
        <p>
          <Link to="/table/2">Table Example2</Link>
        </p>
      </div>
    );
  }
}

export default Home;
