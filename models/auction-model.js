const mongoose = require('mongoose');

const auctionTimingSchema = mongoose.Schema({
  auctionName: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }] 
});

module.exports = mongoose.model('auctions', auctionTimingSchema);
