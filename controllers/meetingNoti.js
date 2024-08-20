const MeetingNoti = require("../models/MeetingNoti");
const user = require("../models/user");
const Notification = require("../models/Notification.model");
const Scheduler = require("../models/Scheduler.model");

const sendEmail = require("../utils/sendEmail");

exports.createMeetingNoti = async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      title,
      description,
      agenda,
      date,
      startTime,
      endTime,
      meetingLink,
    } = req.body;

    if (!title || !description || !agenda || !date || !startTime || !endTime) {
      console.log("__Please Provide All Required Fields");
      return res.status(400).json({
        success: false,
        message: "Please Provide All Required Fields",
      });
    }

    const notification = await MeetingNoti.create(req.body);

    await Scheduler.create({
      start: startTime,
      end: endTime,
      title,
      meetingLink,
      meetingId: notification._id,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.log("__Internal Server Error in createMeetingNoti: ", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllMeetingNoti = async (req, res) => {
  try {
    const notification = await MeetingNoti.find({
      permanetDeleted: false,
    })
      .populate("attendees", "name email role")
      .sort({ updatedAt: -1 });
    if (!notification) {
      return res
        .status(400)
        .json({ success: false, message: "No meeting Yet" });
    }
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMeetingNoti = async (req, res) => {
  try {
    const { notiID } = req.params;
    const notification = await MeetingNoti.findOne({
      _id: notiID,
      permanetDeleted: false,
    });
    if (!notification) {
      return res
        .status(400)
        .json({ success: false, message: "No meething with this id" });
    }
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateMeetingNoti = async (req, res) => {
  try {
    const { notiID } = req.params;
    const {
      title,
      description,
      date,
      agenda,
      startTime,
      endTime,
      meetingLink,
    } = req.body;

    const notification = await MeetingNoti.findOneAndUpdate(
      { _id: notiID },
      {
        title,
        description,
        date,
        agenda,
        startTime,
        endTime,
        meetingLink,
      },
      { new: true }
    );
    if (!notification) {
      return res
        .status(400)
        .json({ success: false, message: "No meething found" });
    }
    const updatedScheduler = await Scheduler.findOneAndUpdate(
      { meetingId: notiID },
      { start: startTime, end: endTime, title, meetingLink },
      { new: true }
    );

    if (!updatedScheduler) {
      return res
        .status(400)
        .json({ success: false, message: "No scheduler found" });
    }
    console.log("____notification", notification);
    console.log("____updatedScheduler", updatedScheduler);

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMeetingNoti = async (req, res) => {
  try {
    const { notiID } = req.params;
    const notification = await MeetingNoti.findOneAndUpdate(
      { _id: notiID },
      { permanetDeleted: true }
    );
    if (!notification) {
      return res
        .status(400)
        .json({ success: false, message: "No meething with this id" });
    }
    const scheduler = await Scheduler.findOneAndUpdate(
      { meetingId: notiID },
      { permanentDeleted: true },
      { new: true }
    );
    if (!scheduler) {
      console.log("=> No scheduler found with provided id");
    }
    console.log("__Deleted scheduler:", scheduler);
    return res
      .status(200)
      .json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.employeeFeedback = async (req, res) => {
  try {
    const { notiID } = req.params;
    const { response, employeeId } = req.body;
    if (!(response || employeeId)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter required fields" });
    }
    const noti = await MeetingNoti.findById(notiID);
    if (!noti) {
      return res
        .status(400)
        .json({ success: false, message: "No notification with this id" });
    }
    if (!["pending", "accepted", "declined", "reschedule"].includes(response)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid feedback value" });
    }
    const existingFeedback = noti.feedback.find(
      (fb) => fb.employeeId.toString() === employeeId
    );
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback already provided by employee",
      });
    }
    const notification = await MeetingNoti.findByIdAndUpdate(
      notiID,
      {
        $push: { feedback: { response, employeeId } },
      },
      { new: true }
    );
    if (!notification) {
      return res
        .status(400)
        .json({ success: false, message: "No notification with this Id" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Feedback submitted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.assignAttendee = async (req, res) => {
  try {
    const { notiID } = req.params;
    const { attendees } = req.body;

    console.log("Noti Id: ", notiID);
    // console.log("attendees Ids array: ", notiID);

    const employee = await MeetingNoti.findOne({ _id: notiID });

    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong employee id" });
    }
    const assignedEmployee = await MeetingNoti.findOneAndUpdate(
      { _id: notiID },
      {
        attendees,
      },
      { new: true }
    );

    for (let i = 0; i < attendees.length; i++) {
      await Notification.create({
        title: "Meeting Invitation",
        description: "You have invited for new meeting",
        type: "Meeting",
        employeeId: attendees[i],
      });
      const employee = await user.findOne({ _id: attendees[i] });
      sendEmail({
        to: employee.email,
        subject: "Invitation for new meeting",
        html: `<p>You have invited for new meeting</p>`,
      });
    }
    return res.status(200).json({ success: true, data: assignedEmployee });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
