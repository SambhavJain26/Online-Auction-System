const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const expressSession = require("express-session")
const flash = require("connect-flash")
const isUserLoggedIn = require('./middlewares/isUserLoggedIn');
const isHostLoggedIn = require('./middlewares/isHostLoggedIn');
const db = require("./config/mongoose.connect")


const hostRouter = require("./routes/hostRouter")
const usersRouter = require("./routes/usersRouter")
const auctionRouter = require("./routes/auctionRouter")
const {loginHost, loginUser} = require("./controllers/authController")

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET
  })
)
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
  let error = req.flash("error");
  res.render("index", {error})
})

app.post("/loginHost", loginHost)
app.post("/loginUser", loginUser)

app.use("/host", isHostLoggedIn,hostRouter)
app.use("/users",isUserLoggedIn, usersRouter)
app.use("/auction", auctionRouter)

app.listen(3000);