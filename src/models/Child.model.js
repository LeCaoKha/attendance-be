const mongoose = require("mongoose");

const ChildSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      default: null, // QUAN TRỌNG
    },

    faceEmbedding: {
      type: [Number],
      default: null, // QUAN TRỌNG
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Child", ChildSchema);
