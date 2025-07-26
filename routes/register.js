// server.js
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
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB connection failed:', err));

// Routes
app.use('/api', require('./routes/register'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// routes/register.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

function generateReferralCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return [...Array(length)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
}

router.post('/register', async (req, res) => {
  const { fullname, email, phone, password, confirm_password, referral } = req.body;

  if (!fullname || !email || !phone || !password || !confirm_password) {
    return res.status(400).json({ status: 'error', message: 'All fields except referral are required.' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ status: 'error', message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referral_code = generateReferralCode();

    const newUser = new User({
      fullname,
      email,
      phone,
      password: hashedPassword,
      referral_code,
      referred_by: referral || null
    });

    await newUser.save();

    res.json({
      status: 'success',
      message: 'Registration successful',
      referral_code
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;

// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  referral_code: { type: String },
  referred_by: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
