const express = require('express');
const router = express.Router();
const {addUser,newHost, logout} = require("../controllers/authController");
const usersModel = require('../models/users-model');

router.get("/", (req, res)=>{
  res.render("host")
})

router.get("/dashboard", (req, res)=>{
  res.render("dashboard")
})

router.get("/adduser", (req, res)=>{
  res.render("adduser")
})

router.get("/manageusers", async(req, res)=>{
  let users = await usersModel.find()
  res.render("manageUser", {users})
})

router.get("/newhost", (req, res)=>{
  res.render("newhost")
})

router.get("/delete/:id", async (req, res)=>{
  let users = await usersModel.findOneAndDelete({_id: req.params.id})
  res.redirect("/host/manageusers")
})

router.post("/new", newHost)
router.post("/add", addUser)
router.get("/logout", logout)

module.exports = router;