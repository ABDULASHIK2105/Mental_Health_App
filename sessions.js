const express = require('express');
const SessionNotes = require('../models/SessionNotes');
const Appointment = require('../models/Appointment');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Add session notes (doctor only)
router.post('/:appointmentId', auth, roleAuth(['doctor']), async (req, res) => {
  try {
    const { doctorNotes, recommendations, followUpDate } = req.body;

    const sessionNotes = new SessionNotes({
      appointmentId: req.params.appointmentId,
      doctorNotes,
      recommendations,
      followUpDate,
    });

    await sessionNotes.save();

    // Update appointment status to completed
    await Appointment.findByIdAndUpdate(req.params.appointmentId, { status: 'completed' });

    res.status(201).send(sessionNotes);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get session notes
router.get('/:appointmentId', auth, async (req, res) => {
  try {
    const sessionNotes = await SessionNotes.findOne({ appointmentId: req.params.appointmentId });
    if (!sessionNotes) {
      return res.status(404).send({ error: 'Session notes not found' });
    }

    // Allow patient to view or doctor to view
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (req.user._id.toString() !== appointment.patientId.toString() &&
        req.user._id.toString() !== appointment.doctorId.toString()) {
      return res.status(403).send({ error: 'Access denied' });
    }

    res.send(sessionNotes);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Add patient feedback
router.patch('/:appointmentId/feedback', auth, async (req, res) => {
  try {
    const { patientFeedback, rating } = req.body;

    const sessionNotes = await SessionNotes.findOneAndUpdate(
      { appointmentId: req.params.appointmentId },
      { patientFeedback, rating },
      { new: true }
    );

    res.send(sessionNotes);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;