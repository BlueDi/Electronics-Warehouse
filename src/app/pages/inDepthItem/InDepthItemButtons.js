import React from 'react';
import { Button } from 'semantic-ui-react';
import '@common/styles/global.css';
import './styles/InDepthItem.scss';

export function InDepthItemButtons(props) {
  const requestButton = (
    <div className="RequestButton" style={{ textAlign: 'right' }}>
      <Button
        onClick={props.handleRequest}
        style={{
          backgroundColor: '#89DF89',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '0px'
        }}
      >
        Request
      </Button>
    </div>
  );

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

  return (
    <div>
      {!props.editing && requestButton}
      {!props.editing && editButton}
      {props.editing && cancelButton}
      {props.editing && acceptButton}
    </div>
  );
}
