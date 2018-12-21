import React, { Component } from 'react';
import { Button, Card, Modal } from 'semantic-ui-react';
import CardItem from './Card';

/**
 * Content of the CompareItems modal.
 * Displays a card item for the passed items.
 *
 * @param props Array of items to be compared
 */
const ModalContent = props => (
  <Card.Group centered itemsPerRow={props.length + 1} stackable>
    {props.map((item, i) => (
      <CardItem key={i} item={item} />
    ))}
  </Card.Group>
);

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
        <Modal.Content>{ModalContent(this.props.items)}</Modal.Content>
      </Modal>
    );
  }
}

export default CompareItems;
