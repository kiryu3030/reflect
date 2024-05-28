import logger from '../../config/log.config.js';
import {fileName} from '../../utilities/file.js';
import { Server } from 'socket.io';

const logging = logger(fileName(import.meta.url));

const WebSocket = {
  /** @type {Server} */
  io: undefined,

  init: (io) => {
    WebSocket.io = io;
  },

  mountEvent: () => {
    WebSocket.io.on('connection', async (socket) => {
      logging.info(`User:${socket.id} connected`);
  
      socket.on('disconnect', () => {
        logging.info(`user:${socket.id} disconnected`);
      });
    });
  },

  sendTestEvent: async (msg) => {
    WebSocket.io.emit('web_respones', msg)
  },

  sendSelfStateEvent: async (socketId, msg) => {
    WebSocket.io.to(socketId).emit('self_state_respones', msg)
  }

};

export default WebSocket;
