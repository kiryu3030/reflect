import mqtt from 'async-mqtt';

import config from '../config/config.js'

import logger from '../config/log.config.js';
import {fileName} from '../utilities/file.js';
import { MAX_QUERY, QUERY_SOCKET_DICT, SEND_CMD_TIME_DICT, ANGLE_SOCKET_DICT } from '../utilities/global-state.js';
import WebSocket from '../routes/websocket/websocket-event.js';
import response from '../utilities/response.js';
import requestCode from '../utilities/response-code.js';

const logging = logger(fileName(import.meta.url));

// const client = mqtt.connect(config.mqtt.mqttURL);
// client.subscribe("presence", (err) => {
//   if (!err) {
//     client.publish("presence", "Hello mqtt");
//   }
// });

const mqttClient = {
  /** @type {mqtt.AsyncMqttClient} */
  client: undefined,

  connect: async () => {
    try {
      mqttClient.client = await mqtt.connectAsync(config.mqtt.mqttURL, {username: config.mqtt.user, password: config.mqtt.pw});
      logging.info('Connected to MQTT');

      await mqttClient.client.subscribe('mcu/respone/#', { qos: 0 });

      mqttClient.client.on("message", async (topic, message) => {
        logging.info(`Receive MQTT topic: ${topic}`);
        // logging.info(message);

        // struct MCU_RESPONE_SELF_STATE_PACKET
        // {
        //   uint8_t messageType; 1
        //   uint8_t queryId; 1 
        //   uint8_t stationId; 1
        //   uint32_t horizontal_f; 4
        //   uint32_t vertical_f; 4
        // };

        const SERVER_CMD_TEST = 0;
        const MCU_RESPONE_TEST = 1;
        const MCU_RESPONE_SELF_STATE = 2;
        const MCU_RESPONE_SET_ANGLE = 4;

        const msgType = message.readUInt8(0);
        console.log(msgType);
        switch (msgType) {
          case MCU_RESPONE_SELF_STATE: {
            let queryId = message.readUInt8(1);
            let stationId = message.readUInt8(2);
            let horizontal_f = message.readFloatBE(3);
            let vertical_f = message.readFloatBE(7);
            // console.log(queryId);
            // console.log(stationId);
            // console.log(horizontal_f);
            // console.log(vertical_f);

            WebSocket.sendSelfStateEvent(
              QUERY_SOCKET_DICT[queryId],
              new response(requestCode.ok, {queryId: queryId, horizontal:horizontal_f, vertical:vertical_f}).json())
          } break;

          // struct SERVER_CMD_SET_ANGLE_PACKET
          // {
          //   uint8_t messageType; 1
          //   uint8_t queryId; 1
          //   uint8_t stationId; 1
          //   int16_t horizontal; 2
          //   int16_t vertical; 2
          // };

          case MCU_RESPONE_SET_ANGLE: {
            let queryId = message.readUInt8(1);
            let stationId = message.readUInt8(2);
            let horizontal = message.readInt16BE(3);
            let vertical = message.readInt16BE(5);
            console.log(queryId);
            console.log(stationId);
            console.log(horizontal);
            console.log(vertical);

            WebSocket.sendSelfStateEvent(
              ANGLE_SOCKET_DICT[queryId],
              new response(requestCode.ok, {queryId: queryId, horizontal:horizontal, vertical:vertical}).json())
          } break;
        }
      });

      // await mqttClient.client.publish("mcu/respone", "It works!It works!", { qos: 1 });
      
    }
    catch (error){
      logging.error(error);
      console.error(error);
    }
  },

  state: () => {
    if(mqttClient.client == undefined) return false;
    return mqttClient.client.connected;
  },

  sendCommand: async (stationId, msg) => {
    try {
      // console.log(QUERY_SOCKET_DICT);
      await mqttClient.client.publish(`server/cmd/${stationId}`, msg, { qos: 0 });
    }
    catch (error){
      logging.error(error);
      console.error(error);
    }
  },


};

export default mqttClient;
