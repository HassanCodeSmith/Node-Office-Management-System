const mongoose = require("mongoose");
const businessDocSchema = new mongoose.Schema(
  {
    file: String,
    projectId: {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
    // newFile: [{ type: String }],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("BusinessDoc", businessDocSchema);
