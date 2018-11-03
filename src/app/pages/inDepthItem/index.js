import React, { Component } from 'react';
import { PageTitle } from '@common/components';
import { service } from '@utils';
import { InDepthItemField } from './InDepthItemField';
import { InDepthItemButtons } from './InDepthItemButtons';
import '@common/styles/global.css';
import './styles/InDepthItem.scss';

class InDepthItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      name: 'NAME',
      image: '',
      count: 'STOCK',
      location: 'Block B',
      condition: 'COND',
      details: 'DET',
      manufacturer: 'SUPP',
      reference: 'REF',
      category: {
        itemCategory: { id: 'ITEM_ID', name: 'ITEM_CAT' },
        categoryList: ['CAT1', 'CAT2', 'CAT3']
      },
      properties: [],
      edit: false
    };

    //button handlers
    this.handleRequest = this.handleRequest.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleAcceptEdition = this.handleAcceptEdition.bind(this);
    this.handleCancelEdition = this.handleCancelEdition.bind(this);

    //form field handlers
    this.handleItemFieldChange = this.handleItemFieldChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleNewImageFile = this.handleNewImageFile.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  componentDidMount() {
    this.getItemDescription();
    this.getItemProperties();
    this.getItemCategory();
    this.getAllCategories();
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

  getItemCategory() {
    const apiUrl = `/item_category/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        let result = response.data[0];
        let itemCategory = { id: result.id, name: result.name };

        let newCategory = this.state.category;
        newCategory.itemCategory = itemCategory;

        this.setState({
          category: newCategory
        });
      })
      .catch(e => {
        throw e;
      });
  }

  getAllCategories() {
    const apiUrl = `/all_categories`;
    service
      .get(apiUrl)
      .then(response => {
        let category_list = response.data.map(category => {
          return {
            key: category.id,
            value: category.name,
            text: category.name
          };
        });

        let newCategory = this.state.category;
        newCategory.categoryList = category_list;

        this.setState({
          category: newCategory
        });
      })
      .catch(e => {
        throw e;
      });
  }

  editItem() {
    const apiUrl = `/item_edit`;
    service
      .post(apiUrl, this.state)
      .then(response => {
        console.log('edit item response', response.data);
      })
      .then(response => {
        this.componentDidMount();
        return response;
      })
      .catch(e => {
        throw e;
      });
  }

  handleRequest() {
    //TODO: call API to create item request in database
  }

  handleEdit() {
    this.setState({ edit: true });
  }

  handleItemFieldChange(event) {
    console.log('itemFieldChange', event.target.name);
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAcceptEdition() {
    this.editItem();
    this.setState({ edit: false });
  }

  handleCancelEdition() {
    this.setState({ edit: false });
    this.componentDidMount();
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

  handleCategoryChange(event) {
    let categoryId;
    let categoryName = event.target.textContent;
    let categoryList = this.state.category.categoryList;

    for (let i = 0; i < categoryList.length; i++) {
      let currCategory = categoryList[i];
      if (currCategory.value == categoryName) {
        categoryId = currCategory.key;
        break;
      }
    }

    let apiUrl = `/item_category_properties`;
    let categories = { itemId: this.state.id, newCategoryId: categoryId };
    service
      .post(apiUrl, categories)
      .then(response => {
        let newProperties = response.data;
        console.log('newProperties', this.state);

        let property_list = newProperties.map(property => {
          let value = '';
          let edited = false;
          for (let j = 0; j < this.state.properties.length; j++) {
            if (property.id === this.state.properties[j].property_id) {
              value = this.state.properties[j].value;
              edited = this.state.properties[j].edited;
              break;
            }
          }

          return {
            property_id: property.id,
            value: value,
            unit: property.unit,
            name: property.name,
            edited: edited
          };
        });

        /*for(let i = 0; i < newProperties.length; i++)
        {
          let flag = false;
          for(let j = 0; j < this.state.properties.length; j++)
          {
            if(newProperties[i].property_id === this.state.properties[j].property_id)
            {
              newProperties[i].value = this.state.properties[j].value;
              newProperties[i].edited = this.state.properties[j].edited;
              flag = true;
              break;
            }
          }
          if(!flag) {
            newProperties[i].value = '';
            newProperties[i].edited = false;
          }
        }*/

        let newCategory = this.state.category;
        newCategory.itemCategory = { id: categoryId, name: categoryName };
        this.setState({
          category: newCategory,
          properties: property_list
        });

        //console.log('category change new properties response', this.state);
      })
      .catch(e => {
        throw e;
      });
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
    stateContents = stateContents.slice(3, stateContents.length - 1); // id, name, image, edit and category_list are NOT to be accessed

    let stateFields = Object.keys(this.state);
    stateFields = stateFields.slice(3, stateFields.length - 1); // id, name, image, edit and category_list are NOT to be accessed

    let itemCharacteristics = [];

    for (let i = 0; i < stateContents.length; i++) {
      let fieldName = stateFields[i];
      let fieldContent = stateContents[i];
      let changeHandler = this.handleItemFieldChange;

      if (fieldName === 'properties') {
        changeHandler = this.handlePropertyChange;
      }
      if (fieldName === 'category' && this.state.edit) {
        fieldContent = this.state.category;
        changeHandler = this.handleCategoryChange;
      } else if (fieldName === 'category' && !this.state.edit) {
        fieldContent = this.state.category.itemCategory.name;
      }

      itemCharacteristics.push(
        <div>
          <InDepthItemField
            key={fieldName}
            fieldName={fieldName}
            fieldContent={fieldContent}
            editable={this.state.edit}
            handleChange={changeHandler}
          />
        </div>
      );
    }

    return (
      <div>
        <InDepthItemField
          style={{ textAlign: 'left', float: 'left' }}
          fieldName="name"
          fieldContent={this.state.name}
          editable={this.state.edit}
          handleChange={this.handleItemFieldChange}
        />

        <div className="Item" style={{ textAlign: 'left' }}>
          <column style={{ columnWidth: '50%' }}>
            <div
              className="ComponentImage"
              style={{ float: 'left', marginLeft: '5%' }}
            >
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
              style={{ float: 'left', textAlign: 'left', marginLeft: '5%' }}
            >
              {itemCharacteristics}

              <div className="Buttons" style={{ columnCount: '2' }}>
                <InDepthItemButtons
                  editing={this.state.edit}
                  handleRequest={this.handleRequest}
                  handleEdit={this.handleEdit}
                  handleAccept={this.handleAcceptEdition}
                  handleCancel={this.handleCancelEdition}
                />
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

export default InDepthItem;
