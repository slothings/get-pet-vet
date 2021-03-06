const express = require("express");
const passport = require('./passport/index.js');
const session = require('express-session');
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const routes = require('./routes');

const path = require('path');
require('./config/db')();

// PORT
const PORT = process.env.PORT || 8000;

// parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// sessions
app.use(
  session({
    secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
    resave: false, //required
    saveUninitialized: false //required
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session()); // calls the deserializeUser

// routes
app.use(routes);


// sockets old SOCKET IS CLIENT, IO IS THE SERVER
// io.sockets is all clients
const users = {};

io.on('connection', socket => {
  if (!users[socket.id]) {
    users[socket.id] = {
      id: socket.id,
    };
  }

  socket.emit("yourID", socket.id);

  io.sockets.emit("allUsers", users);

  socket.on('disconnect', () => {
    delete users[socket.id];
  });

  socket.on("join-room", (data) => {
    socket.join(data.facility);
    socket.to(data.facility).emit(data.facility, socket.id);
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit('hey', { signal: data.signalData, from: data.from });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

// // server
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

server.listen(PORT, () => console.log('server is running on port ' + PORT));