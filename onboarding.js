const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Update mental health score
router.post('/score', auth, async (req, res) => {
  try {
    const { mood, stress, sleep, anxiety } = req.body;

    // Simple scoring logic (0-100)
    let score = 0;
    score += (mood / 10) * 25; // Mood out of 10
    score += (stress / 10) * 25; // Stress out of 10
    score += (sleep / 10) * 25; // Sleep out of 10
    score += (anxiety / 10) * 25; // Anxiety out of 10

    await User.findByIdAndUpdate(req.user._id, { mentalScore: Math.round(score) });

    res.send({ score: Math.round(score) });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;