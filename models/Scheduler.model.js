const mongoose = require("mongoose");

const schedulerSchema = new mongoose.Schema(
  {
    start: String,
    end: String,
    title: String,
    meetingLink: String,
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeetingNoti",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Object Id for created by is requried"],
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheduler", schedulerSchema);
