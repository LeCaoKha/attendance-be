const ClassModel = require("../models/Class.model");
const Child = require("../models/Child.model");

// CREATE
exports.createClass = async (req, res) => {
  try {
    const cls = await ClassModel.create(req.body);
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.getClasses = async (req, res) => {
  try {
    const classes = await ClassModel.find().sort({ year: -1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.getClassById = async (req, res) => {
  try {
    const cls = await ClassModel.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateClass = async (req, res) => {
  try {
    const cls = await ClassModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(cls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteClass = async (req, res) => {
  try {
    await ClassModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD/REMOVE CHILD
exports.updateChildrenInClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { addChildIds = [], removeChildIds = [] } = req.body;

    if (!Array.isArray(addChildIds) || !Array.isArray(removeChildIds)) {
      return res.status(400).json({
        message: "addChildIds and removeChildIds must be arrays",
      });
    }

    const result = {};

    // ADD nhiều child vào class
    if (addChildIds.length > 0) {
      result.added = await Child.updateMany(
        { _id: { $in: addChildIds } },
        { classId }
      );
    }

    // REMOVE nhiều child khỏi class
    if (removeChildIds.length > 0) {
      result.removed = await Child.updateMany(
        { _id: { $in: removeChildIds } },
        { classId: null }
      );
    }

    res.json({
      message: "Children updated successfully",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
