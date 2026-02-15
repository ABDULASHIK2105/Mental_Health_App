const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    required: true
  },

  // Used for doctor/admin verification
  isVerified: {
    type: Boolean,
    default: false
  },

  mentalScore: {
    type: Number,
    default: 0
  },

  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
