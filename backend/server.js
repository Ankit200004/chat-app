// server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());



// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/conversations', require('./routes/conversations'));


// Simple error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate key error', details: err.keyValue });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
