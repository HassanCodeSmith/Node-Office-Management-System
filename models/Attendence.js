const mongoose = require("mongoose");
const attendenceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    date: String,
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
    },
    checkout: String,
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Attendence", attendenceSchema);
