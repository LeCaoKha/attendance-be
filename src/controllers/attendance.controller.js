// controllers/attendance.controller.js
const Child = require("../models/Child.model");
const Attendance = require("../models/Attendance.model");
const { matchFace } = require("../utils/faceCompare");

const THRESHOLD = 0.6;

exports.scanFace = async (req, res) => {
  const { classId, faceEmbedding } = req.body;

  const children = await Child.find({ classId });
  if (!children.length) return res.status(404).json({ message: "Empty class" });

  const { best, min } = matchFace(faceEmbedding, children);

  if (!best || min > THRESHOLD) {
    return res.status(400).json({ message: "Face not recognized" });
  }

  const today = new Date().toISOString().slice(0, 10);

  await Attendance.findOneAndUpdate(
    { childId: best._id, date: today },
    {
      childId: best._id,
      classId,
      date: today,
      status: "present",
    },
    { upsert: true }
  );

  res.json({
    message: "Attendance success",
    childName: best.name,
    distance: min,
  });
};

/* ================= CREATE (1 HOẶC NHIỀU CHILD) =================
POST /api/attendance
Body:
{
  "classId": "...",
  "date": "2025-01-10",
  "childIds": ["id1", "id2"],
  "status": "present"
}
*/
exports.createAttendance = async (req, res) => {
  try {
    const { classId, date, childIds, status } = req.body;

    if (!classId || !date || !Array.isArray(childIds)) {
      return res.status(400).json({
        message: "classId, date and childIds (array) are required",
      });
    }

    if (childIds.length === 0) {
      return res.status(400).json({
        message: "childIds must not be empty",
      });
    }

    const bulkOps = childIds.map((childId) => ({
      updateOne: {
        filter: { childId, date },
        update: {
          $set: {
            childId,
            classId,
            date,
            status: status || "present",
            updatedAt: new Date(),
          },
        },
        upsert: true, // 🔥 nếu tồn tại → update, không tồn tại → insert
      },
    }));

    const result = await Attendance.bulkWrite(bulkOps);

    res.status(201).json({
      message: "Attendance created or updated successfully",
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= READ ALL ================= */
exports.getAllAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("childId")
      .populate("classId");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= READ BY CLASS + DATE =================
GET /api/attendance/by-class?classId=...&date=YYYY-MM-DD
*/
exports.getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({
        message: "classId and date are required",
      });
    }

    const data = await Attendance.find({ classId, date }).populate("childId");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= READ ONE ================= */
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate("childId")
      .populate("classId");

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE (CHỈ SỬA STATUS) ================= */
exports.updateAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json({ message: "Attendance deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
