import React from 'react';
import DocumentTitle from 'react-document-title';
import flushChunks from 'webpack-flush-chunks';
import { renderToString } from 'react-dom/server';
import { flushChunkNames } from 'react-universal-component/server';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import routes from './routes';

// export default server renderer and receiving stats
// also, should allow it to be mounted as middleware for production usage
export default function serverRenderer({ clientStats }) {
  return async (req, res, next) => {
    try {
      const context = {};

      const appString = renderToString(
        <CookiesProvider cookies={req.universalCookies}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </CookiesProvider>
      );

      const pageTitle = DocumentTitle.rewind();
      const chunksOptions = { chunkNames: flushChunkNames() };
      const { js, styles } = flushChunks(clientStats, chunksOptions);

      const { statusCode = 200, redirectUrl } = context;

      // make page redirection when expected `statusCode` and `redirectUrl`
      // props are provided in `HttpStatus` component
      if ([301, 302].includes(statusCode) && redirectUrl) {
        return res.redirect(statusCode, redirectUrl);
      }

      return res.status(statusCode).render('index', {
        pageTitle,
        appString,
        styles,
        js
      });
    } catch (err) {
      next(new Error(err));
    }
  };
}
