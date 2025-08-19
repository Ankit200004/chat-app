// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /users  (protected)
router.get('/', auth, async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
                            .select('-password')
                            .sort({ updatedAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
