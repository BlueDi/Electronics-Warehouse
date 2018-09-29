import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import App from "./App";
import TableExample from "./Table";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router>
    <div>
      <App />

      <Route path="/table/:id" component={TableExample} />
    </div>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
