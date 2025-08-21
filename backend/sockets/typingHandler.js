module.exports = (io, socket, onlineUsers) => {
  // Typing start
  socket.on('typing:start', ({ from, to }) => {
    const receiverSocketId = onlineUsers[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing:start', { from });
    }
  });

  // Typing stop
  socket.on('typing:stop', ({ from, to }) => {
    const receiverSocketId = onlineUsers[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing:stop', { from });
    }
  });
};
