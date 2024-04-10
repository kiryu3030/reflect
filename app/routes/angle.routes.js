import express from 'express';
import angleService from '../services/angle.service.js';

const angleRoute = express.Router();

angleRoute.post('/angle', angleService.setAngle);

export default angleRoute;
