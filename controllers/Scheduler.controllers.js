const mongoose = require("mongoose");
const Meeting = require("../models/MeetingNoti");
const Scheduler = require("../models/Scheduler.model");
const User = require("../models/user");

exports.getSchedulers = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findOne({ _id: userId, permanentDeleted: false });

    if (
      user.role === "admin" ||
      user.role === "hr" ||
      user.role === "projectManager"
    ) {
      const schedulers = await Scheduler.find({ permanentDeleted: false });
      return res.status(200).json({ success: true, data: schedulers });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Aggregation pipeline to find user meetings and associated schedulers
    const schedulers = await Meeting.aggregate([
      // Match meetings where the user is an attendee and not permanently deleted
      {
        $match: {
          attendees: userObjectId,
          permanetDeleted: false, // Correct the field name if necessary
        },
      },
      // Lookup corresponding schedulers
      {
        $lookup: {
          from: "schedulers", // Name of the schedulers collection
          localField: "_id",
          foreignField: "meetingId", // Adjust this field name if necessary
          as: "schedulers",
        },
      },
      // Unwind the schedulers array to flatten the results
      {
        $unwind: "$schedulers",
      },
      // Match only schedulers that are not permanently deleted
      {
        $match: {
          "schedulers.permanentDeleted": false, // Adjust the field name if necessary
        },
      },
      // Group by schedulers to remove duplicate scheduler entries
      {
        $group: {
          _id: "$schedulers._id",
          scheduler: { $first: "$schedulers" },
        },
      },
      // Replace root to clean up the result structure
      {
        $replaceRoot: { newRoot: "$scheduler" },
      },
    ]);

    return res.status(200).json({ success: true, data: schedulers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single scheduler by id
exports.getScheduler = async (req, res) => {
  try {
    const scheduler = await Scheduler.findById(req.params.id);
    if (!scheduler) {
      return res
        .status(404)
        .json({ success: false, message: "Scheduler not found" });
    }
    res.status(200).json({ success: true, data: scheduler });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
