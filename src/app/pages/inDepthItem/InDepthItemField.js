import React, { Component } from 'react';
import { ReadjustableImage } from '@common/components';
import { Dropdown, Input } from 'semantic-ui-react';

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 300;

export class InDepthItemField extends Component {
  constructor(props) {
    super(props);
  }

  getRender() {
    if (this.props.editable) {
      return this.props.fieldName === 'properties'
        ? this.editablePropertiesField()
        : this.editableGeneralField();
    } else {
      return this.props.fieldName === 'properties'
        ? this.nonEditablePropertiesField()
        : this.nonEditableGeneralField();
    }
  }

  nonEditablePropertiesField() {
    let property_list = this.props.fieldContent.map(property => {
      return (
        <li key={property.property_id}>
          {property.name} : {property.value} {property.unit}
        </li>
      );
    });
    return (
      <div>
        <span>Specifications</span>
        <ul>{property_list}</ul>
      </div>
    );
  }

  // A general non-editable field is any field that is NOT a property
  nonEditableGeneralField() {
    switch (this.props.fieldName) {
      case 'image': {
        let image_src = `data:image/png;base64,${this.props.fieldContent}`;
        return (
          <ReadjustableImage
            src={image_src}
            maxWidth={IMAGE_WIDTH}
            maxHeight={IMAGE_HEIGHT}
          />
        );
      }

      case 'name': {
        return (
          <h1 className="Title" style={{ textAlign: 'left', marginLeft: '5%' }}>
            {this.props.fieldContent}
          </h1>
        );
      }

      default:
        return `${this.props.fieldName}: ${this.props.fieldContent}`;
    }
  }

  editablePropertiesField() {
    let property_list = this.props.fieldContent.map(property => {
      return (
        <li key={property.property_id}>
          {property.name} :{' '}
          <Input
            type="text"
            name={property.name}
            value={property.value}
            onChange={this.props.handleChange}
          />{' '}
          {property.unit}
        </li>
      );
    });

    return (
      <div>
        <span>Specifications</span>
        <ul>{property_list}</ul>
      </div>
    );
  }

  // A general editable field is any field that is NOT a property
  editableGeneralField() {
    switch (this.props.fieldName) {
      case 'name': {
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

      case 'image': {
        let image_src = `data:image/png;base64,${this.props.fieldContent}`;
        return (
          <div>
            <ReadjustableImage
              src={image_src}
              maxWidth={IMAGE_WIDTH}
              maxHeight={IMAGE_HEIGHT}
            />
            <Input
              type="file"
              value=""
              onChange={this.props.handleChange}
              style={{ display: 'block', marginTop: '1%', marginBottom: '1%' }}
            />
          </div>
        );
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
              defaultValue={itemCategory}
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

export default InDepthItemField;
