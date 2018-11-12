import React, { Component } from 'react';
import { Button, Card, Modal } from 'semantic-ui-react';
import CardItem from './Card';

class CompareItems extends Component {
  render() {
    return (
      <Modal trigger={<Button>Compare Items</Button>}>
        <Modal.Header>Comparison</Modal.Header>
        <Modal.Content>
          <Card.Group centered>
            {this.props.items.map((item, i) => (
              <CardItem key={i} item={item} />
            ))}
          </Card.Group>
        </Modal.Content>
      </Modal>
    );
  }
}

export default CompareItems;
