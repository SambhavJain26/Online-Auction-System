const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const expressSession = require("express-session")
const flash = require("connect-flash")
const isUserLoggedIn = require('./middlewares/isUserLoggedIn');
const isHostLoggedIn = require('./middlewares/isHostLoggedIn');
const db = require("./config/mongoose.connect")
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

const hostRouter = require("./routes/hostRouter")
const usersRouter = require("./routes/usersRouter")
const auctionRouter = require("./routes/auctionRouter")
const {loginHost, loginUser} = require("./controllers/authController")

const userModel = require("./models/users-model")
const playerModel = require("./models/players-model")

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

//Host Namespace use //
app.use("/host/nupl", hostRouter)
app.use("/host/impetus", hostRouter)
app.use("/host/nukl", hostRouter)
app.use("/host/futsal", hostRouter)

// User Namespace use //
app.use("/users/nupl", usersRouter)
app.use("/users/impetus", usersRouter)
app.use("/users/nukl", usersRouter)
app.use("/users/futsal", usersRouter)

const auctions = ['nupl', 'impetus', 'nukl', 'futsal'];
auctions.forEach((auction) => {
  createAuctionNamespace(auction);
});

function createAuctionNamespace(auctionName) {
  const hostNamespace = io.of(`/host/${auctionName}`);
  const userNamespace = io.of(`/users/${auctionName}`);

let lastSentPlayer = null;
let hostPlayers = [];
let currentBid = 0;
let bidHistory = [];
let countdownTimer = 10; 
let timerInterval;
let biddingEnabled = false; 
let passedUsers = new Set();
let playerAvailable = false;

hostNamespace.on('connection', (socket) => {
  console.log('Host connected:', socket.id);

  socket.on('shareSelectedPlayer', (player) => {
    currentBid = 0;
    bidHistory = [];
    countdownTimer = 10; 
    lastSentPlayer = player; 
    hostPlayers = hostPlayers.filter(player => player.name !== lastSentPlayer.name); 
    biddingEnabled = true;
    playerAvailable = true;

    [hostNamespace, userNamespace].forEach(ns => {
      ns.emit("resetWinner");
      ns.emit("receiveSelectedPlayer", lastSentPlayer);
      ns.emit("currentBidUpdate", currentBid);
      ns.emit("bidHistoryUpdate", bidHistory);
      ns.emit("timerUpdate", countdownTimer);
      ns.emit("biddingStatusUpdate", biddingEnabled);
      ns.emit("passButtonStatus", playerAvailable);
    });
  });

  socket.on('endAuction', () => {
    const redirectRoute = '/users'; // Set the redirect route to /users
    userNamespace.emit('auctionEnded', { message: "The auction was ended by the host.", redirectRoute });
  });


  socket.on('disconnect', () => {
      console.log('Host disconnected:', socket.id);
  });
});

userNamespace.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  if (lastSentPlayer) {
    playerAvailable = true;
    socket.emit('receiveSelectedPlayer', lastSentPlayer);
  } else {
    playerAvailable = false;
  }

  socket.emit('currentBidUpdate', currentBid);
  socket.emit('bidHistoryUpdate', bidHistory);
  socket.emit('timerUpdate', countdownTimer);
  socket.emit("biddingStatusUpdate", biddingEnabled);
  socket.emit("passButtonStatus", playerAvailable);

  socket.on("placeBid", async (bidData) => {
    if (!biddingEnabled) {
      socket.emit("bidError", "Bidding is not allowed at this time.");
      return;
    }

    const { userId, newBid } = bidData; 
    currentBid = newBid;
    const currentUser = await userModel.findById(userId);

    bidHistory.push({ username: currentUser.username, amount: currentBid, userId });

    passedUsers.clear();

    [hostNamespace, userNamespace].forEach(ns => {
      ns.emit("currentBidUpdate", currentBid);
      ns.emit("bidHistoryUpdate", bidHistory);
    });

    resetAndStartTimer();
  });

  socket.on("pass", (userId) => {
    if (!playerAvailable) return;
    passedUsers.add(userId);

    userModel.findById(userId).then((currentUser) => {
      if (currentUser) {

        bidHistory.push({ username: currentUser.username, amount: "Passed" });

        [hostNamespace, userNamespace].forEach((ns) => {
          ns.emit("bidHistoryUpdate", bidHistory);
        });
      }

      if (passedUsers.size >= userNamespace.sockets.size) {
        clearInterval(timerInterval);
        biddingEnabled = false;
        playerAvailable = false;

        [hostNamespace, userNamespace].forEach((ns) => {
          ns.emit("unsoldPlayer", { player: lastSentPlayer.name });
          ns.emit("biddingStatusUpdate", biddingEnabled);
          ns.emit("passButtonStatus", false); 
        });

        console.log(`Player ${lastSentPlayer.name} is unsold.`);
      }
    });
  });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});

function resetAndStartTimer() {
  clearInterval(timerInterval);
  countdownTimer = 10;
  biddingEnabled = true;

  [hostNamespace, userNamespace].forEach(ns => {
    ns.emit("biddingStatusUpdate", biddingEnabled);
    ns.emit('timerUpdate', countdownTimer);
  });

  timerInterval = setInterval(() => {
    if (countdownTimer > 0) {
      countdownTimer--; 
      [hostNamespace, userNamespace].forEach(ns => {
        ns.emit('timerUpdate', countdownTimer);
      });
    } else {
      clearInterval(timerInterval); 
      biddingEnabled = false; 
      [hostNamespace, userNamespace].forEach(ns => {
        ns.emit("biddingStatusUpdate", biddingEnabled);
      });
      announceWinner();
    }
  }, 1000); 
}

async function announceWinner() {
  if (bidHistory.length === 0 || !lastSentPlayer) {
    return;
  }

  const highestBid = bidHistory[bidHistory.length - 1];
  if (!highestBid) {
    console.log("No valid highest bid. Skipping winner announcement.");
    return;
  }

  try {
    const winner = await userModel.findById(highestBid.userId);

    if (winner) {
      const boughtPlayer = await playerModel.findById(lastSentPlayer.id);
      if (boughtPlayer) {
        winner.players.push(boughtPlayer._id);
        await winner.save();
      }

      [hostNamespace, userNamespace].forEach(ns => {
        ns.emit("announceWinner", {
          username: winner.username,
          player: lastSentPlayer.name
        });
      });

      console.log(`Winner announced: ${winner.username} bought ${lastSentPlayer.name}`);
    } else {
      console.log("Winner not found in the database.");
    }
  } catch (err) {
    console.error("Error announcing winner:", err.message);
  }
}

app.get('/api/current-player', (req, res) => {
  res.json(lastSentPlayer || {});
});

app.get('/api/host-players', (req, res) => {
  res.json(hostPlayers);
});
}


server.listen(3000);