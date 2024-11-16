const express = require('express');
const router = express.Router();
const {logoutUser} = require("../controllers/authController");

router.get("/", (req, res)=>{
  res.render("users")
})

//User Auction Routes start//

router.get("/nupl", async(req, res)=>{
  res.render("userAuction/nupl")
})
router.get("/impetus", async(req, res)=>{
  res.render("userAuction/impetus")
})
router.get("/futsal", async(req, res)=>{
  res.render("userAuction/futsal")
})
router.get("/nukl", async(req, res)=>{
  res.render("userAuction/nukl")
})

//User Auction Routes end//

router.get("/logoutUser", logoutUser)

module.exports = router;