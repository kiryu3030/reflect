import express from 'express';
import commandService from './command.service.js'

const commandRoute = express.Router();

commandRoute.get('/command/:id', commandService.getCommandByID);
commandRoute.get('/command', commandService.getCommand);

export default commandRoute;
