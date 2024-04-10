import express from 'express';

import htmlRoute from './html.routes.js';
import angleRoute from './angle.routes.js';

const api = express.Router()
  .use(angleRoute);

const apiRoute = express.Router().use('/api', api);

export { apiRoute, htmlRoute };
