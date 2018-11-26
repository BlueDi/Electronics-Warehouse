import React, { Component } from 'react';
import { PageTitle } from '@common/components';
import { service } from '@utils';
import { RequestField } from './RequestField';
import { RequestButtons } from './RequestButtons';
import '@common/styles/global.css';

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
      edit: false
    };

    //button handlers
    this.handleAccept = this.handleReject.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSaveEdition = this.handleSaveEdition.bind(this);
    this.handleCancelEdition = this.handleCancelEdition.bind(this);
    this.handleRequestFieldChange = this.handleRequestFieldChange.bind(this);
  }

  componentDidMount() {
    this.getRequestInfo();
    this.getRequestItems();
  }

  getRequestInfo() {
    const apiUrl = `/request/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        this.setState(response.data);
      })
      .catch(e => {
        throw e;
      });
  }

  getRequestItems() {
    const apiUrl = `/request_items/${this.state.id}`;
    service
      .get(apiUrl)
      .then(response => {
        console.log('items', response.data);

        this.setState({
          items: response.data
        });
      })
      .catch(e => {
        throw e;
      });
  }

  editRequestWorkflow() {
    const apiUrl = `/request_workflow_update`;
    service
      .post(apiUrl, this.state)
      .then(response => {
        console.log('edit workflow response', response.data);
      })
      .then(response => {
        this.componentDidMount();
        return response;
      })
      .catch(e => {
        throw e;
      });
  }

  handleAccept() {
    const apiUrl = `/request_evaluate_manager`;
    const reqBody = { id: this.state.id, accept: true };
    service
      .post(apiUrl, reqBody)
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

  handleReject() {
    const apiUrl = `/request_evaluate_manager`;
    const reqBody = { id: this.state.id, accept: false };
    service
      .post(apiUrl, reqBody)
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

  handleEdit() {
    this.setState({ edit: true });
  }

  handleSaveEdition() {
    this.editRequestWorkflow();
    this.setState({ edit: false });
  }

  handleCancelEdition() {
    this.setState({ edit: false });
    this.componentDidMount();
  }

  handleRequestFieldChange(event) {
    this.setState({ [event.target.name]: event.target.value });
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
      let changeHandler = this.handleRequestFieldChange;

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
        <div className="Request" style={{ textAlign: 'left' }}>
          <column style={{ columnWidth: '50%' }}>
            <div
              className="Information"
              style={{ float: 'left', textAlign: 'left', marginLeft: '5%' }}
            >
              {itemCharacteristics}

              <div className="Buttons" style={{ columnCount: '3' }}>
                <RequestButtons
                  acceptState={this.state.manager_accept}
                  editing={this.state.edit}
                  handleEdit={this.handleEdit}
                  handleAccept={this.handleAccept}
                  handleReject={this.handleReject}
                  handleSaveEdition={this.handleSaveEdition}
                  handleCancelEdition={this.handleCancelEdition}
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
      <PageTitle key={'Request'} title="Request">
        {this.renderItemFields()}
      </PageTitle>
    );
  }
}

export default Request;
