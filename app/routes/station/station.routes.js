import express from 'express';
import stationService from './station.service.js';

const stationRoute = express.Router();

stationRoute.post('/station', stationService.setStation);
stationRoute.get('/station', stationService.getStations);
stationRoute.get('/station/del/:id', stationService.delStation);
stationRoute.get('/station/:id', stationService.getStation);
stationRoute.post('/station/state', stationService.getStationState);

export default stationRoute;
