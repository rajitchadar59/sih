const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const router = express.Router();

// Patient Registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: "patient" });
    await user.save();
    res.json({ success: true, message: "Patient registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role, adminKey } = req.body;

    // Admin login → verify key
    if (role === "admin") {
      if (adminKey !== process.env.ADMIN_SECRET_KEY)
        return res.status(401).json({ success: false, message: "Invalid admin key" });
    }

    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Password check only for patient/doctor
    if (role !== "admin") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Send user info (non-sensitive) for localStorage
    res.json({
      success: true,
      message: `${role} logged in successfully`,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
