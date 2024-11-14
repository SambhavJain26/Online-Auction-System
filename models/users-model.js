const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  auction: String
});

module.exports = mongoose.model("users", usersSchema);