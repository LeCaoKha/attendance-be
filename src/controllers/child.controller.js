const Child = require("../models/Child.model");

/* ================= CREATE ================= */
exports.createChild = async (req, res) => {
  try {
    const { name, classId, faceEmbedding } = req.body;

    if (faceEmbedding && faceEmbedding.length !== 128) {
      return res
        .status(400)
        .json({ message: "Face embedding must have 128 dimensions" });
    }

    const child = await Child.create({
      name,
      classId,
      faceEmbedding: faceEmbedding || null,
    });

    res.status(201).json(child);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= READ ALL ================= */
exports.getAllChildren = async (req, res) => {
  try {
    const children = await Child.find().populate("classId");
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= READ BY CLASS ================= */
exports.getChildrenByClass = async (req, res) => {
  try {
    const children = await Child.find({
      classId: req.params.classId,
    });
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= READ ONE ================= */
exports.getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.json(child);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateChild = async (req, res) => {
  try {
    const { faceEmbedding } = req.body;

    if (faceEmbedding && faceEmbedding.length !== 128) {
      return res
        .status(400)
        .json({ message: "Face embedding must have 128 dimensions" });
    }

    const child = await Child.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.json(child);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.json({ message: "Child deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
