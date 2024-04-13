import mongoose from 'mongoose';
import config from '../config/config.js'

import logger from '../config/log.config.js';
import {fileName} from '../utilities/file.js';

const logging = logger(fileName(import.meta.url));

// mongoose.connect(config.mongoURL).catch((error) => logging.error(error));
const connectDB = async () => {
  try{
    mongoose.connection.on('connected', () => logging.info('Connected to mongoDB.'));

    mongoose.connection.on('error', (error) => logging.error(error));

    await mongoose.connect(config.database.mongoURL);
  }
  catch(error){
    // logging.error(error)
  }
};

export default connectDB;
