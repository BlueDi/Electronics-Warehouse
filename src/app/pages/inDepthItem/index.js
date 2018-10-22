import React, { Component } from 'react';
import { PageTitle, ReadjustableImage } from '@common/components';
import { service } from '@utils';

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 300;

class InDepthItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      name: 'NAME',
      image: 'BASE64_IMAGE',
      count: 'STOCK',
      location: 'Block B',
      condition: 'COND',
      details: 'DET',
      manufacturer: 'SUPP',
      reference: 'REF',
      category: 'CAT',
      properties: [],
      edit: false
    };

    this.handleRequest = this.handleRequest.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleItemFieldChange = this.handleItemFieldChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleNewImageFile = this.handleNewImageFile.bind(this);
  }

  componentDidMount() {
    this.getItemDescription();
    this.getItemProperties();
    this.getItemCategory();
  }

  getItemDescription() {
    //get item info present in database's item table
    const apiUrl = `/item_description/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        this.setState(response.data);
      })
      .catch(e => {
        throw e;
      });
  }

  getItemProperties() {
    const apiUrl = `/item_properties/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        let property_list = response.data.map(property => {
          return {
            property_id: property.property_id,
            value: property.value,
            unit: property.unit,
            name: property.name,
            edited: false
          };
        });

        this.setState({
          properties: property_list
        });
      })
      .catch(e => {
        throw e;
      });
  }

  //TODO: averiguar catergorias encadeadas
  getItemCategory() {
    const apiUrl = `/item_category/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        let result = response.data[0];
        this.setState({
          category: result.name
        });
      })
      .catch(e => {
        throw e;
      });
  }

  editItem() {
    const apiUrl = `/item_edit`;

    service.post(apiUrl, this.state).catch(e => {
      throw e;
    });
  }

  handleRequest(event) {
    console.log(event);
    //TODO: call API to create item request in database
  }

  handleEdit() {
    if (this.state.edit) {
      this.editItem();
      this.componentDidMount();
    }

    this.setState({ edit: !this.state.edit });
  }

  handleItemFieldChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handlePropertyChange(event) {
    let newProperties = this.state.properties;

    for (let i = 0; i < newProperties.length; i++) {
      if (newProperties[i].name === event.target.name) {
        newProperties[i].value = event.target.value;
        newProperties[i].edited = true;
        this.setState({
          properties: newProperties
        });
      }
    }
  }

  handleNewImageFile(event) {
    let uploadedFile = event.target.files[0];

    let reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function(file) {
      let fileContent = file.target.result.split(',')[1];

      this.setState({
        image: fileContent
      });
    }.bind(this);

    // Read in the image file as a data URL.
    reader.readAsDataURL(uploadedFile);
  }

  renderItemFields() {
    let stateContents = Object.values(this.state);
    stateContents = stateContents.slice(3, stateContents.length - 1); // id, name and image and edit (last index) are NOT to be accessed

    let stateFields = Object.keys(this.state);
    stateFields = stateFields.slice(3, stateFields.length - 1); // id, name and image and edit (last index) are NOT to be accessed

    let JSXArray = [];

    for (let i = 0; i < stateContents.length; i++) {
      let fieldName = stateFields[i];
      let fieldContent = stateContents[i];

      if (fieldName === 'properties') {
        JSXArray.push(
          <InDepthItemField
            key={fieldName}
            fieldName={fieldName}
            fieldContent={fieldContent}
            editable={this.state.edit}
            handleChange={this.handlePropertyChange}
          />
        );
      } else {
        JSXArray.push(
          <InDepthItemField
            key={fieldName}
            fieldName={fieldName}
            fieldContent={fieldContent}
            editable={this.state.edit}
            handleChange={this.handleItemFieldChange}
          />
        );
      }
    }

    return (
      <div>
        <InDepthItemField
          fieldName="name"
          fieldContent={this.state.name}
          editable={this.state.edit}
          handleChange={this.handleItemFieldChange}
        />

        <div
          className="Item"
          style={{ textAlign: 'center', marginLeft: '35%' }}
        >
          <column style={{ columnWidth: '50%' }}>
            <div className="ComponentImage" style={{ float: 'left' }}>
              <InDepthItemField
                fieldName="image"
                fieldContent={this.state.image}
                editable={this.state.edit}
                handleChange={this.handleNewImageFile}
              />
            </div>
          </column>
          <column style={{ columnWidth: '50%' }}>
            <div
              className="Information"
              style={{ float: 'left', textAlign: 'left' }}
            >
              {JSXArray}

              <div className="Buttons" style={{ columnCount: '2' }}>
                <div className="RequestButton" style={{ textAlign: 'right' }}>
                  <button
                    onClick={this.handleRequest}
                    style={{
                      backgroundColor: '#89DF89',
                      padding: '10px 15px',
                      borderRadius: '10px',
                      border: '0px'
                    }}
                  >
                    Request
                  </button>
                </div>

                <div className="EditButton" style={{ textAlign: 'left' }}>
                  <button
                    onClick={this.handleEdit}
                    style={{
                      backgroundColor: '#D2E0E8',
                      padding: '10px 15px',
                      borderRadius: '10px',
                      border: '0px'
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </column>
        </div>
      </div>
    );
  }

  render() {
    return [
      <PageTitle key={'InDepthItem'} title="InDepthItem">
        {this.renderItemFields()}
      </PageTitle>
    ];
  }
}

class InDepthItemField extends Component {
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
          <h1 className="Title" style={{ textAlign: 'center' }}>
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
          <input
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
          <h1 className="Title" style={{ textAlign: 'center' }}>
            {this.props.fieldName}:{' '}
            <input
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
            <input type="file" value="" onChange={this.props.handleChange} />
          </div>
        );
      }

      default: {
        return (
          <span>
            {this.props.fieldName}:{' '}
            <input
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

export default InDepthItem;
