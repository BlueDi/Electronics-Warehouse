import React, { Component } from 'react';
import { PageTitle } from '@common/components';
import { service } from '@utils';
import { RequestField } from './RequestField';
import { RequestButtons } from './RequestButtons';
import '@common/styles/global.css';
import './styles/InDepthItem.scss';

class Request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id || this.props.match.params.id,
      date_sent: 'UNKNOWN',
      date_cancelled: 'UNKNOWN',
      date_professor_evaluated: 'UNKNOWN',
      date_manager_evaluated: 'UNKNOWN',
      cancelled: 'UNKNOWN',
      professor_accept: 'UNKNOWN',
      manager_accept: 'UNKNOWN',
      purpose: 'UNKNOWN',
      workflow: 'UNKNOWN',
      requester_id: 'UNKNOWN',
      professor_id: 'UNKNOWN',
      manager_id: 'UNKNOWN',
      requester: 'UNKNOWN',
      professor: 'UNKNOWN',
      manager: 'UNKNOWN',
      items: [],
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
  }

  componentDidMount() {
    this.getItemCharacteristics();
    //this.getAllCategories();
  }

  getItemCharacteristics() {
    //get item info present in database's item table
    const apiUrl = `/request/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        console.log(response.data);
        this.setState(response.data);
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

  renderItemFields() {
    let stateContents = Object.values(this.state);
    stateContents = stateContents.slice(0, stateContents.length - 1); // id, description, image, edit and category_list are NOT to be accessed

    let stateFields = Object.keys(this.state);
    stateFields = stateFields.slice(0, stateFields.length - 1); // id, description, image, edit and category_list are NOT to be accessed

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
            <div>
              <RequestField
                key="breadcrumb"
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
        <div>
          <RequestField
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
        <RequestField
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
              <RequestField
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
                <RequestButtons
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
    return (
      <PageTitle key={'InDepthItem'} title="InDepthItem">
        {this.renderItemFields()}
      </PageTitle>
    );
  }
}

export default Request;
