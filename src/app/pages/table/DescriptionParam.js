import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

class DescriptionParam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: this.props.content
    };
  }

  mount_content() {
    var organized_content = [];
    for (var param in this.state.content) {
      organized_content.push(
        <Grid.Row key={param}>
          {param + ': ' + this.state.content[param]}
        </Grid.Row>
      );
    }
    return organized_content;
  }

  render() {
    return (
      <Grid celled="internally" textAlign="center">
        {this.mount_content()}
      </Grid>
    );
  }
}

export default DescriptionParam;
