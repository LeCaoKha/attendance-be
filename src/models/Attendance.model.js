// models/Attendance.model.js
const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  date: String, // YYYY-MM-DD
  status: { type: String, default: "present" },
});

AttendanceSchema.index({ childId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
