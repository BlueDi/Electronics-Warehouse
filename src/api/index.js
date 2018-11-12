import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cookiesMiddleware from 'universal-cookie-express';
import { ENV } from '@config';
import { logger, errorHandler } from '@middlewares/express';
import routers from './routers';

const api = express();

api
  .use(logger.http())
  .use(helmet())
  .use(cookiesMiddleware())
  .use(express.json())
  .use(express.urlencoded({ extended: true, limit: '10mb' }), hpp())
  .use(`/api/${ENV['API_VERSION']}`, routers);

// mount error handler middleware last
api.use(errorHandler({ json: true }));

export default api;
