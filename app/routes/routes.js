import express from 'express';

import htmlRoute from './html/html.routes.js';
import angleRoute from './angle/angle.routes.js';
import commandRoute from './command/command.routes.js';
import stationRoute from './station/station.routes.js';

import checkDBAndMQTT from '../middleware/check-db-mqtt.js';

const api = express.Router()
  .use(checkDBAndMQTT)
  .use(angleRoute)
  .use(commandRoute)
  .use(stationRoute);

const apiRoute = express.Router().use('/api', api);

export { apiRoute, htmlRoute };
