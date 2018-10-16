import React, { Component } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { Grid, Button, Icon, GridColumn } from "semantic-ui-react";
import TableExample from "./Table";
import WHSearchBar from "./SearchBar"

const addAnItemButton = () => (
    <div>
        <Button icon labelPosition='left' style={{ backgroundColor: "#87DC8E" }}>
            <Icon name='plus' />
            Add an item
      </Button>
    </div>
)


class WHInventory extends Component {

    render() {
        return (

            <div style={{ paddingTop: "0.5em" }}>
                <div style={{ float: "right" }}>
                    <WHSearchBar key="searchBar" />
                </div>

                <div style={{ float: "left" }}>
                    <Link to="/addItem">
                        {addAnItemButton()}
                    </Link>
                </div>

                <div style={{ paddingTop: "4em" }}>
                    <TableExample />
                </div>
            </div>
        );
    }
}

export default WHInventory;
