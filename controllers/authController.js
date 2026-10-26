const userModel = require("../models/users-model");
const hostModel = require("../models/host-model");
const playerModel = require("../models/players-model");
const auctionModel = require('../models/auction-model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const { isDbConnected, inMemoryHosts, inMemoryUsers, inMemoryPlayers } = require("../config/dbStore");

module.exports.addUser = async (req, res)=>{
  try{
    let{ username, email, password} = req.body;
    let auctions = [];

    // Extract auctions and budgets
    if (req.body.auction) {
      const selectedAuctions = Array.isArray(req.body.auction) ? req.body.auction : [req.body.auction];
      for (let auction of selectedAuctions) {
        const budgetKey = `budget_${auction}`;
        if (req.body[budgetKey]) {
          auctions.push({
            auction: auction,
            budget: parseFloat(req.body[budgetKey])
          });
        }
      }
    }
    let profilepic = req.file ? req.file.filename : "14840e22c80a1a8cc1be9e77.png";

    if (isDbConnected()) {
      let user = await userModel.findOne({email:email});
      if (user) return res.status(401).send("The user's account is already created");

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      let newUser = await userModel.create({
        username,
        email,
        password: hash,
        profilepic,
        auctions,
      });

      const userId = newUser._id;
      for (let auction of auctions) {
        await auctionModel.findOneAndUpdate(
          { auctionName: auction.auction }, 
          { $addToSet: { users: userId } }, 
          { upsert: true, new: true } 
        );
      }
    } else {
      let existing = inMemoryUsers.find(u => u.email === email);
      if (existing) return res.status(401).send("The user's account is already created");

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const mockId = 'usr_' + Date.now();
      inMemoryUsers.push({
        _id: mockId,
        id: mockId,
        username,
        email,
        password: hash,
        profilepic,
        auctions,
        players: [],
        save: async function () { return this; }
      });
    }

    res.redirect("/host/adduser");
  } catch(err){
    res.send(err.message);
  }
};

module.exports.newHost = async (req, res)=>{
  try{
    let{email, password, hostname} = req.body;
    let profilepic = req.file ? req.file.filename : "0b9008feb2b40826fd553b66.png";

    if (isDbConnected()) {
      let host = await hostModel.findOne({email:email});
      if (host) return res.redirect("/host/newhost");

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await hostModel.updateOne({
        email,
        password: hash,
        hostname,
        profilepic
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      let existing = inMemoryHosts.find(h => h.email === email);
      if (existing) {
        existing.password = hash;
        existing.hostname = hostname;
        existing.profilepic = profilepic;
      } else {
        inMemoryHosts.push({
          _id: 'host_' + Date.now(),
          id: 'host_' + Date.now(),
          email,
          password: hash,
          hostname,
          profilepic
        });
      }
    }

    res.redirect("/host/logoutHost");
  } catch(err){
    res.send(err.message);
  }
};

module.exports.newPlayer = async (req, res)=>{
  try{
    let{name, email, description , auction} = req.body;
    let profilepic = req.file ? req.file.filename : "1a219fbc0ec7d5cb64507c27.jpg";

    if (isDbConnected()) {
      let player = await playerModel.findOne({ email, auction});
      if (player) return res.status(401).send("The player is already added");
    
      await playerModel.create({
        name,
        email,
        description,
        profilepic,
        auction
      });
    } else {
      let existing = inMemoryPlayers.find(p => p.email === email && p.auction === auction);
      if (existing) return res.status(401).send("The player is already added");

      const mockId = 'ply_' + Date.now();
      inMemoryPlayers.push({
        _id: mockId,
        id: mockId,
        name,
        email,
        description,
        profilepic,
        auction
      });
    }

    res.redirect("/host/newplayer");
  } catch(err){
    res.send(err.message);
  }
};

module.exports.loginUser = async (req, res)=>{
  let {email, password} = req.body;
  let user;
  if (isDbConnected()) {
    user = await userModel.findOne({ email: email});
  } else {
    user = inMemoryUsers.find(u => u.email === email);
  }
  if(!user) return res.send("Email or Password incorrect");

  bcrypt.compare(password, user.password, (err, result)=>{
    if(result){
      let token = generateToken(user);
      res.cookie("user_token", token);
      res.redirect("/users");
    } else {
      return res.send("Email or Password incorrect");
    }
  });
};

module.exports.loginHost = async (req, res)=>{
  let {email, password} = req.body;
  let host;
  if (isDbConnected()) {
    host = await hostModel.findOne({ email: email});
  } else {
    host = inMemoryHosts.find(h => h.email === email);
  }
  if(!host) return res.send("Email or Password incorrect");

  bcrypt.compare(password, host.password, (err, result)=>{
    if(result){
      let token = generateToken(host);
      res.cookie("host_token", token);
      res.redirect("/host");
    } else {
      return res.send("Email or Password incorrect");
    }
  });
};

module.exports.logoutHost = (req, res)=>{
  res.cookie("host_token","");
  res.redirect("/");
};

module.exports.logoutUser = (req, res)=>{
  res.cookie("user_token","");
  res.redirect("/");
};
