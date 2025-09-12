const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },

  specialization: {
    type: String,
    required: function () { return this.role === "doctor"; }
  },
  workingDays: {
    type: [String],
    required: function () { return this.role === "doctor"; }
  },
  contact: {
    type: String,
    required: function () { return this.role === "doctor"; }
  },
  therapies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Therapy" }] // doctor ke liye available therapies
});

module.exports = mongoose.model("User", userSchema);
