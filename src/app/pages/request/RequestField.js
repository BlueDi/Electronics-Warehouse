import React, { Component } from 'react';
import { Dropdown, Breadcrumb, Input } from 'semantic-ui-react';

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

  // A general non-editable field is any field that is NOT a property
  nonEditableGeneralField() {
    switch (this.props.fieldName) {
      case 'description': {
        return (
          <h1 className="Title" style={{ textAlign: 'left', marginLeft: '5%' }}>
            {this.props.fieldContent}
          </h1>
        );
      }

      case 'category': {
        let category_tree = this.props.fieldContent.map((category, index) => {
          let active = index === this.props.fieldContent.length - 1;
          return {
            key: category.id,
            content: category.name,
            link: false,
            active: active
          };
        });
        return (
          <div>
            {this.props.fieldName}:{' '}
            <Breadcrumb icon="right angle" sections={category_tree} />
          </div>
        );
      }

      default:
        return `${this.props.fieldName}: ${this.props.fieldContent}`;
    }
  }

  // A general editable field is any field that is NOT a property
  editableGeneralField() {
    switch (this.props.fieldName) {
      case 'description': {
        return (
          <h1 className="Title" style={{ textAlign: 'left', marginLeft: '5%' }}>
            {this.props.fieldName}:{' '}
            <Input
              type="text"
              name={this.props.fieldName}
              value={this.props.fieldContent}
              onChange={this.props.handleChange}
            />
          </h1>
        );
      }

      case 'breadcrumb': {
        let breadcrumb_tree = this.props.fieldContent.map((category, index) => {
          let link = index !== this.props.fieldContent.length - 1;
          let active = index === this.props.fieldContent.length - 1;
          let onClick =
            index === this.props.fieldContent.length - 1
              ? null
              : this.props.handleChange;
          return {
            key: category.id,
            content: category.name,
            link: link,
            active: active,
            onClick: onClick
          };
        });

        return <Breadcrumb icon="right angle" sections={breadcrumb_tree} />;
      }

      case 'category': {
        let availableCategories = this.props.fieldContent.categoryList;
        let itemCategory = this.props.fieldContent.itemCategory.name;

        return (
          <span>
            {this.props.fieldName}:{' '}
            <Dropdown
              placeholder="Select category"
              fluid
              search
              selection
              value={itemCategory}
              options={availableCategories}
              onChange={this.props.handleChange}
            />
          </span>
        );
      }

      default: {
        return (
          <span>
            {this.props.fieldName}:{' '}
            <Input
              type="text"
              name={this.props.fieldName}
              value={this.props.fieldContent}
              onChange={this.props.handleChange}
            />
          </span>
        );
      }
    }
  }

  render() {
    return this.getRender();
  }
}

export default RequestField;
