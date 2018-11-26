import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';

export class RequestField extends Component {
  constructor(props) {
    super(props);
  }

  getRender() {
    if (this.props.editable) {
      return this.editableGeneralField();
    } else {
      return this.nonEditableGeneralField();
    }
  }

  nonEditableGeneralField() {
    return `${this.props.fieldName}: ${this.props.fieldContent}`;
  }

  editableGeneralField() {
    switch (this.props.fieldName) {
      case 'workflow': {
        return (
          <span>
            {this.props.fieldName}:{' '}
            <Input
              type="text"
              name={this.props.fieldName}
              value={this.props.fieldContent}
              onChange={this.props.handleChange}
              style={{ width: '800px' }}
            />
          </span>
        );
      }

      default: {
        return `${this.props.fieldName}: ${this.props.fieldContent}`;
      }
    }
  }

  render() {
    return this.getRender();
  }
}

export default RequestField;
