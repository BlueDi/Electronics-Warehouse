import React, { Component } from 'react';
import {
  Template,
  TemplatePlaceholder,
  Plugin,
  TemplateConnector
} from '@devexpress/dx-react-core';
import CompareItems from './Compare';
import { AddToCart } from '@common/components';

/**
 * Creates the buttons in the toolbar.
 * One button for compare the selected items.
 * One button to add the selected items to the cart.
 *
 * @param props Array of selected items
 */
const ActionsForSelected = props => {
  if (typeof props !== 'undefined' && props.length > 0) {
    return (
      <React.Fragment>
        <CompareItems items={props} />
        <AddToCart items={props} />
      </React.Fragment>
    );
  } else return <React.Fragment />;
};

/**
 * Plugin to render buttons in the table toolbar.
 *
 * @param selection Array of selected items
 */
class TablePlugins extends Component {
  render() {
    return (
      <Plugin name="TablePlugins">
        <Template name="toolbarContent">
          <TemplatePlaceholder />
          <TemplateConnector>
            {() => ActionsForSelected(this.props.selection)}
          </TemplateConnector>
        </Template>
      </Plugin>
    );
  }
}

export default TablePlugins;
