const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const socketIO = require("socket.io");

// Read SSL certificate files
const privateKey = fs.readFileSync('/etc/letsencrypt/live/play.discosea.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/play.discosea.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/play.discosea.com/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};


// Create an HTTPS server and set up Socket.IO with CORS enabled
const server = https.createServer(credentials, app);
const io = socketIO(server, {
  cors: {
    origin: "https://play.discosea.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const connectedClients = [];

io.on('connection', (socket) => {
  console.log('A new client connected');

  // Add the client to the list of connected clients
  connectedClients.push({ socketId: socket.id });

  // Emit the updated list of connected clients to all clients
  io.emit('connectedClients', connectedClients);

  // Remove the client from the list of connected clients when they disconnect
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    const index = connectedClients.findIndex((c) => c.socketId === socket.id);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }

    // Emit the updated list of connected clients to all clients
    io.emit('connectedClients', connectedClients);
  });
});

// Set up a GET route
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// Start the server
server.listen(3100, () => {
  console.log("listening on *:3100");
});
