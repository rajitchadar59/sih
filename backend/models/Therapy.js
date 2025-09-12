const mongoose = require("mongoose");

const therapySchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true },
  cost: { type: Number, required: true },
  prePrecaution: { type: String },
  postPrecaution: { type: String },
});

module.exports = mongoose.model("Therapy", therapySchema);
