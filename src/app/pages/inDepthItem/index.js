import React, { Component } from 'react';
import { AddToCart, PageTitle } from '@common/components';
import { service } from '@utils';
import { InDepthItemField } from './InDepthItemField';
import EditButton from './EditButton';
import { withCookies } from 'react-cookie';
import { Loader } from '@common/components';
import './styles/InDepthItem.scss';
import { Grid } from 'semantic-ui-react';

/**
 * Number of functions responsible for fetching item information from database, which needs to be obtained before we can render the item page
 */
const loadingsForRender = 6;

/**
 * Component responsible for managing the item page rendering, both edit and non-edit mode
 */
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
      user_comments: 'USER COMMENTS',
      add_user_comment: '',
      edit: false,
      loadedInfo: 0,
      isFetching: true
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

  /**
   * Called when the first page rendering occurs
   * Fetches item information from database
   */
  componentDidMount() {
    this.setState({
      isFetching: true
    });

    this.getItemCharacteristics();
    this.getItemPackaging();
    this.getItemProperties();
    this.getItemCategory();
    this.getAllPackages();
    this.getAllCategories();
  }

  /**
   * Fetches the following item information from database:
   * - description, image, stock related counts, price, warehouse location, user comments, details, manufacturer, reference id and last edition date
   */
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

  /**
   * Fetches item packaging from database
   */
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

  /**
   * Fetches all item properties from database
   */
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

  /**
   * Fetches important information related to item category, including information that allows creation of category dropdown and breadcrumb when editing category
   */
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

  /**
   * Fetches all existing packings from database
   */
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

  /**
   * Fetches all existing categories from database
   */
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

  /**
   * Fetches item catergory's ancestor tree from database, used to create category breadcrumb
   */
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

  /**
   * Fetches item user comments from database
   */
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

  /**
   * Fetches item catergory's descendants from database, which will be the ones present in the dropdown used for category edit
   */
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

  /**
   * This function is called everytime one of the async functions in "componentDidMount" ends, so we can keep count of how many are left until we get all information required from database
   * Only after all those async funtions end, we are able to render the item page
   */
  loadedNewInfo() {
    //reset loaded info count, when all info has been fetched
    this.setState(state => ({
      loadedInfo:
        state.loadedInfo + 1 < loadingsForRender ? state.loadedInfo + 1 : 0,
      isFetching: state.loadedInfo + 1 < loadingsForRender
    }));
  }

  /**
   * Sets a new category in state
   * Also sets all properties from the new category
   */
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

  /**
   * Calls API to edit item information
   */
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

  /**
   * "Request" button event handler
   * Calls API responsible for sending request email notification
   */
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

  /**
   * "Edit" button event handler
   * Sets "edit" state variable to true
   */
  handleEdit() {
    this.setState({ edit: true });
  }

  /**
   * Event handler called when an input is received on an item characteristic field
   * Updates the item characteristic to the new input
   */
  handleItemFieldChange(event) {
    this.setState({
      [event.target.name.replace(/ /g, '_')]: event.target.value
    });
  }

  /**
   * Edit "Accept" button event handler
   * Calls function responsible for item edition
   * Sets "edit" state variable to false
   */
  handleAcceptEdition() {
    if (this.state.category.itemCategory.name) {
      this.editItem();
      this.setState({ edit: false });
    }
  }

  /**
   * Edit "Cancel" button event handler
   * Sets "edit" state variable to false
   * Re-renders item page by calling "componentDidMount" function, so that if any edit input as been made, all item information gets back to normal
   */
  handleCancelEdition() {
    this.setState({ edit: false });
    this.componentDidMount();
  }

  /**
   * User comment event handler
   * Calls API responsible for adding a new user comment
   */
  handleUserCommentAddition() {
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

  /**
   * Event handler called when an input is received on an item property field
   * Updates the item property to the new input
   */
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

  /**
   * Event handler called when an item category's ancestor is clicked in the category breadcrumb
   * Call "setNewCategory" function, updating the item category to the one clicked, and getting all category information required
   */
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

  /**
   * Event handler called when the category breadcrumb delete button is clicked
   * Erases current category, which results in showing all available categories in the category dropdown
   */
  handleBreadcrumbDelete() {
    let emptyCategory = this.state.category;
    emptyCategory.itemCategory.name = null;
    emptyCategory.breadcrumb = [];
    this.setState({
      category: emptyCategory
    });

    this.getDropdownCategories();
  }

  /**
   * Event handler called when a category is selected in the category dropdown
   * Call "setNewCategory" function, updating the item category to the one selected, and getting all category information required
   */
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

  /**
   * Event handler called when a packaging is selected in the packagings dropdown
   * Updates the item packaging to the one selected
   */
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

  /**
   * Event handler called when an input is received on an user comment html editor field, being in the add new comment section available to any user, or edit user comments section only available to managers
   * Updates the respective user comment field to the new input
   */
  handleUserCommentsChange(event, data) {
    this.setState({
      [event.target.className]: data.value
    });
  }

  /**
   * Event handler called when an image file is uploaded
   * Updates the item image to the uploaded one
   */
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

  /**
   * @returns true if the user is logged in, false otherwise
   */
  isUserLogged() {
    const { cookies } = this.props;
    const emptyCookie =
      Object.keys(cookies.cookies).length === 0 &&
      cookies.cookies.constructor === Object;
    const validSecurity = cookies.get('security') !== '0';
    return !emptyCookie && validSecurity;
  }

  /**
   * Renders all item fields, deciding if it's done in edit mode or not
   * State variables are mapped to an object rendered on the item page
   */
  renderItemFields() {
    let stateContents = Object.values(this.state);
    stateContents = stateContents.slice(3, stateContents.length - 3); // id, description, image and edit, loadedInfo, isFetching are NOT to be accessed

    let stateFields = Object.keys(this.state);
    stateFields = stateFields.slice(3, stateFields.length - 3); // id, description, image and edit, loadedInfo, isFetching are NOT to be accessed

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

    let leftColumnInformation = itemCharacteristics.slice(
      0,
      itemCharacteristics.length - 2
    );
    let rightColumnInformation = itemCharacteristics.slice(
      itemCharacteristics.length - 2,
      itemCharacteristics.length
    );

    return (
      <div>
        <InDepthItemField
          style={{ textAlign: 'left', float: 'left' }}
          fieldName="description"
          fieldContent={this.state.description}
          editable={this.state.edit}
          handleChange={this.handleItemFieldChange}
        />

        <Grid style={{ marginLeft: 20 }}>
          <Grid.Column width={7}>
            <Grid.Row>
              <InDepthItemField
                fieldName="image"
                fieldContent={this.state.image}
                editable={this.state.edit}
                handleChange={this.handleNewImageFile}
              />
            </Grid.Row>

            <Grid.Row>{leftColumnInformation}</Grid.Row>

            <Grid.Row>
              <AddToCart items={[this.state]} />
              <EditButton
                editing={this.state.edit}
                handleRequest={this.handleRequest}
                handleEdit={this.handleEdit}
                handleAccept={this.handleAcceptEdition}
                handleCancel={this.handleCancelEdition}
              />
            </Grid.Row>
          </Grid.Column>

          <Grid.Column width={9}>{rightColumnInformation}</Grid.Column>
        </Grid>
      </div>
    );
  }

  /**
   * Renders the item information page, by calling "renderItemFields" function, once all the information has been fetched from database
   * While item information is being fetched form database, a loading animation is rendered
   */
  render() {
    return this.state.isFetching ? (
      <Loader text="Preparing Item" />
    ) : (
      <PageTitle key={'InDepthItem'} title="InDepthItem">
        {this.renderItemFields()}
      </PageTitle>
    );
  }
}

export default withCookies(InDepthItem);
