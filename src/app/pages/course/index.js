import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { Authorization } from '@common/components';

class Course extends Component {
  render() {
    return (
      <Authorization param="can_read">
        <Header>
          This is a page only accessible to Managers or Professors.
        </Header>
      </Authorization>
    );
  }
}

export default Course;
