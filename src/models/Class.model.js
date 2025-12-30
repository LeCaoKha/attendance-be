// models/Class.model.js
const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    name: String,
    year: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);
