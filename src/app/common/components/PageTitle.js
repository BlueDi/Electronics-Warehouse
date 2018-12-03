import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

const PageTitle = ({ title, children }) => (
  <Fragment>
    <Helmet title={title} />
    {children}
  </Fragment>
);
PageTitle.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};
export default PageTitle;
