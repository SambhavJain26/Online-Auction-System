const express = require('express');
const router = express.Router();
const {logoutUser} = require("../controllers/authController");
const usersModel = require('../models/users-model');

router.get("/", async (req, res)=>{
  try {
    const userId = req.user.id; 
    const user = await usersModel.findById(userId); 

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render('users', { 
      user, 
      associatedAuctions: user.auctions.map(a => a.auction) 
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).send("Internal Server Error");
  }
})

//Your Picks Routes
router.get("/yourPicks", async (req, res)=>{
  res.render("yourPicks")
})
router.get("/nuplPicks", async(req, res)=>{
  const userId = req.user.id; 
  try {
    const user = await usersModel.findById(userId).populate("players");
    const nuplPlayers = user.players.filter(player => player.auction === 'nupl cricket');

    res.render("userPicks/nuplPicks", { players: nuplPlayers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})
router.get("/impetusPicks", async(req, res)=>{
  const userId = req.user.id; 
  try {
    const user = await usersModel.findById(userId).populate("players");
    const impetusPlayers = user.players.filter(player => player.auction === 'impetus');

    res.render("userPicks/impetusPicks", { players: impetusPlayers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})
router.get("/futsalPicks", async(req, res)=>{
  const userId = req.user.id; 
  try {
    const user = await usersModel.findById(userId).populate("players");
    const futsalPlayers = user.players.filter(player => player.auction === 'futsal');

    res.render("userPicks/futsalPicks", { players: futsalPlayers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})
router.get("/nuklPicks", async(req, res)=>{
  const userId = req.user.id; 
  try {
    const user = await usersModel.findById(userId).populate("players");
    const nuklPlayers = user.players.filter(player => player.auction === 'nukl kabbadi');

    res.render("userPicks/nuklPicks", { players: nuklPlayers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})


//Auction Routes//
router.get("/nupl", async (req, res) => {
  const loggedInUserId = req.user.id; 
  const user = await usersModel.findById(loggedInUserId);

  const nuplAuction = user.auctions.find(auction => auction.auction === "nupl");

  res.render('userAuction/nupl', {
    userId: user._id,
    username: user.username,
    userBalance: nuplAuction.budget
  });
});
router.get("/impetus", async(req, res)=>{
  const loggedInUserId = req.user.id; 
  const user = await usersModel.findById(loggedInUserId);

  const impetusAuction = user.auctions.find(auction => auction.auction === "impetus");

  res.render('userAuction/impetus', {
    userId: user._id,
    username: user.username,
    userBalance: impetusAuction.budget
  });
})
router.get("/futsal", async(req, res)=>{
  const loggedInUserId = req.user.id; 
  const user = await usersModel.findById(loggedInUserId);

  const futsalAuction = user.auctions.find(auction => auction.auction === "futsal");

  res.render('userAuction/futsal', {
    userId: user._id,
    username: user.username,
    userBalance: futsalAuction.budget
  });
})
router.get("/nukl", async(req, res)=>{
  const loggedInUserId = req.user.id; 
  const user = await usersModel.findById(loggedInUserId);

  const nuklAuction = user.auctions.find(auction => auction.auction === "nukl");

  res.render('userAuction/nukl', {
    userId: user._id,
    username: user.username,
    userBalance: nuklAuction.budget
  });
})

router.get("/logoutUser", logoutUser)

module.exports = router;