import React from 'react';
import Helmet from 'react-helmet';
import flushChunks from 'webpack-flush-chunks';
import { renderToString } from 'react-dom/server';
import { flushChunkNames } from 'react-universal-component/server';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import { minify } from 'html-minifier';
import { CookiesProvider } from 'react-cookie';
import { DEV } from '@config';
import createPage from './page';
import routes from './routes';

// creating page html content with passed elements
function renderPageHtml(elements) {
  let pageHtml = createPage(elements);
  // minify page html for production, programmatically
  if (!DEV) {
    pageHtml = minify(pageHtml, {
      minifyCSS: true,
      minifyJS: true,
      collapseWhitespace: true,
      removeComments: true,
      trimCustomFragments: true
    });
  }
  return pageHtml;
}

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

      // make page redirection when expected `statusCode` and `redirectUrl`
      // props are provided in `HttpStatus` component
      const { statusCode = 200, redirectUrl } = context;

      if ([301, 302].includes(statusCode) && redirectUrl) {
        return res.redirect(statusCode, redirectUrl);
      }

      const helmet = Helmet.renderStatic();
      const { js, styles } = flushChunks(clientStats, {
        chunkNames: flushChunkNames()
      });
      return res.status(statusCode).send(
        renderPageHtml({
          styles,
          js,
          appString,
          helmet
        })
      );
    } catch (err) {
      next(new Error(err));
    }
  };
}
