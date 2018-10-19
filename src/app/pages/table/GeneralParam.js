import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Table } from 'semantic-ui-react';
import DescriptionParam from './DescriptionParam';

class GeneralParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      parameter: this.props.parameter,
      value: this.props.value
    };
  }

  render() {
    var value = this.state.value;
    var param = this.state.parameter;

    return (
      <Table.Cell key={param}>
        {value === null ? (
          '-'
        ) : typeof value === 'object' ? (
          <DescriptionParam content={value} />
        ) : (
          <Link to={`/item/${this.state.id}`} style={{ color: 'black' }}>
            {this.state.parameter.match(/image/gi) ? (
              <Image src={this.state.value} size="small" />
            ) : (
              this.state.value
            )}
          </Link>
        )}
      </Table.Cell>
    );
  }
}

export default GeneralParam;
