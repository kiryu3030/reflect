import express from 'express';
import path from 'path';

import {dirName} from '../utilities/file.js';

const __dirname = dirName(import.meta.url);
const HTML_DIR = path.join(__dirname, '..', 'static', 'html');

const htmlRoute = express.Router();

htmlRoute.get('/', (req, res) => {
  res.sendFile(path.join(HTML_DIR, 'index.html'));
});

export default htmlRoute;
