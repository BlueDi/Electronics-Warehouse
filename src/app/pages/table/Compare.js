import React, { Component } from 'react';
import { Button, Card, Modal } from 'semantic-ui-react';
import CardItem from './Card';

const ModalContent = props => (
  <Card.Group centered itemsPerRow={props.items.length + 1} stackable>
    {props.items.map((item, i) => (
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
        <Modal.Content>
          <ModalContent items={this.props.items} />
        </Modal.Content>
      </Modal>
    );
  }
}

export default CompareItems;
