import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import CardGroup from './CardGroup';

/**
 * Modal to display item comparisons.
 *
 * @param items items that are to be compared
 */
class CompareItems extends Component {
  render() {
    return (
      <Modal trigger={<Button>Compare Items</Button>}>
        <Modal.Header>Comparison</Modal.Header>
        <Modal.Content>{CardGroup(this.props)}</Modal.Content>
      </Modal>
    );
  }
}

export default CompareItems;
