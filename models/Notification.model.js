const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    type: {
      type: String,
      require: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
