const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

  // Middleware
app.use(cors());
app.use(express.json());
  // Routes
  const authRoutes = require('./routes/auth');
  const onboardingRoutes = require('./routes/onboarding');
  const matchingRoutes = require('./routes/matching');
  const appointmentRoutes = require('./routes/appointments');
  const sessionRoutes = require('./routes/sessions');
  const paymentRoutes = require('./routes/payments');
  const adminRoutes = require('./routes/admin');
  const doctorRoutes = require('./routes/doctor');

  app.use('/api/auth', authRoutes);
  app.use('/api/onboarding', onboardingRoutes);
  app.use('/api/matching', matchingRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/sessions', sessionRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/doctor', doctorRoutes);

  app.get('/', (req, res) => {
    res.send('Mental Health App API');
  });

  /* ✅ DB CONNECT */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });