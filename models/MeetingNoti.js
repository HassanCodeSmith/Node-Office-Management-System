const mongoose = require("mongoose");
const meetingNotiSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: Date,
    agenda: String,
    startTime: String,
    endTime: String,
    meetingLink: String,
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    feedback: [
      {
        response: {
          type: String,
          enum: ["pending", "accepted", "declined", "reschedule"],
          default: "pending",
        },
        employeeId: {
          type: mongoose.Types.ObjectId,
          ref: "user",
        },
      },
    ],
    permanetDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MeetingNoti", meetingNotiSchema);
