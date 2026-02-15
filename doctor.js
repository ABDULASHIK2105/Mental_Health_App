const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

/**
 * @route   GET /api/doctor/patients/:id/history
 * @desc    Get patient details + appointment history
 * @access  Doctor only
 */
router.get(
  '/patients/:id/history',
  auth,
  roleAuth(['doctor']), // Only doctors can access
  async (req, res) => {
    try {
      // Find patient
      const patient = await User.findById(req.params.id).select('name email mentalScore');
      if (!patient) return res.status(404).json({ error: 'Patient not found' });

      // Find appointments history
      const history = await Appointment.find({ patientId: req.params.id })
        .sort({ date: -1 })
        .populate('doctorId', 'name email'); // optional populate

      res.json({ patient, history });
    } catch (err) {
      console.error('Doctor route error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

/**
 * @route   GET /api/doctor/appointments
 * @desc    Get all appointments assigned to this doctor
 * @access  Doctor only
 */
router.get(
  '/appointments',
  auth,
  roleAuth(['doctor']),
  async (req, res) => {
    try {
      const appointments = await Appointment.find({ doctorId: req.user._id })
        .populate('patientId', 'name email')
        .sort({ date: 1 });
      res.json(appointments);
    } catch (err) {
      console.error('Appointments route error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

/**
 * @route   PATCH /api/doctor/appointments/:id/status
 * @desc    Update appointment status (pending → confirmed/rejected)
 * @access  Doctor only
 */
router.patch(
  '/appointments/:id/status',
  auth,
  roleAuth(['doctor']),
  async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const appointment = await Appointment.findOne({
        _id: req.params.id,
        doctorId: req.user._id,
      });
      if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

      appointment.status = status;
      await appointment.save();

      res.json({ message: 'Status updated', appointment });
    } catch (err) {
      console.error('Update status error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
