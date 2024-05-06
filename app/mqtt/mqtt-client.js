import mqtt from 'async-mqtt';

import config from '../config/config.js'

import logger from '../config/log.config.js';
import {fileName} from '../utilities/file.js';

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

      mqttClient.client.on("message", (topic, message) => {
        logging.info(`Receive MQTT topic: ${topic}`);
        logging.info(message);

        // struct SELF_STATE_PACKET
        // {
        //   uint8_t messageType;
        //   uint32_t timestamp_secs;
        //   uint8_t messageId;
        //   int16_t horizontal;
        //   int16_t vertical;
        // };

        const SERVER_CMD_TEST = 0;
        const MCU_RESPONE_TEST = 1;
        const MCU_RESPONE_SELF_STATE = 2;

        const msgType = message.readUInt8(0);
        console.log(msgType);
        switch (msgType) {
          case MCU_RESPONE_SELF_STATE: {
            console.log(message.readUInt32BE(1));
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

  sendCommand: async (msg) => {
    try {
      await mqttClient.client.publish("server/cmd/1", msg, { qos: 0 });
    }
    catch (error){
      logging.error(error);
      console.error(error);
    }
  },


};

export default mqttClient;
