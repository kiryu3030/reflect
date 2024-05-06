import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

import logger from './config/log.config.js';
import { fileName, dirName } from './utilities/file.js';

import { apiRoute, htmlRoute } from './routes/routes.js'

import errorHandler from './middleware/error-handler.js';

import mongoose from 'mongoose';
import connectDB from './database/database.js'

import mqttClient from './mqtt/mqtt-client.js';

const __dirname = dirName(import.meta.url);
const logging = logger(fileName(import.meta.url));

const app = express();

connectDB();

mqttClient.connect();

app.use(cors());
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(apiRoute);
app.use(htmlRoute);

app.use(errorHandler);

const mainApp = createServer(app);
const io = new Server(mainApp, {cors: {origin: "*" }});

import WebSocket from './routes/websocket/websocket-event.js';
WebSocket.init(io);
WebSocket.mountEvent();

export default mainApp;
