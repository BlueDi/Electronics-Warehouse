import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { renderRoutes } from 'react-router-config';
import { withCookies } from 'react-cookie';
import { HELMET } from '@config';
import { routes } from '@app/routes';
import { WHHeader, WHMenu } from '@pages';
import '@common/styles/global.css';
import { Grid } from 'semantic-ui-react';

class Root extends Component {
  render() {
    return (
      <React.Fragment>
        <Helmet {...HELMET} />
        <Grid stretched style={{ height: '100vh' }}>
          <Grid.Row style={{ height: '10%' }}>
            <Grid.Column width={16}>
              <WHHeader />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ height: '90%', padding: '0px' }}>
            <Grid.Column width={16}>
              <WHMenu key={'menu'} content={renderRoutes(routes)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default hot(module)(withCookies(Root));
