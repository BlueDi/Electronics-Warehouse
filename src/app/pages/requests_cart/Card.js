import React, { Component } from 'react';
import { Card, Divider } from 'semantic-ui-react';

class CardItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.item
    };
  }

  createInfo() {
    const ignore = [
      'count',
      'details',
      'id',
      'image',
      'location',
      'name',
      'properties'
    ];
    var all_info = [];
    for (var info in this.state) {
      if (ignore.indexOf(info) === -1) {
        all_info.push(
          <p key={info}>
            {info}: {this.state[info]}
          </p>
        );
      }
    }
    return all_info;
  }

  createComplexInfo(column_name) {
    var details = [];
    for (var detail in this.state[column_name]) {
      details.push(
        <p key={detail}>
          {detail}: {this.state[column_name][detail]}
        </p>
      );
    }
    return details;
  }

  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>{this.state.name}</Card.Header>
          <Card.Meta>Location: {this.state.location}</Card.Meta>
          <Card.Description>
            {this.createInfo()}
            <Divider />
            {this.createComplexInfo('properties')}
            <Divider />
            {this.createComplexInfo('details')}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>Available: {this.state.free_stock}</Card.Content>
      </Card>
    );
  }
}

export default CardItem;
