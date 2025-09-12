const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  therapy: { type: mongoose.Schema.Types.ObjectId, ref: "Therapy", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  completed: { type: Boolean, default: false }, // new field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
