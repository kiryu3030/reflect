import mainApp from './app/app.js';
import logger from './app/config/log.config.js';
import {fileName} from './app/utilities/file.js';

const logging = logger(fileName(import.meta.url));

const PORT = 5000;
mainApp.listen(PORT, () => {
  logging.info(`WebServer is running on port ${PORT}`)
})
