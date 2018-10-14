import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { renderRoutes } from 'react-router-config';
import { routes } from '@app/routes';
import { WHHeader, WHMenu } from '@pages';
import '@common/styles/global.css';
import { Grid } from 'semantic-ui-react';

class Layout extends Component {
  render() {
    return (
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
    );
  }
}

export default hot(module)(Layout);
