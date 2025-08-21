const Message = require('../models/Message');

module.exports = (io, socket, onlineUsers) => {
  // Send message
// Send message
socket.on('message:send', async (data) => {
  try {
    const { senderId, receiverId, text } = data;

    // Save in DB
    let msg = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      status: 'sent'
    });
    await msg.save();

    // Emit back to sender → single tick (sent)
    socket.emit('message:new', msg);

    // Emit to receiver if online
    const receiverSocketId = onlineUsers[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('message:new', msg);

      // Update status → delivered (double tick)
      msg.status = 'delivered';
      await msg.save();

      // Emit status update to sender (so he sees ✅✅)
      socket.emit('message:status', { messageId: msg._id, status: 'delivered' });
    }
  } catch (err) {
    console.error('Error sending message:', err);
  }
});

// Mark as read
socket.on('message:read', async ({ messageId }) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      messageId,
      { status: 'read' },
      { new: true }
    );

    if (msg) {
      const senderSocketId = onlineUsers[msg.sender];
      if (senderSocketId) {
        io.to(senderSocketId).emit('message:status', { messageId, status: 'read' });
      }
    }
  } catch (err) {
    console.error('Error marking message read:', err);
  }
})};
