const mongoose = require('mongoose');

const hostSchema = mongoose.Schema({
  hostname: String,
  email: String,
  password: String,
  profilepic: String,
});

module.exports = mongoose.model("host", hostSchema)