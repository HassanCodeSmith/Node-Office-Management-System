const mongoose = require("mongoose");
const dailyReportSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    drFile: String,
    // designation: String,
    dailySummary: String,
    // taskLink: String,
    date: Date,
    feedback: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DailyReport", dailyReportSchema);
