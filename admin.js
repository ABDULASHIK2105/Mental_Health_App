const express = require('express');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Verify doctor
router.patch('/doctors/:id/verify', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOneAndUpdate(
      { userId: req.params.id },
      { verified: true },
      { new: true }
    );
    await User.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.send(doctorProfile);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all appointments
router.get('/appointments', auth, roleAuth(['admin']), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');
    res.send(appointments);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;