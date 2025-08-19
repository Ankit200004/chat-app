const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

router.get('/:id/messages', auth, async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const targetId = req.params.id; 

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: targetId },
        { sender: targetId, receiver: userId }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username email')
    .populate('receiver', 'username email');

    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/messages', auth, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    const msg = new Message({
      sender: req.user.id,
      receiver: req.params.id,
      text,
      status: 'sent'
    });

    await msg.save();

    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
