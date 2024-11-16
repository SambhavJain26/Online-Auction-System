const mongoose = require('mongoose');

const playersSchema = mongoose.Schema({
  name: String,
  email: String,
  description: String,
  auction: String,
  user: {type: mongoose.Schema.Types.ObjectId, ref:"users"}
});

module.exports = mongoose.model("players", playersSchema);