import React, { Component } from 'react';
import { ReadjustableImage, HTMLEditor } from '@common/components';
import {
  Dropdown,
  Breadcrumb,
  Input,
  Button,
  Message
} from 'semantic-ui-react';

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
      let invalidProperty = !property.value.trim();

      return (
        <li key={property.property_id}>
          {property.name} : {invalidProperty && 'N/D'}{' '}
          {!invalidProperty && `${property.value}`}{' '}
          {property.unit && !invalidProperty && `${property.unit}`}
        </li>
      );
    });

    let existentSpecifications = (
      <>
        <span>Specifications</span>
        <ul>{property_list}</ul>
      </>
    );
    let noSpecifications = <span>There are no specifications</span>;
    return (
      <div>
        {property_list.length > 0 && existentSpecifications}
        {property_list.length === 0 && noSpecifications}
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

      case 'description': {
        return (
          <h1 className="Title" style={{ textAlign: 'left', marginLeft: '5%' }}>
            {this.props.fieldContent}
          </h1>
        );
      }

      case 'user comments': {
        return (
          <>
            {this.props.fieldName}: <br />
            <HTMLEditor displayOnly={true} value={this.props.fieldContent} />
          </>
        );
      }

      case 'add user comment': {
        if (!this.props.isUserLogged) {
          //only allow comment addition if user is logged in
          return null;
        }

        return (
          <div style={{ marginTop: 20 }}>
            <HTMLEditor
              className={this.props.fieldName.replace(/ /g, '_')}
              canvasType="code"
              height="200"
              onChange={this.props.handleChange[0]}
              value={this.props.fieldContent}
            />
            <div style={{ marginBottom: 10, position: 'relative' }}>
              <Button
                primary
                key={this.props.fieldName}
                onClick={this.props.handleChange[1]}
              >
                Add comment
              </Button>
            </div>
          </div>
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

  editablePropertiesField() {
    let property_list = this.props.fieldContent.map(property => {
      var type = property.isNumber ? 'number' : 'text';
      return (
        <li key={property.property_id}>
          {property.name} :
          <Input
            type={type}
            name={property.name}
            value={property.value}
            onChange={this.props.handleChange}
          />
          {property.unit}
        </li>
      );
    });

    let existentSpecifications = (
      <>
        <span>Specifications</span>
        <ul>{property_list}</ul>
      </>
    );
    let noSpecifications = <span>There are no specifications</span>;
    return (
      <div>
        {property_list.length > 0 && existentSpecifications}
        {property_list.length === 0 && noSpecifications}
      </div>
    );
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

      case 'image': {
        let image_src = `data:image/png;base64,${this.props.fieldContent}`;
        return (
          <div>
            <ReadjustableImage
              src={image_src}
              maxWidth={IMAGE_WIDTH}
              maxHeight={IMAGE_HEIGHT}
            />
            <Button style={{ display: 'block', margin: '0 auto' }}>
              <label htmlFor="files" className="Button">
                Upload Image
              </label>
            </Button>
            <Input
              id="files"
              type="file"
              value=""
              onChange={this.props.handleChange}
              style={{ visibility: 'hidden' }}
            />
          </div>
        );
      }

      case 'user comments': {
        return (
          <div style={{ marginTop: 3 }}>
            {this.props.fieldName}: <br />
            <HTMLEditor
              className={this.props.fieldName.replace(/ /g, '_')}
              canvasType="code"
              onChange={this.props.handleChange}
              value={this.props.fieldContent}
            />
          </div>
        );
      }

      case 'packaging': {
        let availablePackages = this.props.fieldContent.packagingList;
        let itemPackaging = this.props.fieldContent.itemPackaging.name;

        return (
          <span>
            {this.props.fieldName}:{' '}
            <Dropdown
              fluid
              search
              selection
              selectOnNavigation={false}
              value={itemPackaging}
              options={availablePackages}
              onChange={this.props.handleChange}
            />
          </span>
        );
      }

      case 'breadcrumb': {
        if (this.props.fieldContent.length === 0) {
          return <Message negative header="WARNING: No category selected!" />;
        }
        let breadcrumb_tree = this.props.fieldContent.map((category, index) => {
          let link = index !== this.props.fieldContent.length - 1;
          let active = index === this.props.fieldContent.length - 1;
          let onClick =
            index === this.props.fieldContent.length - 1
              ? null
              : this.props.handleChange[0];
          return {
            key: category.id,
            content: category.name,
            link: link,
            active: active,
            onClick: onClick
          };
        });

        return (
          <div
            style={{
              padding: '3px 3px',
              backgroundSize: 'auto'
            }}
          >
            category: <br />
            <Breadcrumb icon="right angle" sections={breadcrumb_tree} />
            <Button
              circular
              negative
              icon="delete"
              size="mini"
              onClick={this.props.handleChange[1]}
              style={{
                backgroundColor: '#e82b34',
                marginLeft: '5px',
                padding: '5px 5px'
              }}
            />
          </div>
        );
      }

      case 'category': {
        let availableCategories = this.props.fieldContent.dropdown;
        let itemCategory = this.props.fieldContent.itemCategory.name;

        let noCategoryAvailable = `${itemCategory} has no children`;
        let placeholder = itemCategory
          ? `${itemCategory}'s children`
          : 'Select a category';

        return (
          <span>
            <Dropdown
              fluid
              search
              selection
              selectOnNavigation={false}
              noResultsMessage={noCategoryAvailable}
              text={placeholder}
              options={availableCategories}
              onChange={this.props.handleChange}
            />
          </span>
        );
      }

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
