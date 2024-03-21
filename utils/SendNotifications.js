const express = express("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);

// Function to send notifications to connected clients
function sendNotification(notification, recipientId = null) {
  if (recipientId) {
    // Send notification to a specific client

    const recipientSocket = io.sockets.sockets.get(recipientId);
    if (recipientSocket) {
      recipientSocket.emit("notification", notification);
    } else {
      console.error(`Client ${recipientId} not found.`);
    }
  } else {
    // Send notification to all connected clients
    io.emit("notification", notification);
  }
}
