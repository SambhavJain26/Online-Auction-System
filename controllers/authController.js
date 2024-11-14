const userModel = require("../models/users-model")
const hostModel = require("../models/host-model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { generateToken } = require("../utils/generateToken")

module.exports.addUser = async (req, res)=>{
  try{
    let{ username, email, password, auction} = req.body;

    let user = await userModel.findOne({email:email})
    if (user) return res.status(401).send("The user's account is already created")

    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(password, salt, async (err, hash)=> {
        if(err) return res.send(err.message)
        else {
          let user = await userModel.create({
            username,
            email,
            password: hash,
            auction
          })
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

    let host = await hostModel.findOne({email:email})
    if (host) return res.status(401).send("The host's account is already created")

    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(password, salt, async (err, hash)=> {
        if(err) return res.send(err.message)
        else {
          let host = await hostModel.updateOne({
            email,
            password: hash,
            hostname
          })
          res.redirect("/host/logout")
        }
      })
    })

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
      res.cookie("token", token);
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
      res.cookie("token", token);
      res.send("you are logged in")
    } else {
      return res.send("Email or Password incorrect")
    }
  })
}

module.exports.logout = (req, res)=>{
  res.cookie("token","")
  res.redirect("/")
}