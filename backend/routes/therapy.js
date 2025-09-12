const express = require("express");
const router = express.Router();
const Therapy = require("../models/Therapy");

// Add therapy
router.post("/add-therapy", async (req, res) => {
  try {
    const { name, duration, cost, prePrecaution, postPrecaution } = req.body;

    const therapy = new Therapy({
      name,
      duration,
      cost,
      prePrecaution,
      postPrecaution
    });

    await therapy.save();
    res.json({ success: true, message: "Therapy added successfully", therapy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all therapies
router.get("/all", async (req, res) => {
  try {
    const therapies = await Therapy.find();
    res.json({ success: true, therapies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
