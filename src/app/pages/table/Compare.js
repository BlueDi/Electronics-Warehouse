import React, { Component } from 'react';
import { Button, Card, Modal } from 'semantic-ui-react';
import CardItem from './Card';

/**
 * Modal to display item comparisons.
 *
 * @param items items that are to be compared
 */
class CompareItems extends Component {
  renderModalContent() {
    return (
      <Card.Group centered itemsPerRow={this.props.items.length + 1} stackable>
        {this.props.items.map((item, i) => (
          <CardItem key={i} item={item} />
        ))}
      </Card.Group>
    );
  }

  render() {
    return (
      <Modal trigger={<Button>Compare Items</Button>}>
        <Modal.Header>Comparison</Modal.Header>
        <Modal.Content>{this.renderModalContent()}</Modal.Content>
      </Modal>
    );
  }
}

export default CompareItems;
