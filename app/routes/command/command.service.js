import express from 'express';
import logger from '../../config/log.config.js';
import {fileName} from '../../utilities/file.js';
import response from '../../utilities/response.js';
import requestCode from '../../utilities/response-code.js';
import Command from '../command/command.model.js';
import timeFormat from '../../utilities/time-format.js';
import AppException from '../../utilities/app-exception.js';

import mqttClient from '../../mqtt/mqtt-client.js';

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
      // #define SERVER_CMD_TEST 0x0
      // #define MCU_RESPONE_TEST 0x1

      // struct SERVER_CMD_PACKET
      // {
      //   uint8_t messageType;
      //   uint32_t timestamp_secs;
      //   uint8_t messageId;
      //   int16_t horizontal;
      //   int16_t vertical;
      // };
      // logging.info(`Get command by ID: ${id}`);
      let SERVER_CMD_PACKET = {
        0: 1,
        1: 4,
        2: 2,
        3: 2
      }

      // const command = await Command.findById(id);
      // if(command==undefined) throw new AppException(404, requestCode.db_query_error, `Can't find this ID: ${id}`);

      // mqttClient.sendCommand(`id: ${id}`);
      
      // res.status(200).json(new response(requestCode.ok, command.toJSON()));
      // const SERVER_CMD_PACKET_LEN = 10;
      // const buf = Buffer.allocUnsafe(SERVER_CMD_PACKET_LEN);
      // buf.writeUint8(0, 0);
      // buf.writeUInt32BE(1714990934, 1);
      // buf.writeUint8(30, 5);
      // buf.writeInt16BE(140, 6);
      // buf.writeInt16BE(-55, 8);
      // console.log(buf);
      // mqttClient.sendCommand(buf);

      res.status(200).json(new response(requestCode.ok, "command.toJSON()"));
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
      // logging.info(`Get recent 30 command`);

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
