const mongoose = require('mongoose');

const sessionNotesSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  doctorNotes: {
    type: String,
    required: true,
  },
  recommendations: {
    type: String,
  },
  followUpDate: {
    type: Date,
  },
  patientFeedback: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SessionNotes', sessionNotesSchema);