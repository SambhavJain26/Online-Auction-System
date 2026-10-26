const express = require('express');
const router = express.Router();
const {addUser, newHost, newPlayer, logoutHost} = require("../controllers/authController");
const usersModel = require('../models/users-model');
const playerModel = require("../models/players-model");
const upload = require("../utils/multerconfig");
const hostModel = require('../models/host-model');
const { isDbConnected, inMemoryHosts, inMemoryUsers, inMemoryPlayers } = require("../config/dbStore");

router.get("/", async (req, res)=>{
  let host;
  if (isDbConnected()) {
    host = await hostModel.findOne();
  } else {
    host = inMemoryHosts[0];
  }
  res.render("host", { host: host || { hostname: 'Host', profilepic: '0b9008feb2b40826fd553b66.png' } });
});

// Dashboard Functionality here
router.get("/dashboard", (req, res)=>{
  res.render("dashboard");
});

router.get("/adduser", (req, res)=>{
  res.render("hostDashboard/adduser");
});

router.get("/manageusers", async(req, res)=>{
  let users;
  if (isDbConnected()) {
    users = await usersModel.find();
  } else {
    users = inMemoryUsers;
  }
  res.render("hostDashboard/manageUser", { users });
});

router.get("/newhost", (req, res)=>{
  res.render("hostDashboard/newhost");
});

router.get("/newplayer", (req, res)=>{
  res.render("hostDashboard/newplayer");
});

router.get("/manageplayers", async(req, res)=>{
  let impetus, nupl, futsal, nukl;
  if (isDbConnected()) {
    impetus = await playerModel.find({auction: "impetus"});
    nupl = await playerModel.find({auction: "nupl cricket"});
    futsal = await playerModel.find({auction: "futsal"});
    nukl = await playerModel.find({auction: "nukl kabbadi"});
  } else {
    impetus = inMemoryPlayers.filter(p => p.auction === "impetus");
    nupl = inMemoryPlayers.filter(p => p.auction === "nupl cricket");
    futsal = inMemoryPlayers.filter(p => p.auction === "futsal");
    nukl = inMemoryPlayers.filter(p => p.auction === "nukl kabbadi");
  }
  res.render("hostDashboard/manageplayers", {impetus, nupl, futsal, nukl});
});

// Deleting Account
router.get("/deleteuser/:id", async (req, res)=>{
  if (isDbConnected()) {
    await usersModel.findOneAndDelete({_id: req.params.id});
  } else {
    const idx = inMemoryUsers.findIndex(u => String(u._id) === String(req.params.id));
    if (idx !== -1) inMemoryUsers.splice(idx, 1);
  }
  res.redirect("/host/manageusers");
});

router.get("/deleteplayer/:id", async (req, res)=>{
  if (isDbConnected()) {
    await playerModel.findOneAndDelete({_id: req.params.id});
  } else {
    const idx = inMemoryPlayers.findIndex(p => String(p._id) === String(req.params.id));
    if (idx !== -1) inMemoryPlayers.splice(idx, 1);
  }
  res.redirect("/host/manageplayers");
});

// AUCTION ROUTERS LISTED BELOW
router.get("/nupl", async(req, res)=>{
  let nupl = isDbConnected() ? await playerModel.find({auction: "nupl cricket"}) : inMemoryPlayers.filter(p => p.auction === "nupl cricket");
  res.render("hostAuction/nupl", {nupl});
});

router.get("/impetus", async(req, res)=>{
  let impetus = isDbConnected() ? await playerModel.find({auction: "impetus"}) : inMemoryPlayers.filter(p => p.auction === "impetus");
  res.render("hostAuction/impetus", {impetus});
});

router.get("/futsal", async(req, res)=>{
  let futsal = isDbConnected() ? await playerModel.find({auction: "futsal"}) : inMemoryPlayers.filter(p => p.auction === "futsal");
  res.render("hostAuction/futsal", {futsal});
});

router.get("/nukl", async(req, res)=>{
  let nukl = isDbConnected() ? await playerModel.find({auction: "nukl kabbadi"}) : inMemoryPlayers.filter(p => p.auction === "nukl kabbadi");
  res.render("hostAuction/nukl", {nukl});
});
// AUCTION ROUTERS END HERE

router.post("/addnew", upload.single("image"), newPlayer);
router.post("/new", upload.single("image"), newHost);
router.post("/add", upload.single("image"), addUser);
router.get("/logoutHost", logoutHost);

module.exports = router;
