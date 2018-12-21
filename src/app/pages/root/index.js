import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { renderRoutes } from 'react-router-config';
import { withCookies } from 'react-cookie';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { HELMET } from '@config';
import { routes } from '@app/routes';
import { WHHeader } from '@pages';
import '@common/styles/global.css';
import { Grid } from 'semantic-ui-react';

const options = {
  type: 'success',
  position: 'bottom center',
  timeout: 3000,
  offset: '5px'
};

const body_style = {
  height: '90%',
  paddingLeft: '2%',
  paddingRight: '2%'
};

const Layout = () => (
  <Grid stretched style={{ height: '100%' }}>
    <Grid.Row style={{ height: '10%' }}>
      <Grid.Column>
        <WHHeader />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row style={body_style}>
      <Grid.Column>{renderRoutes(routes)}</Grid.Column>
    </Grid.Row>
  </Grid>
);

/**
 * Base of the app.
 * First component to be called.
 */
class Root extends Component {
  render() {
    return (
      <AlertProvider template={AlertTemplate} {...options}>
        <Helmet {...HELMET} />
        <Layout />
      </AlertProvider>
    );
  }
}

export { Layout };
export default hot(module)(withCookies(Root));
