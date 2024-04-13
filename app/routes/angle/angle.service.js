import express from 'express';
import logger from '../../config/log.config.js';
import {fileName} from '../../utilities/file.js';
import response from '../../utilities/response.js';
import requestCode from '../../utilities/response-code.js'
import WebSocket from '../websocket/websocket-event.js'
import Command from '../command/command.model.js'
import timeFormat from '../../utilities/time-format.js'

const logging = logger(fileName(import.meta.url));

// /**
//  * Represents a book.
//  * constructor
//  * param {Request} req - The title of the book.
//  * param {Response} res - The author of the book.
//  */

const angleService = {

  /**
   * setAngle
   * @route {POST} /angle
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  setAngle: async(req, res, next) => {
    try {
      const { horizontal, vertical } = req.body;
      logging.info(`${horizontal}, ${vertical}`);

      const command = new Command({
        horizontal: horizontal,
        vertical: vertical,
        date: timeFormat(),
      })
      await command.save();

      WebSocket.sendTestEvent({horizontal:horizontal, vertical:vertical});
      
      res.status(200).json(new response(requestCode.ok, `setAngle(${horizontal}, ${vertical})`));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },

  /**
   * setAngle
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  getAngle: async(req, res, next) => {
    try {
      const { horizontal, vertical } = req.body;
      logging.info(`${horizontal}, ${vertical}`);

      const command = new Command({
        horizontal: horizontal,
        vertical: vertical,
        date: timeFormat(),
      })
      await command.save();
      console.log(command._id.toString());
      

      WebSocket.sendTestEvent({horizontal:horizontal, vertical:vertical});
      
      res.status(200).json(new response(requestCode.ok, `setAngle(${horizontal}, ${vertical})`));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },
}

export default angleService;
