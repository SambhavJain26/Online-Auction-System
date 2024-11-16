const express = require('express');
const router = express.Router();
const {addUser,newHost,newPlayer, logoutHost} = require("../controllers/authController");
const usersModel = require('../models/users-model');
const playerModel = require("../models/players-model")

router.get("/", (req, res)=>{
  res.render("host")
})

// Dashboard Functionality here //
router.get("/dashboard", (req, res)=>{
  res.render("dashboard")
})
router.get("/adduser", (req, res)=>{
  res.render("hostDashboard/adduser")
})
router.get("/manageusers", async(req, res)=>{
  let users = await usersModel.find()
  res.render("hostDashboard/manageUser", {users})
})
router.get("/newhost", (req, res)=>{
  res.render("hostDashboard/newhost")
})
router.get("/newplayer", (req, res)=>{
  res.render("hostDashboard/newplayer")
})
router.get("/manageplayers", async(req, res)=>{
  let impetus = await playerModel.find({auction: "impetus"})
  let nupl = await playerModel.find({auction: "nupl cricket"})
  let futsal = await playerModel.find({auction: "futsal"})
  let nukl = await playerModel.find({auction: "nukl kabbadi"})
  res.render("hostDashboard/manageplayers", {impetus, nupl, futsal, nukl})
})

// Deleting Account//
router.get("/deleteuser/:id", async (req, res)=>{
  let users = await usersModel.findOneAndDelete({_id: req.params.id})
  res.redirect("/host/manageusers")
})
router.get("/deleteplayer/:id", async (req, res)=>{
  let players = await playerModel.findOneAndDelete({_id: req.params.id})
  res.redirect("/host/manageplayers")
})



// AUCTION ROUTERS LISTED BELOW //

router.get("/nupl", async(req, res)=>{
  let nupl = await playerModel.find({auction: "nupl cricket"})
  res.render("hostAuction/nupl", {nupl})
})
router.get("/impetus", async(req, res)=>{
  let impetus = await playerModel.find({auction: "impetus"})
  res.render("hostAuction/impetus", {impetus})
})
router.get("/futsal", async(req, res)=>{
  let futsal = await playerModel.find({auction: "futsal"})
  res.render("hostAuction/futsal", {futsal})
})
router.get("/nukl", async(req, res)=>{
  let nukl = await playerModel.find({auction: "nukl kabbadi"})
  res.render("hostAuction/nukl", {nukl})
})

// AUCTION ROUTERS END HERE //

router.post("/addnew", newPlayer)
router.post("/new", newHost)
router.post("/add", addUser)
router.get("/logoutHost", logoutHost)

module.exports = router;