const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
