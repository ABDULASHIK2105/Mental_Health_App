const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  // Reference to User collection (doctor account)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  specialization: {
    type: String,
    enum: ['Psychiatry', 'Counseling', 'Therapy', 'General'],
    default: 'General'
  },

  experience: {
    type: Number,
    default: 0
  },

  consultationFee: {
    type: Number,
    default: 0
  },

  rating: {
    type: Number,
    default: 0
  },

  verified: {
    type: Boolean,
    default: false
  },

  availableSlots: [
    {
      date: {
        type: Date,
        required: true
      },
      time: {
        type: String,
        required: true
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
