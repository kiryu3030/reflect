import express from 'express';

import response from '../services/response.js';
import requestCode from '../services/response-code.js';

/**
   * 
   * @param {Error} err 
   * @param {express.Request} req 
   * @param {express.Response} res 
   * @param {express.NextFunction} next 
   * @returns 
   */
const errorHandler = (err, req, res, next) => {
  if(err) {
    res.status(500).json(new response(requestCode.error, err.message));
  }
};

export default errorHandler;
