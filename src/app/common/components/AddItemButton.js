import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import { Button, Icon } from 'semantic-ui-react';

class AddItemButton extends Component {
  render() {
    var canEdit = this.props.cookies.get('can_edit') === 'true';
    return (
      canEdit && (
        <Link to="/addNewItem">
          <Button icon labelPosition="left" positive>
            <Icon name="plus" />
            Add an item
          </Button>
        </Link>
      )
    );
  }
}

export default withCookies(AddItemButton);
