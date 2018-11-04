import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { hydrate } from 'react-dom';
import { DEV } from '@config';
import registerOffline from './offline';
import { CookiesProvider } from 'react-cookie';
import routes from './routes';

const render = routes => {
  hydrate(
    <AppContainer>
      <CookiesProvider>
        <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
      </CookiesProvider>
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
    render(routes);
  });
}
