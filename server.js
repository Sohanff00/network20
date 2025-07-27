const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ DB connection failed:', err));

// Import routes
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const userInfoRoute = require('./routes/userinfo');

// Use routes
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/userinfo', userInfoRoute);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
