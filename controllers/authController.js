const userModel = require("../models/users-model")
const hostModel = require("../models/host-model")
const playerModel = require("../models/players-model")
const auctionModel = require('../models/auction-model');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { generateToken } = require("../utils/generateToken")

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
    let profilepic = req.file.filename;
    let user = await userModel.findOne({email:email})
    if (user) return res.status(401).send("The user's account is already created")

    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(password, salt, async (err, hash)=> {
        if(err) return res.send(err.message)
        else {
          let newUser = await userModel.create({
            username,
            email,
            password: hash,
            profilepic,
            auctions,
          })

          const userId = newUser._id;

          for (let auction of auctions) {
            await auctionModel.findOneAndUpdate(
              { auctionName: auction.auction }, 
              { $addToSet: { users: userId } }, 
              { upsert: true, new: true } 
            );
          }

          res.redirect("/host/adduser")
        }
      })
    })

  } catch(err){
    res.send(err.message);
  }
}

module.exports.newHost = async (req, res)=>{
  try{
    let{email, password, hostname} = req.body;
    let profilepic = req.file.filename;
    let host = await hostModel.findOne({email:email})
    if (host) return res.redirect("/host/newhost")

    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(password, salt, async (err, hash)=> {
        if(err) return res.send(err.message)
        else {
          let host = await hostModel.updateOne({
            email,
            password: hash,
            hostname,
            profilepic
          })
          res.redirect("/host/logout")
        }
      })
    })

  } catch(err){
    res.send(err.message);
  }
}

module.exports.newPlayer = async (req, res)=>{
  try{
    let{name, email, description , auction} = req.body;
    let profilepic = req.file.filename;
    let player = await playerModel.findOne({ email, auction});
    if (player) return res.status(401).send("The player is already added")
  
    let players = await playerModel.create({
            name,
            email,
            description,
            profilepic,
            auction
    })
    res.redirect("/host/newplayer")
      
  } catch(err){
    res.send(err.message);
  }
}

module.exports.loginUser = async (req, res)=>{
  let {email, password} = req.body;
  let user = await userModel.findOne({ email: email})
  if(!user) return res.send("Email or Password incorrect")

  bcrypt.compare(password, user.password, (err, result)=>{
    if(result){
      let token = generateToken(user)
      res.cookie("user_token", token);
      res.redirect("/users")
    } else {
      return res.send("Email or Password incorrect")
    }
  })
}

module.exports.loginHost = async (req, res)=>{
  let {email, password} = req.body;
  let host = await hostModel.findOne({ email: email})
  if(!host) return res.send("Email or Password incorrect")

  bcrypt.compare(password, host.password, (err, result)=>{
    if(result){
      let token = generateToken(host)
      res.cookie("host_token", token);
      res.redirect("/host")
    } else {
      return res.send("Email or Password incorrect")
    }
  })
}

module.exports.logoutHost = (req, res)=>{
  res.cookie("host_token","")
  res.redirect("/")
}

module.exports.logoutUser = (req, res)=>{
  res.cookie("user_token","")
  res.redirect("/")
}

