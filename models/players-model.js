const mongoose = require('mongoose');

const playersSchema = mongoose.Schema({
  name: String,
  description: String,
  auction: String,
  
});

module.exports = mongoose.model("players", playersSchema);