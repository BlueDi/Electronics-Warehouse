import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { Button } from 'semantic-ui-react';

/**
 * Creates buttons to edit an Item.
 * The interactions available depend on the user permissions.
 */
class EditButton extends Component {
  renderButton(cookie_name, button_text, onClick) {
    var canDo = this.props.cookies.get(cookie_name) === 'true';
    var positive = button_text === 'Accept' ? true : false;
    var negative = button_text === 'Cancel' ? true : false;
    return (
      canDo && (
        <Button
          key={button_text}
          onClick={onClick}
          positive={positive}
          negative={negative}
        >
          {button_text}
        </Button>
      )
    );
  }

  render() {
    return this.props.editing
      ? [
          this.renderButton('can_edit', 'Accept', this.props.handleAccept),
          this.renderButton('can_edit', 'Cancel', this.props.handleCancel)
        ]
      : [this.renderButton('can_edit', 'Edit', this.props.handleEdit)];
  }
}

export default withCookies(EditButton);
