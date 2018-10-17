import '@babel/polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { hydrate } from 'react-dom';
import { DEV } from '@config';
import registerOffline from './offline';
import routes from './routes';

const render = AppRoutes => {
  hydrate(
    <AppContainer>
      <BrowserRouter>{renderRoutes(AppRoutes)}</BrowserRouter>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(routes);

if (!DEV) {
  registerOffline();
}

if (module.hot) {
  module.hot.accept('./routes', () => {
    const nextAppRoutes = require('./routes').default;
    render(nextAppRoutes);
  });
}
