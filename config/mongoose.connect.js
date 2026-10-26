const mongoose = require('mongoose');
require('dotenv').config();

let mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  try {
    const config = require('config');
    if (config.has('MONGODB_URI')) {
      const baseUri = config.get('MONGODB_URI');
      mongoURI = baseUri.includes('/onlineAuctionSystem') ? baseUri : `${baseUri}/onlineAuctionSystem`;
    }
  } catch (e) {
    mongoURI = 'mongodb://127.0.0.1:27017/onlineAuctionSystem';
  }
}

if (!mongoURI) {
  mongoURI = 'mongodb://127.0.0.1:27017/onlineAuctionSystem';
}

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 3000,
  })
  .then(() => {
    console.log('MongoDB connected successfully to Online Auction System');
  })
  .catch((err) => {
    console.log('MongoDB connection deferred (offline or local fallback):', err.message);
  });

module.exports = mongoose.connection;
