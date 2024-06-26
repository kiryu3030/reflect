import express from 'express';
import mongoose from 'mongoose';

import AppException from '../utilities/app-exception.js';
import requestCode from '../utilities/response-code.js';

import logger from '../config/log.config.js';
import {fileName} from '../utilities/file.js';

import mqttClient from '../mqtt/mqtt-client.js';

const logging = logger(fileName(import.meta.url));

const ConnectionStates = {
  disconnected: 0,
  connected: 1,
  connecting: 2,
  disconnecting: 3,
  uninitialized: 99,
}

/**
   * 
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   * @returns 
   */
const checkDBAndMQTT = (req, res, next) => {
  try{
    if(mongoose.connection.readyState!=ConnectionStates.connected){
      throw new AppException(500, requestCode.db_error, `DB not ready or disconnected. State:${mongoose.connection.readyState}`);
    }
    else if(!mqttClient.state()){
      mqttClient.connect();
      throw new AppException(500, requestCode.mqtt_error, `MQTT not ready or disconnected.`);
    }
    else next();
  }
  catch(error){
    logging.error(error);
    next(error);
  }
};

export default checkDBAndMQTT;
