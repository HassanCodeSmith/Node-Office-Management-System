const mongoose = require("mongoose");
const complaintsSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    title: String,
    description: String,
    suggestion: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintsSchema);
