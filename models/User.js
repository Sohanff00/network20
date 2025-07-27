const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  referral_code: { type: String },
  referred_by: { type: String },
  balance: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
