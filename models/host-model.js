const mongoose = require('mongoose');

const hostSchema = mongoose.Schema({
  hostname: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("host", hostSchema)