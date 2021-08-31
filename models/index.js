const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.set('returnOriginal', false);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

module.exports.User = require('./user');
