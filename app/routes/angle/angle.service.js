import express from 'express';
import logger from '../../config/log.config.js';
import {fileName} from '../../utilities/file.js';
import response from '../../utilities/response.js';
import requestCode from '../../utilities/response-code.js'
import WebSocket from '../websocket/websocket-event.js'
import Command from '../command/command.model.js'
import timeFormat from '../../utilities/time-format.js'
import mqttClient from '../../mqtt/mqtt-client.js';
import { MAX_QUERY, QUERY_SOCKET_DICT, SEND_CMD_TIME_DICT, ANGLE_SOCKET_DICT } from '../../utilities/global-state.js';

const logging = logger(fileName(import.meta.url));

// /**
//  * Represents a book.
//  * constructor
//  * param {Request} req - The title of the book.
//  * param {Response} res - The author of the book.
//  */

let ANGLE_ID = 0;

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
      const { socketId, stationId, horizontal, vertical } = req.body;
      logging.info(`${socketId}, ${stationId}, ${horizontal}, ${vertical}`);

      const command = new Command({
        stationId: stationId,
        horizontal: horizontal,
        vertical: vertical,
        date: timeFormat(),
      })
      await command.save();

      let queryId = ANGLE_ID%MAX_QUERY;
      ANGLE_SOCKET_DICT[queryId] = socketId;
      ANGLE_ID += 1;
      // console.log(ANGLE_SOCKET_DICT);

      let SERVER_CMD_SET_ANGLE =  5;
      // struct SERVER_CMD_SET_ANGLE_PACKET
      // {
      //   uint8_t messageType; 1
      //   uint8_t queryId; 1
      //   uint8_t stationId; 1
      //   int16_t horizontal; 2
      //   int16_t vertical; 2
      // };
      const SERVER_CMD_SET_ANGLE_LEN = 7;
      const buf = Buffer.allocUnsafe(SERVER_CMD_SET_ANGLE_LEN);
      buf.writeUint8(SERVER_CMD_SET_ANGLE, 0);
      buf.writeUint8(queryId, 1);
      buf.writeUint8(stationId, 2);
      buf.writeInt16BE(horizontal, 3);
      buf.writeInt16BE(vertical, 5);
      console.log(buf);
      mqttClient.sendCommand(stationId, buf);

      // WebSocket.sendTestEvent({horizontal:horizontal, vertical:vertical});
      
      // mqttClient.sendCommand(`horizontal: ${horizontal}, vertical: ${vertical}`);
      
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
      // console.log(command._id.toString());
      

      WebSocket.sendTestEvent({horizontal:horizontal, vertical:vertical});
      
      res.status(200).json(new response(requestCode.ok, `setAngle(${horizontal}, ${vertical})`));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },

  /**
   * setStepper
   * @route {POST} /angle/stepper
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  setStepper: async(req, res, next) => {
    try {
      const { socketId, stationId, horizontalStep, verticalStep } = req.body;
      logging.info(`${socketId}, ${stationId}, ${horizontalStep}, ${verticalStep}`);

      let queryId = ANGLE_ID%MAX_QUERY;
      ANGLE_SOCKET_DICT[queryId] = socketId;
      ANGLE_ID += 1;
      // console.log(ANGLE_SOCKET_DICT);

      let SERVER_CMD_TEST_STEPPER = 7;
      // struct SERVER_CMD_TEST_STEPPER_PACKET
      // {
      //   uint8_t messageType; 1
      //   uint8_t queryId; 1
      //   uint8_t stationId; 1
      //   int16_t horizontalStep; 2
      //   int16_t verticalStep; 2
      // };
      const SERVER_CMD_TEST_STEPPER_LEN = 7;
      const buf = Buffer.allocUnsafe(SERVER_CMD_TEST_STEPPER_LEN);
      buf.writeUint8(SERVER_CMD_TEST_STEPPER, 0);
      buf.writeUint8(queryId, 1);
      buf.writeUint8(stationId, 2);
      buf.writeInt16BE(horizontalStep, 3);
      buf.writeInt16BE(verticalStep, 5);
      console.log(buf);
      mqttClient.sendCommand(stationId, buf);
      
      res.status(200).json(new response(requestCode.ok, `setStepper(${horizontalStep}, ${verticalStep})`));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },
}

export default angleService;
