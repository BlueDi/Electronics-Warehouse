import React, { Component } from 'react';
import {
  Template,
  TemplatePlaceholder,
  Plugin,
  TemplateConnector
} from '@devexpress/dx-react-core';
import CompareItems from './Compare';
import { AddToCart } from '@common/components';

const ActionsForSelected = props => {
  const { selection } = props;
  if (typeof selection !== 'undefined' && selection.length > 0) {
    return (
      <React.Fragment>
        <CompareItems items={selection} />
        <AddToCart items={selection} />
      </React.Fragment>
    );
  } else return <React.Fragment />;
};

class TablePlugins extends Component {
  render() {
    return (
      <Plugin name="TablePlugins">
        <Template name="toolbarContent">
          <TemplatePlaceholder />
          <TemplateConnector>
            {() => ActionsForSelected(this.props)}
          </TemplateConnector>
        </Template>
      </Plugin>
    );
  }
}

export default TablePlugins;
