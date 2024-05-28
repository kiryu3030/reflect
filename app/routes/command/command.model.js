import mongoose from 'mongoose';
import timeFormat from '../../utilities/time-format.js'

const { Schema } = mongoose;

const commandSchema = new Schema({
  stationId: { type: String, default: 'unknown'},
  horizontal: { type: Number, required: true },
  vertical: { type: Number, required: true },
  state: { type: String, default: 'unknown' },
  date: { type: String, default: timeFormat() }
});

const Command = mongoose.model('command', commandSchema);

export default Command;
