import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

class AddItemButton extends Component {
  render() {
    return (
      <Link to="/addNewItem">
        <Button
          icon
          labelPosition="left"
          style={{ backgroundColor: '#87DC8E' }}
        >
          <Icon name="plus" />
          Add an item
        </Button>
      </Link>
    );
  }
}

export default AddItemButton;
