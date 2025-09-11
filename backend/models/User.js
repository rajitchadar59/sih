const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },

  // doctor-specific fields
  specialization: {
    type: String,
    required: function () {
      return this.role === "doctor";
    }
  },
  therapy: {
    type: String,
    required: function () {
      return this.role === "doctor";
    }
  },
  therapyDuration: {
    type: String,
    required: function () {
      return this.role === "doctor";
    }
  },
  workingDays: {
    type: [String],
    required: function () {
      return this.role === "doctor";
    }
  },
  prePrecaution: {
    type: String,
    required: function () {
      return this.role === "doctor";
    }
  },
  postPrecaution: {
    type: String,
    required: function () {
      return this.role === "doctor";
    }
  }
});

// ✅ Yaha export karo model
module.exports = mongoose.model("User", userSchema);
