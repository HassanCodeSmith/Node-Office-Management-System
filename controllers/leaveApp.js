const LeaveApp = require("../models/LeaveApp");
const user = require("../models/user");

exports.createLeaveApp = async (req, res) => {
  try {
    const userId = req.user.userId;
    const User = await user.findById(userId);
    if (!User) {
      return res
        .status(400)
        .json({ success: false, message: "No Employee With This Id" });
    }
    const { leaveType, startDate, endDate, reason } = req.body;
    if (!leaveType || !startDate || !endDate || !reason) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }

    const leaveApp = await LeaveApp.create({
      employeeId: userId,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    return res.status(200).json({ success: true, data: leaveApp });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.leaveAppOther = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    if ((!employeeId, !leaveType || !startDate || !endDate || !reason)) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all required fields" });
    }
    const checkUser = await user.findById(employeeId);
    if (!checkUser) {
      return res
        .status(400)
        .json({ success: false, message: "No employee with this id" });
    }
    const leaveApp = await LeaveApp.create({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    return res.status(200).json({ success: true, data: leaveApp });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await LeaveApp.find({}).populate({
      path: "employeeId",
      select: "name phone email",
    });
    if (!applications) {
      return res
        .status(400)
        .json({ success: false, message: "No Applications yet" });
    }
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.singleEmpApplications = async (req, res) => {
  try {
    const { appId } = req.params;
    const applications = await LeaveApp.findById(appId).populate({
      path: "employeeId",
      select: "name phone email",
    });
    if (!applications) {
      return res.status(400).json({ success: false, message: "Invalid Id" });
    }
    return res.status(200).json({ success: true, data: applications });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteEmpApplication = async (req, res) => {
  try {
    const { appId } = req.params;
    const applications = await LeaveApp.findByIdAndRemove(appId);
    if (!applications) {
      return res
        .status(400)
        .json({ success: false, message: "No Employee With This Id" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateEmpApplication = async (req, res) => {
  try {
    const { userId } = req.user;
    const { appId } = req.params;
    const { leaveType, startDate, endDate, reason } = req.body;
    const checkStatus = await LeaveApp.findOne({
      _id: appId,
      employeeId: userId,
    });
    if (checkStatus.status === "rejected") {
      return res.status(200).json({
        success: true,
        message: "Your Application is Already Rejected",
      });
    }
    if (userId !== checkStatus.employeeId) {
      return res.status(400).json({
        success: false,
        message: "You are not allowed to edit this leave application",
      });
    }
    const application = await LeaveApp.findByIdAndUpdate(
      appId,
      {
        leaveType,
        startDate,
        endDate,
        reason,
      },
      { new: true }
    );
    if (!application) {
      return res
        .status(400)
        .json({ success: false, message: "No Application With This Id" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Leave Application Updated",
        data: application,
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.feedbackLeaveApp = async (req, res) => {
  try {
    console.log("in feedback leave");
    const { appId } = req.params;
    const { status } = req.body;
    console.log(req.body);
    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Please Give Feedback" });
    }
    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Feedback" });
    }
    const feedback = await LeaveApp.findByIdAndUpdate(
      appId,
      {
        status,
      },
      { new: true }
    );
    if (!feedback) {
      return res
        .status(400)
        .json({ success: false, message: "No Application for this id" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Feedback Submitted." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
