const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// POST /api/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Return user info (excluding password)
    res.json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        referral_code: user.referral_code,
        referred_by: user.referred_by,
        balance: user.balance || 0
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

module.exports = router;
