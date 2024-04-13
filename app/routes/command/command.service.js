import express from 'express';
import logger from '../../config/log.config.js';
import {fileName} from '../../utilities/file.js';
import response from '../../utilities/response.js';
import requestCode from '../../utilities/response-code.js';
import Command from '../command/command.model.js';
import timeFormat from '../../utilities/time-format.js';
import AppException from '../../utilities/app-exception.js';

const logging = logger(fileName(import.meta.url));

const commandService = {
  /**
   * 
   * @route {GET} /command/:id
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  getCommandByID: async(req, res, next) => {
    try {
      const id = req.params.id;
      logging.info(`Get command by ID: ${id}`);

      const command = await Command.findById(id);
      if(command==undefined) throw new AppException(404, requestCode.db_query_error, `Can't find this ID: ${id}`);
      
      res.status(200).json(new response(requestCode.ok, command.toJSON()));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },

  /**
   * 
   * @route {GET} /command
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  getCommand: async(req, res, next) => {
    try {
      logging.info(`Get recent 30 command`);

      const commands = await Command.find({}).limit(30).sort({date: -1}).exec();
      if(commands==undefined) throw new AppException(404, requestCode.db_query_error, `Can't get command`);
      
      res.status(200).json(new response(requestCode.ok, commands));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },
};

export default commandService;
