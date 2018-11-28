import React, { Component } from 'react';
import { PageTitle } from '@common/components';
import { service } from '@utils';
import { InDepthItemField } from './InDepthItemField';
import InDepthItemButtons from './InDepthItemButtons';
import { withCookies } from 'react-cookie';
import { Loader } from 'semantic-ui-react';
import '@common/styles/global.css';
import './styles/InDepthItem.scss';

const loadingsForRender = 6;

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
      add_user_comment: '',
      details: 'DET',
      manufacturer: 'MANUFACTURER',
      reference: 'REF',
      packaging: {
        itemPackaging: { id: 'PACKAGING_ID', name: 'ITEM_PACK' },
        packagingList: ['PACK1', 'PACK2', 'PACK3']
      },
      category: {
        itemCategory: { id: 'ITEM_ID', name: 'ITEM_CAT' },
        breadcrumb: [],
        dropdown: [],
        categoryList: ['CAT1', 'CAT2', 'CAT3']
      },
      properties: [],
      last_edit: 'EDIT_DATE',
      edit: false,
      loadedInfo: 0
    };

    //button handlers
    this.handleRequest = this.handleRequest.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleAcceptEdition = this.handleAcceptEdition.bind(this);
    this.handleCancelEdition = this.handleCancelEdition.bind(this);
    this.handleBreadcrumbClick = this.handleBreadcrumbClick.bind(this);
    this.handleBreadcrumbDelete = this.handleBreadcrumbDelete.bind(this);
    this.handleUserCommentAddition = this.handleUserCommentAddition.bind(this);

    //form field handlers
    this.handleItemFieldChange = this.handleItemFieldChange.bind(this);
    this.handleUserCommentsChange = this.handleUserCommentsChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleNewImageFile = this.handleNewImageFile.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handlePackagingChange = this.handlePackagingChange.bind(this);
  }

  componentDidMount() {
    this.getItemCharacteristics();
    this.getItemPackaging();
    this.getItemProperties();
    this.getItemCategory();
    this.getAllPackages();
    this.getAllCategories();
  }

  getItemCharacteristics() {
    //get item info present in database's item table
    const apiUrl = `/item_characteristics/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        this.setState(response.data);
        this.loadedNewInfo();
      })
      .catch(e => {
        throw e;
      });
  }

  getItemPackaging() {
    const apiUrl = `/item_packaging/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        let result = response.data;

        let itemPackaging = { id: result.id, name: result.name };

        let newPackaging = this.state.packaging;
        newPackaging.itemPackaging = itemPackaging;

        this.setState({
          packaging: newPackaging
        });
        this.loadedNewInfo();
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
            isNumber: property.number,
            edited: false
          };
        });

        this.setState({
          properties: property_list
        });
        this.loadedNewInfo();
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

        //get category dropdown for item editing
        this.getDropdownCategories();

        this.loadedNewInfo();
      })
      .catch(e => {
        throw e;
      });
  }

  getAllPackages() {
    const apiUrl = `/all_packages`;
    service
      .get(apiUrl)
      .then(response => {
        let packaging_list = response.data.map(packaging => {
          return {
            key: packaging.id,
            value: packaging.name,
            text: packaging.name
          };
        });

        let newPackaging = this.state.packaging;
        newPackaging.packagingList = packaging_list;

        this.setState({
          packaging: newPackaging
        });
        this.loadedNewInfo();
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
        this.loadedNewInfo();
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

  getUserComments() {
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

  getDropdownCategories() {
    if (!this.state.category.itemCategory.name) {
      // category breadcrumb was erased
      let newCategory = this.state.category;
      newCategory.dropdown = newCategory.categoryList;

      this.setState({
        category: newCategory
      });
      return;
    }

    const apiUrl = `/category_descendant_tree/${
      this.state.category.itemCategory.id
    }`;

    service
      .get(apiUrl)
      .then(response => {
        let descendantTree = response.data;

        let dropdown_list = descendantTree.map(descendant => {
          return {
            key: descendant.id,
            value: descendant.name,
            text: descendant.name
          };
        });

        let newCategory = this.state.category;
        newCategory.dropdown = dropdown_list;

        this.setState({
          category: newCategory
        });
      })
      .catch(e => {
        throw e;
      });
  }

  loadedNewInfo() {
    this.setState(state => ({
      loadedInfo: state.loadedInfo + 1
    }));
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
        this.getDropdownCategories();
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
        this.componentDidMount();
        return response;
      })
      .catch(e => {
        throw e;
      });
  }

  handleRequest() {
    const apiUrl = `/send_mail/veronica.fradique@gmail.com`;

    service
      .get(apiUrl)
      .then(response => {
        return response;
      })
      .catch(e => {
        throw e;
      });
  }

  handleEdit() {
    this.setState({ edit: true });
  }

  handleItemFieldChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAcceptEdition() {
    if (this.state.category.itemCategory.name) {
      this.editItem();
      this.setState({ edit: false });
    }
  }

  handleCancelEdition() {
    this.setState({ edit: false });
    this.componentDidMount();
  }

  handleUserCommentAddition() {
    //TODO: append current user comment to the aready existing user comments
    //database and stuff related
    if (!this.state.add_user_comment.trim()) {
      //empty comment
      return;
    }

    const apiUrl = `/item_comments_increment`;
    let postBody = {
      itemId: this.state.id,
      newComment: this.state.add_user_comment
    };

    service
      .post(apiUrl, postBody)
      .then(response => {
        this.setState({
          add_user_comment: ''
        });
        this.getUserComments();
        return response;
      })
      .catch(e => {
        throw e;
      });
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

  handleBreadcrumbDelete() {
    let emptyCategory = this.state.category;
    emptyCategory.itemCategory.name = null;
    emptyCategory.breadcrumb = [];
    this.setState({
      category: emptyCategory
    });

    this.getDropdownCategories();
  }

  handleCategoryChange(event, data) {
    let categoryId;
    let categoryName = data.value;
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

  handlePackagingChange(event, data) {
    let packagingId;
    let packagingName = data.value;
    let packagingList = this.state.packaging.packagingList;

    for (let i = 0; i < packagingList.length; i++) {
      let currPackaging = packagingList[i];
      if (currPackaging.value == packagingName) {
        packagingId = currPackaging.key;
        break;
      }
    }

    let newPackaging = this.state.packaging;
    newPackaging.itemPackaging = { id: packagingId, name: packagingName };

    this.setState({
      packaging: newPackaging
    });
  }

  handleUserCommentsChange(event, data) {
    this.setState({
      [event.target.className]: data.value
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

  isUserLogged() {
    const { cookies } = this.props;
    const emptyCookie =
      Object.keys(cookies.cookies).length === 0 &&
      cookies.cookies.constructor === Object;
    const validSecurity = cookies.get('security') !== '0';
    return !emptyCookie && validSecurity;
  }

  renderItemFields() {
    let stateContents = Object.values(this.state);
    stateContents = stateContents.slice(3, stateContents.length - 2); // id, description, image and edit are NOT to be accessed

    let stateFields = Object.keys(this.state);
    stateFields = stateFields.slice(3, stateFields.length - 2); // id, description, image and edit are NOT to be accessed

    let itemCharacteristics = [];

    for (let i = 0; i < stateContents.length; i++) {
      let fieldName = stateFields[i];
      let fieldContent = stateContents[i];
      let changeHandler = this.handleItemFieldChange;

      if (fieldName === 'properties') {
        changeHandler = this.handlePropertyChange;
      } else if (fieldName === 'category') {
        if (this.state.edit) {
          //category breadcrumb
          let breadcrumbHandlers = [
            this.handleBreadcrumbClick,
            this.handleBreadcrumbDelete
          ];
          itemCharacteristics.push(
            <div key="breadcrumb">
              <InDepthItemField
                fieldName="breadcrumb"
                fieldContent={this.state.category.breadcrumb}
                editable={this.state.edit}
                handleChange={breadcrumbHandlers}
              />
            </div>
          );
          fieldContent = this.state.category;
          changeHandler = this.handleCategoryChange;
        } else {
          fieldContent = this.state.category.breadcrumb;
        }
      } else if (fieldName === 'packaging') {
        if (!this.state.edit) {
          fieldContent = this.state.packaging.itemPackaging.name;
        } else {
          fieldContent = this.state.packaging;
          changeHandler = this.handlePackagingChange;
        }
      } else if (
        this.state.edit &&
        (fieldName === 'last_edit' || fieldName === 'add_user_comment')
      ) {
        //last edit date is not editable
        //when edition is active, manager can edit directly on user_comments camp. There's no need for add comment form
        continue;
      } else if (fieldName === 'add_user_comment') {
        changeHandler = [
          this.handleUserCommentsChange,
          this.handleUserCommentAddition
        ];
      } else if (fieldName === 'user_comments') {
        changeHandler = this.handleUserCommentsChange;
      }

      itemCharacteristics.push(
        <div key={fieldName}>
          <InDepthItemField
            key={fieldName}
            fieldName={fieldName.replace(/_/g, ' ')}
            fieldContent={fieldContent}
            editable={this.state.edit}
            handleChange={changeHandler}
            isUserLogged={this.isUserLogged()}
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
    return this.state.loadedInfo < loadingsForRender ? (
      <Loader text="Preparing Item" />
    ) : (
      <PageTitle key={'InDepthItem'} title="InDepthItem">
        {this.renderItemFields()}
      </PageTitle>
    );
  }
}

export default withCookies(InDepthItem);
