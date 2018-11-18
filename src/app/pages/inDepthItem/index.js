import React, { Component } from 'react';
import { PageTitle } from '@common/components';
import { service } from '@utils';
import { InDepthItemField } from './InDepthItemField';
import InDepthItemButtons from './InDepthItemButtons';
import '@common/styles/global.css';
import './styles/InDepthItem.scss';

class InDepthItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id || this.props.match.params.id,
      description: 'DESCRIPTION',
      image: '',
      total_stock: 'TOTAL STOCK',
      free_stock: 'FREE STOCK',
      last_price: 'LAST PRICE',
      location: 'Block B',
      user_comments: 'USER COMMENTS',
      details: 'DET',
      manufacturer: 'MUFACTURER',
      reference: 'REF',
      packaging: 'PACKAGING',
      category: {
        itemCategory: { id: 'ITEM_ID', name: 'ITEM_CAT' },
        breadcrumb: [],
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
    this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);

    //form field handlers
    this.handleItemFieldChange = this.handleItemFieldChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleNewImageFile = this.handleNewImageFile.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  componentDidMount() {
    this.getItemCharacteristics();
    this.getItemProperties();
    this.getItemCategory();
    this.getAllCategories();
  }

  getItemCharacteristics() {
    //get item info present in database's item table
    const apiUrl = `/item_characteristics/${this.state.id}`;

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
        //set item category
        let result = response.data[0];
        let itemCategory = { id: result.id, name: result.name };

        let newCategory = this.state.category;
        newCategory.itemCategory = itemCategory;

        this.setState({
          category: newCategory
        });

        //get item category tree
        this.getItemCategoryBreadcrumb();
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

  getItemCategoryBreadcrumb() {
    const apiUrl = `/category_tree/${this.state.category.itemCategory.id}`;

    service
      .get(apiUrl)
      .then(response => {
        //set item category
        let categoryTree = response.data;

        let breadcrumb = [];
        for (let i = categoryTree.length - 1; i >= 0; i--) {
          breadcrumb[categoryTree.length - 1 - i] = categoryTree[i];
        }

        let newCategory = this.state.category;
        newCategory.breadcrumb = breadcrumb;

        this.setState({
          category: newCategory
        });
      })
      .catch(e => {
        throw e;
      });
  }

  setNewCategory(newCategoryId, newCategoryName) {
    let apiUrl = `/item_category_properties`;
    let parameters = { itemId: this.state.id, newCategoryId: newCategoryId };
    service
      .post(apiUrl, parameters)
      .then(response => {
        let newProperties = response.data;

        //set properties according to new category
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

        let newCategory = this.state.category;
        newCategory.itemCategory = { id: newCategoryId, name: newCategoryName };
        this.setState({
          category: newCategory,
          properties: property_list
        });

        this.getItemCategoryBreadcrumb();
        console.log('category change', this.state);
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

  handleBreadcrumbClick(event, data) {
    let categoryId;
    let categoryName = data.content;
    let breadcrumb = this.state.category.breadcrumb;
    //get selected category id
    for (let i = 0; i < breadcrumb.length - 1; i++) {
      if (breadcrumb[i].name === categoryName) {
        categoryId = breadcrumb[i].id;
        break;
      }
    }

    this.setNewCategory(categoryId, categoryName);
  }

  handleCategoryChange(event) {
    if (event.target.textContent === '') return;

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

    this.setNewCategory(categoryId, categoryName);
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
    stateContents = stateContents.slice(3, stateContents.length - 1); // id, description, image, edit and category_list are NOT to be accessed

    let stateFields = Object.keys(this.state);
    stateFields = stateFields.slice(3, stateFields.length - 1); // id, description, image, edit and category_list are NOT to be accessed

    let itemCharacteristics = [];

    for (let i = 0; i < stateContents.length; i++) {
      let fieldName = stateFields[i];
      let fieldContent = stateContents[i];
      let changeHandler = this.handleItemFieldChange;

      if (fieldName === 'properties') {
        changeHandler = this.handlePropertyChange;
      }
      if (fieldName === 'category') {
        if (this.state.edit) {
          //category breadcrumb
          itemCharacteristics.push(
            <div key="breadcrumb">
              <InDepthItemField
                fieldName="breadcrumb"
                fieldContent={this.state.category.breadcrumb}
                editable={this.state.edit}
                handleChange={this.handleBreadcrumbClick}
              />
            </div>
          );
          fieldContent = this.state.category;
          changeHandler = this.handleCategoryChange;
        } else {
          //fieldContent = this.state.category.itemCategory.name;
          fieldContent = this.state.category.breadcrumb;
        }
      }

      itemCharacteristics.push(
        <div key={fieldName}>
          <InDepthItemField
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
          fieldName="description"
          fieldContent={this.state.description}
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
              <InDepthItemButtons
                editing={this.state.edit}
                handleRequest={this.handleRequest}
                handleEdit={this.handleEdit}
                handleAccept={this.handleAcceptEdition}
                handleCancel={this.handleCancelEdition}
              />
            </div>
          </column>
        </div>
      </div>
    );
  }

  render() {
    return (
      <PageTitle key={'InDepthItem'} title="InDepthItem">
        {this.renderItemFields()}
      </PageTitle>
    );
  }
}

export default InDepthItem;
