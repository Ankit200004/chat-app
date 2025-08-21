const { Server } = require('socket.io');
const User = require('../models/User');
const messageHandler = require('./messageHandler');
const typingHandler = require('./typingHandler');

// Track online users
const onlineUsers = {};

let io;

function init(server) {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', async (socket) => {
    console.log(`⚡ New client connected: ${socket.id}`);

    // When user joins 
    socket.on('user:online', async (userId) => {
      onlineUsers[userId] = socket.id;
      await User.findByIdAndUpdate(userId, { online: true, lastSeen: new Date() });
      io.emit('user:status', { userId, online: true });
      console.log(`✅ User ${userId} is online`);
    });

    // Handle messages
    messageHandler(io, socket, onlineUsers);

    // Handle typing
    typingHandler(io, socket, onlineUsers);

    // On disconnect
    socket.on('disconnect', async () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
      const userId = Object.keys(onlineUsers).find(id => onlineUsers[id] === socket.id);
      if (userId) {
        delete onlineUsers[userId];
        await User.findByIdAndUpdate(userId, { online: false, lastSeen: new Date() });
        io.emit('user:status', { userId, online: false });
        console.log(`🔴 User ${userId} is offline`);
      }
    });
  });
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
}

module.exports = { init, getIO };
