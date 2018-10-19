import React, { Component } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

class WHLoader extends Component {
  render() {
    return (
      <Dimmer active inverted>
        <Loader indeterminate inverted>
          {this.props.text}
        </Loader>
      </Dimmer>
    );
  }
}

export default WHLoader;
