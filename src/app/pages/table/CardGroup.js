import React from 'react';
import { Card } from 'semantic-ui-react';
import CardItem from './Card';

/**
 * Content of the CompareItems modal.
 * Displays a card item for the passed items.
 *
 * @param props Array of items to be compared
 */
const CardGroup = ({ items }) => (
  <Card.Group centered itemsPerRow={items.length + 1} stackable>
    {items.map((item, i) => (
      <CardItem key={i} item={item} />
    ))}
  </Card.Group>
);

export default CardGroup;
