const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// ----------------- BOOK APPOINTMENT -----------------
router.post("/book", async (req, res) => {
  try {
    // UPDATED: Destructuring keys to match schema (therapy, doctor, patient)
    const { therapy, doctor, patient, date, slot } = req.body;

  

    // UPDATED: Validation with new variable names
    if (!therapy || !doctor || !patient || !date || !slot) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Normalize date (force ISO format)
    const normalizedDate = new Date(date);
    if (isNaN(normalizedDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format" });
    }
    normalizedDate.setHours(0, 0, 0, 0);

    // Doctor slot check
    // UPDATED: Using 'doctor' which holds the ID
    const doctorBooked = await Appointment.findOne({
      doctor: doctor,
      date: normalizedDate,
      slot,
    });
    if (doctorBooked) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked for this doctor",
      });
    }

    // Patient slot check
    // UPDATED: Using 'patient' which holds the ID
    const patientBooked = await Appointment.findOne({
      patient: patient,
      date: normalizedDate,
      slot,
    });
    if (patientBooked) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment at this time",
      });
    }

    // Create appointment
    // UPDATED: Using consistent variable names
    const newAppointment = new Appointment({
      therapy,
      doctor,
      patient,
      date: normalizedDate,
      slot,
    });

    await newAppointment.save();

    // Save reference in patient user
    // UPDATED: Using 'patient' which holds the ID
    await User.findByIdAndUpdate(patient, {
      $push: { appointments: newAppointment._id },
    });

    res.json({
      success: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("BOOK ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------- GET PATIENT APPOINTMENTS -----------------
router.get("/patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.params.patientId,
    })
      .populate("therapy")
      .populate("doctor", "-password");

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------- GET DOCTOR APPOINTMENTS -----------------
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorId,
    })
      .populate("therapy")
      .populate("patient", "-password");

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------- CANCEL APPOINTMENT -----------------
router.delete("/cancel/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Remove from patient’s appointments array
    await User.findByIdAndUpdate(appointment.patient, {
      $pull: { appointments: appointmentId },
    });

    await appointment.deleteOne();

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
