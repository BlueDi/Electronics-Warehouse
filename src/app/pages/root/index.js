import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { hot } from 'react-hot-loader';
import { renderRoutes } from 'react-router-config';
import { withCookies } from 'react-cookie';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { Grid } from 'semantic-ui-react';
import { HELMET } from '@config';
import { routes } from '@app/routes';
import { WHHeader, WHMenu } from '@pages';
import '@common/styles/global.css';
import background from '@assets/images/background.png';

const options = {
  type: 'success',
  position: 'bottom center',
  timeout: 3000,
  offset: '5px'
};

const background_style = {
  backgroundImage: `url(${background})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  height: '90%',
  padding: '0px'
};

class Root extends Component {
  render() {
    return (
      <AlertProvider template={AlertTemplate} {...options}>
        <Helmet {...HELMET} />
        <Grid stretched style={{ height: '100vh' }}>
          <Grid.Row style={{ height: '10%' }}>
            <Grid.Column width={16}>
              <WHHeader />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={background_style}>
            <Grid.Column width={16}>
              <WHMenu key={'menu'} content={renderRoutes(routes)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </AlertProvider>
    );
  }
}

export default hot(module)(withCookies(Root));
