const mongoose = require("mongoose");
const leaveAppSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "user"
    },leaveType:String,
    startDate: Date,
    endDate: Date,
    reason: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("LeaveApp", leaveAppSchema);
