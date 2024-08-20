const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    assignEmployee: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    assignTeamLead: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "start",
        "working",
        "complete",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Project", projectSchema);
