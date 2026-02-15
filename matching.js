const express = require('express');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 🎯 MATCH DOCTOR
router.get('/doctor', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const score = user.mentalScore || 0;

    let specialization = 'Therapy';
    if (score > 80) specialization = 'Psychiatry';
    else if (score > 60) specialization = 'Counseling';

    const doctors = await DoctorProfile.find({
      specialization,
      verified: true
    })
      .populate('userId', 'name email')
      .sort({ rating: -1 });

    if (doctors.length === 0) {
      return res.status(404).send({ error: 'No doctors available' });
    }

    const assignedDoctor = doctors[0];

    // save assigned doctor to user
    await User.findByIdAndUpdate(req.user._id, {
      assignedDoctor: assignedDoctor.userId._id
    });

    res.send(assignedDoctor);

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
