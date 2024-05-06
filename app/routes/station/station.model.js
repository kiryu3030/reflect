import mongoose from 'mongoose';
import timeFormat from '../../utilities/time-format.js'

const { Schema } = mongoose;

const stationSchema = new Schema({
  stationName: { type: String, required: true },
  stationId: { type: String, required: true },
  comment: { type: String, default: '' },
  date: { type: String, default: timeFormat() }
});

const Station = mongoose.model('station', stationSchema);

export default Station;
