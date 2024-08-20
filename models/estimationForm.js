const mongoose = require("mongoose");
const estimationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
    startTime: Date,
    endTime: Date,
    comment: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Estimation", estimationSchema);
