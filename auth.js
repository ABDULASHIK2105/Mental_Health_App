const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).send({ error: "Database not connected" });
    }

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: role === "patient", // 👈 auto verify patients
    });

    await user.save();

    // ✅ CREATE DOCTOR PROFILE AUTOMATICALLY
    if (role === "doctor") {
      await DoctorProfile.create({
        userId: user._id,
        specialization: "Therapy", // default
        experience: 0,
        consultationFee: 0,
        rating: 0,
        verified: false, // admin verifies later
        availableSlots: [],
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message || "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).send({ error: "Database not connected" });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message || "Login failed" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
