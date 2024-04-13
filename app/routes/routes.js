import express from 'express';

import htmlRoute from './html/html.routes.js';
import angleRoute from './angle/angle.routes.js';
import commandRoute from './command/command.routes.js';

import checkDB from '../middleware/check-db.js';

const api = express.Router()
  .use(checkDB)
  .use(angleRoute)
  .use(commandRoute);

const apiRoute = express.Router().use('/api', api);

export { apiRoute, htmlRoute };
