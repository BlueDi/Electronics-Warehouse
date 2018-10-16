import React, { Component } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { Grid, Button, Icon, GridColumn } from "semantic-ui-react";
import TableExample from "./Table";
import WHSearchBar from "./SearchBar"

class AddItem extends Component {

    render() {
        return (

            <div style={{ paddingTop: "1em" }}>
                <div style={{ float: "right" }}>
                    <WHSearchBar key="searchBar" />
                </div>

                <div>
                    <Link to="/addItem">

                    </Link>
                </div>

                <div style={{ paddingTop: "2em" }}>
                    <TableExample />
                </div>
            </div>
        );
    }
}

export default AddItem;
