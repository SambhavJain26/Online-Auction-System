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

// WEB SOCKET CODE HERE //
const hostNamespace = io.of('/host/nupl');
const userNamespace = io.of('/users/nupl');

// Host Namespace Logic
hostNamespace.on('connection', (socket) => {
    console.log('Host connected:', socket.id);

    socket.on('shareSelectedPlayer', (player) => {
        userNamespace.emit('receiveSelectedPlayer', player); // Broadcast to users
    });

    socket.on('disconnect', () => {
        console.log('Host disconnected:', socket.id);
    });
});

// User Namespace Logic
userNamespace.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


// WEB SOCKET CODE ENDS HERE //

server.listen(3000);