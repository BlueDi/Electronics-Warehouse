import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { TableSelection } from '@devexpress/dx-react-grid-material-ui';
import { AddToCart } from '@common/components';

class SelectComponent extends Component {
  render() {
    var { cookies, row, selected, onToggle } = this.props;
    var canRequest = cookies.get('can_request') === 'true';
    var cleanRow = Object.create(row);
    delete cleanRow.image;
    return (
      <React.Fragment>
        {canRequest ? (
          <td>
            <AddToCart items={[cleanRow]} simple />
          </td>
        ) : null}
        <TableSelection.Cell
          row={row}
          selected={selected}
          onToggle={onToggle}
        />
      </React.Fragment>
    );
  }
}

export default withCookies(SelectComponent);
