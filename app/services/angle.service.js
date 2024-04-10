import express from 'express';
import logger from '../config/log.config.js';
import {fileName} from '../utilities/file.js';
import response from './response.js';
import requestCode from './response-code.js'
import WebSocket from '../routes/websocket-event.js'

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
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  setAngle: async(req, res, next) => {
    try {
      const { horizontal, vertical } = req.body;
      logging.info(`${horizontal}, ${vertical}`);
      WebSocket.sendTestEvent({horizontal:horizontal, vertical:vertical});
      
      res.status(200).json(new response(requestCode.ok, `setAngle(${horizontal}, ${vertical})`));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },

  /**
   * getAngle
   * @param {Request} req 
   * @param {Response} res 
   */
  getAngle: async(req, res) => {
    try {
      const { horizontal, vertical } = req.body;
      logging.info(`${horizontal}, ${vertical}`);
      
      return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      logging.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
}

export default angleService;
