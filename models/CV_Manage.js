const mongoose = require("mongoose");
const cvSchema = new mongoose.Schema(
  {
    fullname: String,
    email: {
      type: String,
      unique: [true, "Email must be unique"],
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
    phone: Number,
    address: String,
    education: String,
    experience: String,
    skill: String,
    cvFile: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CV_Manage", cvSchema);
