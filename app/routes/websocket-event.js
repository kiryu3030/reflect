import {io} from '../app.js'
import logger from '../config/log.config.js';
import {fileName} from '../utilities/file.js';
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
  }
};

// /**
//  * Mount socket.io event.
//  * @param {Server} io 
//  */
// function mountEvent(io){
//   io.on('connection', async (socket) => {
//     logging.info(`User:${socket.id} connected`);

//     socket.on('disconnect', () => {
//       logging.info(`user:${socket.id} disconnected`);
//     });


//   });
// }

// class WebSocket{
//   /**
//    * socket.io Server
//    * @param {Server} io 
//    */
//   constructor(io){
//     this.io = io;
//   }

  
// }

// export default mountEvent;
export default WebSocket;
