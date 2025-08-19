// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

// POST /auth/register
router.post('/register', async (req, res, next) => {
  console.log("➡️  Incoming request to /auth/register");
  console.log("📦 Raw body received:", req.body);

  try {
    const { username, email, password } = req.body;
    console.log("📝 Parsed values:", { username, email, password });

    if (!username || !email || !password) {
      console.warn("⚠️  Missing fields in request body");
      return res.status(400).json({ message: 'Provide username, email and password' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.warn("⚠️  User already exists with email:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log("🔑 Hashing password...");
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    console.log("💾 Saving new user to DB...");
    const user = new User({ username, email, password: hashed });
    await user.save();

    console.log("✅ User saved successfully, generating token...");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete userObj.password;

    console.log("🎉 Registration successful for:", userObj.email);
    return res.status(201).json({ token, user: userObj });
  } catch (err) {
    console.error("🔥 Error in /auth/register:", err.message);
    next(err);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  console.log("➡️  Incoming request to /auth/login");
  console.log("📦 Raw body received:", req.body);

  try {
    const { email, password } = req.body;
    console.log("📝 Parsed values:", { email, password });

    if (!email || !password) {
      console.warn("⚠️  Missing login fields");
      return res.status(400).json({ message: 'Provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn("❌ User not found:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("🔑 Checking password...");
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn("❌ Wrong password for:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("✅ Login successful, generating token...");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ token, user: userObj });
  } catch (err) {
    console.error("🔥 Error in /auth/login:", err.message);
    next(err);
  }
});

module.exports = router;
