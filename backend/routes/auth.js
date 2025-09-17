const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const router = express.Router();

// Register patient
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, dob, contactNo } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "patient",
      dob,
      contactNo,
    });

    await user.save();
    res.json({ success: true, message: "Patient registered successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add doctor
router.post("/add-doctor", async (req, res) => {
  try {
    const { name, email, contact, specialization, password, workingDays, therapies } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      name,
      email,
      contact,
      specialization,
      password: hashedPassword,
      workingDays,
      therapies,
      role: "doctor",
    });

    await doctor.save();
    res.json({ success: true, message: "Doctor added successfully", doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



router.post("/admin-login", async (req, res) => {
  try {
    const { email, adminKey } = req.body;

    
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ success: false, message: "Invalid admin key" });
    }

    res.json({
      success: true,
      message: "Admin logged in successfully",
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    
    const user = await User.findOne({ email, role: new RegExp(`^${role}$`, "i") });
    if (!user) {
      return res.status(404).json({ success: false, message: `${role} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: `${user.role} logged in successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});





// Get doctors for a specific therapy
router.get("/doctors-by-therapy/:therapyId", async (req, res) => {
  try {
    const therapyId = req.params.therapyId;
    const doctors = await User.find({
      role: "doctor",
      therapies: therapyId
    }).select("-password");
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
