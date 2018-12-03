import React, { Component } from 'react';
import { PageTitle } from '@common/components';
import { service } from '@utils';
import { withCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { InDepthItemField } from '@pages/inDepthItem/InDepthItemField';
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
      edit: false,
      fetching: true,
      user_id: props.cookies.get('id') || -1,
      user_permissions: -1
    };

    //button handlers
    this.handleAccept = this.handleAccept.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSaveEdition = this.handleSaveEdition.bind(this);
    this.handleCancelEdition = this.handleCancelEdition.bind(this);
    this.handleRequestFieldChange = this.handleRequestFieldChange.bind(this);
  }

  componentDidMount() {
    this.getRole();
    this.getRequestInfo();
    this.getRequestItems();
  }

  getRole() {
    if (this.state.user_id === -1) return;

    const urlGetRole = `/user_permissions/${this.state.user_id}`;
    service
      .get(urlGetRole)
      .then(response => {
        this.setState({ user_permissions: response.data.user_permissions });
      })
      .catch(e => {
        throw e;
      });
  }

  getRequestInfo() {
    const apiUrl = `/request/${this.state.id}`;

    service
      .get(apiUrl)
      .then(response => {
        this.setState(response.data);
      })
      .then(response => {
        console.log(response);
        this.setState({ fetching: false });
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
    let apiUrl = `/none`;
    if (this.state.user_permissions === 2)
      apiUrl = `/request_evaluate_professor`;
    else if (this.state.user_permissions === 3)
      apiUrl = `/request_evaluate_manager`;

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
    let apiUrl = `/none`;
    if (this.state.user_permissions === 2)
      apiUrl = `/request_evaluate_professor`;
    else if (this.state.user_permissions === 3)
      apiUrl = `/request_evaluate_manager`;

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
    this.setState({ workflow: event.target.value });
  }

  renderItemFields() {
    let stateContents = Object.values(this.state);
    stateContents = stateContents.slice(0, stateContents.length - 4);

    let stateFields = Object.keys(this.state);
    stateFields = stateFields.slice(0, stateFields.length - 4);

    let itemCharacteristics = [];

    for (let i = 0; i < stateContents.length; i++) {
      let fieldName = stateFields[i];
      let fieldContent = stateContents[i];
      let changeHandler = this.handleRequestFieldChange;
      if (
        fieldName == 'requester_id' ||
        fieldName == 'professor_id' ||
        fieldName == 'manager_id'
      )
        continue;

      if (!fieldContent) fieldContent = 'N/D';

      fieldName = fieldName.replace(/_/g, ' ');
      fieldName = fieldName.charAt(0).toUpperCase() + fieldName.substr(1);

      itemCharacteristics.push(
        <div>
          <InDepthItemField
            key={fieldName}
            fieldName={fieldName}
            fieldContent={fieldContent}
            editable={fieldName === 'Workflow' && this.state.edit}
            handleChange={changeHandler}
          />
        </div>
      );
    }

    return (
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
                user_permissions={this.state.user_permissions}
                professor_accept={this.state.professor_accept}
              />
            </div>
          </div>
        </column>
      </div>
    );
  }

  render() {
    const {
      user_id,
      requester_id,
      professor_id,
      fetching,
      user_permissions
    } = this.state;
    const is_requester = user_id == requester_id && user_permissions == 0,
      is_professor = user_id == professor_id && user_permissions == 1,
      is_manager = user_permissions == 2;

    return fetching ||
      ((is_requester || is_professor || is_manager) && !fetching) ? (
      <PageTitle key={'Request'} title="Request">
        {this.renderItemFields()}
      </PageTitle>
    ) : (
      <Redirect to="/" />
    );
  }
}

export default withCookies(Request);
