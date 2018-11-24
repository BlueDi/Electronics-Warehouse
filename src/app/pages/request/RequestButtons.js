import React from 'react';
import { Button } from 'semantic-ui-react';
import '@common/styles/global.css';
import './styles/InDepthItem.scss';

export function RequestButtons(props) {
  let editButton = (
    <div className="EditButton" style={{ textAlign: 'left' }}>
      <Button
        onClick={props.handleEdit}
        style={{
          backgroundColor: '#7bbfe8',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '0px'
        }}
      >
        Edit
      </Button>
    </div>
  );

  let cancelButton = (
    <div className="CancelButton" style={{ textAlign: 'left' }}>
      <Button
        onClick={props.handleCancel}
        style={{
          backgroundColor: '#D2E0E8',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '0px'
        }}
      >
        Cancel
      </Button>
    </div>
  );

  let saveButton = (
    <div className="SaveButton" style={{ textAlign: 'left' }}>
      <Button
        onClick={props.handleCancel}
        style={{
          backgroundColor: '#D2E0E8',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '0px'
        }}
      >
        Cancel
      </Button>
    </div>
  );

  let acceptButton = (
    <div className="AcceptButton" style={{ textAlign: 'left' }}>
      <Button
        onClick={props.handleAccept}
        style={{
          backgroundColor: '#52e852',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '0px'
        }}
      >
        Accept
      </Button>
    </div>
  );

  let rejectButton = (
    <div className="RejectButton" style={{ textAlign: 'left' }}>
      <Button
        onClick={props.handleAccept}
        style={{
          backgroundColor: '#e85252',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '0px'
        }}
      >
        Reject
      </Button>
    </div>
  );

  return (
    <div>
      {!props.editing && acceptButton}
      {!props.editing && rejectButton}
      {!props.editing && editButton}
      {props.editing && cancelButton}
      {props.editing && saveButton}
    </div>
  );
}
