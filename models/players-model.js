const mongoose = require('mongoose');

const playersSchema = mongoose.Schema({
  name: String,
  email: String,
  description: String,
  profilepic: String,
  auction: String,
});

module.exports = mongoose.model("players", playersSchema);