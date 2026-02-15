const express = require('express');
const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Book appointment
router.post('/book', auth, async (req, res) => {
  try {
    const { doctorId, date, timeSlot } = req.body;

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).send({ error: 'Slot not available' });
    }

    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      date,
      timeSlot,
    });

    await appointment.save();
    res.status(201).send(appointment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get user appointments
router.get('/my', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ patientId: req.user._id }, { doctorId: req.user._id }]
    }).populate('patientId', 'name email').populate('doctorId', 'name email');
    res.send(appointments);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get available slots for doctor
router.get('/slots/:doctorId', auth, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const doctor = await DoctorProfile.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).send({ error: 'Doctor not found' });
    }

    const bookedSlots = await Appointment.find({
      doctorId,
      date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');

    const bookedTimes = bookedSlots.map(slot => slot.timeSlot);
    const availableSlots = doctor.availableSlots.filter(slot =>
      slot.date.toDateString() === new Date(date).toDateString() &&
      !bookedTimes.includes(slot.time)
    );

    res.send(availableSlots);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update appointment status (doctor/admin)
router.patch('/:id', auth, roleAuth(['doctor', 'admin']), async (req, res) => {
  try {
    const { status } = req.body;
    let updateData = { status };

    if (status === 'confirmed') {
      // Generate Jitsi meeting link
      const meetingId = Math.random().toString(36).substring(2, 15);
      updateData.meetingLink = `https://meet.jit.si/${meetingId}`;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.send(appointment);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;