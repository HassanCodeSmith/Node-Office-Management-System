const mongoose = require("mongoose");
const salarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    month: String,
    year: Number,
    basicSalary: Number,
    overtime: {
      type: Number,
      default: 0,
    },
    deduction: {
      type: Number,
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    totalSalary: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);
