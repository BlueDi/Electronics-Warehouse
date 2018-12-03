import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { TableSelection } from '@devexpress/dx-react-grid-material-ui';
import { AddToCart } from '@common/components';

class SelectComponent extends Component {
  renderAddToCart() {
    var { row } = this.props;
    var cleanRow = Object.create(row);
    delete cleanRow.image;
    return <AddToCart items={[cleanRow]} simple />;
  }

  render() {
    var { cookies } = this.props;
    var pseudoProps = { ...this.props };
    delete pseudoProps['style'];
    var canRequest = cookies.get('can_request') === 'true';
    return canRequest ? (
      <td>
        <TableSelection.Cell
          style={{ borderBottomWidth: '0px' }}
          {...pseudoProps}
        />
        {this.renderAddToCart()}
      </td>
    ) : (
      <TableSelection.Cell {...this.props} />
    );
  }
}

export default withCookies(SelectComponent);
