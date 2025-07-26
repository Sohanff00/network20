const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ ইউজারের ইনফো আনার API
router.get('/userinfo/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select('-password'); // পাসওয়ার্ড বাদ
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      name: user.fullname,
      email: user.email,
      refid: user.referral_code,
      referred_by: user.referred_by,
      balance: user.balance,
      joined: user.created_at,
      status: 'active', // যদি এক্টিভ/ইনএক্টিভ চাই
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
