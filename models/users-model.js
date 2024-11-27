const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  auctions: [
    {auction: String,
      budget: Number}
    ],
  profilepic: String,
  players: [{type: mongoose.Schema.Types.ObjectId, ref:"players"}]
});

module.exports = mongoose.model("users", usersSchema);