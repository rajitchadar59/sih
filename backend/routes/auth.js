const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const router = express.Router();


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




router.post("/add-doctor", async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      specialization,
      therapy,
      therapyDuration,
      workingDays,
      prePrecaution,
      postPrecaution,
      password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      name,
      email,
      contact,
      specialization,
      therapy,
      therapyDuration,
      workingDays: workingDays.split(",").map((d) => d.trim()), // "Mon, Tue" -> ["Mon","Tue"]
      prePrecaution,
      postPrecaution,
      password: hashedPassword,
      role: "doctor"
    });

    await doctor.save();
    res.json({ success: true, message: "Doctor added successfully", doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password, role, adminKey } = req.body;

    
    if (role === "admin") {
      if (adminKey !== process.env.ADMIN_SECRET_KEY)
        return res.status(401).json({ success: false, message: "Invalid admin key" });
    }

    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    
    if (role !== "admin") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    
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
