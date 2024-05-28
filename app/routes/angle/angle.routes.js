import express from 'express';
import angleService from './angle.service.js';

const angleRoute = express.Router();

angleRoute.post('/angle', angleService.setAngle);
angleRoute.post('/angle/stepper', angleService.setStepper);

export default angleRoute;
