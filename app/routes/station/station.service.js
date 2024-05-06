import express from 'express';
import logger from '../../config/log.config.js';
import {fileName} from '../../utilities/file.js';
import response from '../../utilities/response.js';
import requestCode from '../../utilities/response-code.js';
import AppException from '../../utilities/app-exception.js';
import Station from './station.model.js';
import timeFormat from '../../utilities/time-format.js';

const logging = logger(fileName(import.meta.url));

const stationService = {
  /**
   * 
   * @route {POST} /station
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  setStation: async(req, res, next) => {
    try {
      const { stationName, stationId, comment } = req.body;
      logging.info(`${stationName}, ${stationId}, ${comment}`);

      const station = new Station({
        stationName: stationName,
        stationId: stationId,
        comment: comment,
        date: timeFormat(),
      })
      await station.save();

      res.status(200).json(new response(requestCode.ok, `setStation(${stationName}, ${stationId}, ${comment})`));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },

  /**
   * 
   * @route {GET} /station
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  getStations: async(req, res, next) => {
    try {
      const { offset, limit } = req.query;
      const stations = await Station.find({}).exec();
      // TODO: 改成只查詢一次
      const stationsOffset = await Station.find({}).skip(offset).limit(limit).sort({date: 1}).exec();
      let tableData = {
        total: stations.length,
        totalNotFiltered: stations.length,
        rows: stationsOffset
      }

      res.status(200).json(new response(requestCode.ok, tableData));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },

  /**
   * 
   * @route {GET} /station/del/:id
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  delStation: async(req, res, next) => {
    try {
      const id = req.params.id;
      await Station.findByIdAndDelete(id);
      
      res.status(200).json(new response(requestCode.ok, 'del'));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },

  /**
   * 
   * @route {GET} /station/:id
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  getStation: async(req, res, next) => {
    try {
      const id = req.params.id;
      const station = await Station.findById(id);
      if(station==undefined) throw new AppException(404, requestCode.db_query_error, `Can't find this ID: ${id}`);
      
      res.status(200).json(new response(requestCode.ok, station.toJSON()));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },

  /**
   * 
   * @route {POST} /station/state
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   */
  getStationState: async(req, res, next) => {
    try {
      // class SelfStatePacket {
      //   socketId = "";
      //   stationId = "";
      
      //   json(){
      //     return {
      //       socketId: this.socketId,
      //       stationId: this.stationId
      //     }
      //   }
      // }
      const { socketId, stationId } = req.body;
      
      res.status(200).json(new response(requestCode.ok, "station.toJSON()"));
    } catch (error) {
      logging.error(error);
      next(error);
    }
  },
};

export default stationService;
