import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import WHHeader from "./Header.js";
import WHSidebar from "./Sidebar.js";
import { Sidebar } from "semantic-ui-react";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      response: "",
      showSidebar: false
    };
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  toggleSidebar = e =>
    this.setState({
      showSidebar: !this.state.showSidebar
    });

  callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return [
      <WHHeader toggleSidebar={this.toggleSidebar} />,
      <WHSidebar
        visible={this.state.showSidebar}
        content={
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
            <Link to="/table/1">Table Example</Link>
            <Link to="/table/2">Table Example2</Link>
          </div>
        }
      />
    ];
  }
}

export default App;
