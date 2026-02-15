const express = require('express');
const Appointment = require('../models/Appointment');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Process payment (simulated)
router.post('/:appointmentId', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Access denied' });
    }

    // Simulate payment success
    await Appointment.findByIdAndUpdate(req.params.appointmentId, {
      paymentStatus: 'paid',
      status: 'confirmed'
    });

    res.send({ message: 'Payment successful' });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;