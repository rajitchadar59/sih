const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// ----------------- BOOK APPOINTMENT -----------------

// ----------------- BOOK APPOINTMENT -----------------
router.post("/book", async (req, res) => {
  try {
    const { therapy, doctor, patient, date, slot } = req.body;

    if (!therapy || !doctor || !patient || !date || !slot) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const normalizedDate = new Date(date);
    if (isNaN(normalizedDate.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format" });
    }
    normalizedDate.setHours(0, 0, 0, 0);

    // ================== NEW LOGIC: CHECK WORKING DAY ==================
    // Step 1: Doctor ki details fetch karein
    const doctorDetails = await User.findById(doctor);
    if (!doctorDetails || doctorDetails.role !== "doctor") {
        return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Step 2: Appointment ki date se din ka naam nikalein (e.g., "Mon", "Tue")
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const appointmentDay = daysOfWeek[normalizedDate.getDay()];

    // Step 3: Check karein ki woh din doctor ke workingDays array mein hai ya nahi
    if (!doctorDetails.workingDays.includes(appointmentDay)) {
        return res.status(400).json({
            success: false,
            message: `Doctor is not available on ${appointmentDay}s. Please choose a different day.`
        });
    }
    // ================== END OF NEW LOGIC ==================


    
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

    // Patient slot check (existing logic)
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

    // Create appointment (existing logic)
    const newAppointment = new Appointment({
      therapy,
      doctor,
      patient,
      date: normalizedDate,
      slot,
    });
    await newAppointment.save();

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





// ----------------- CONFIRM APPOINTMENT -----------------
router.put("/confirm/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // Mark as completed
    appointment.completed = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment confirmed", appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
