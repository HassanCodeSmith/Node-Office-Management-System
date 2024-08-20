const user = require("../models/user");
const Attendence = require("../models/Attendence");

exports.createAttendence = async (req, res) => {
  try {
    const { date, status, employeeId } = req.body;
    // console.log(date, "sdsadsaldjsajflajflsajfal");

    if (!date || !status.trim() || !employeeId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Required Fields",
      });
    }

    const isEmployeeValid = await user.findOne({ _id: employeeId });

    if (!isEmployeeValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee Id",
      });
    }

    const findAttendence = await Attendence.findOne({ employeeId, date });

    if (findAttendence) {
      findAttendence.status = status;
      await findAttendence.save();
      return res.status(200).json({
        success: true,
        message: "Attendence Updated",
      });
    }

    await Attendence.create({ date, status, employeeId });
    return res.status(200).json({
      success: true,
      message: "Attendence Marked",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAttendenceAdmin = async (req, res) => {
  try {
    const { date, status, employeeId } = req.body;
    if (!date || !status || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Required Fields",
      });
    }
    const validEmployee = await user.findOne({ _id: employeeId });
    if (!validEmployee) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Employee Id" });
    }
    await Attendence.create({ date, status, employeeId });
    return res
      .status(200)
      .json({ success: true, message: "Attendence Marked!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllAttendence = async (req, res) => {
  try {
    const attendence = await Attendence.find({
      permanentDeleted: false,
    })
      .populate("employeeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: attendence });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAttendence = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const attendence = await Attendence.findOne({
      _id: attendanceId,
      permanentDeleted: false,
    }).populate({
      path: "employeeId",
      select: "name phone email",
    });
    return res.status(200).json({ success: true, data: attendence });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAttendanceTimeOUt = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const checkout = Date.now();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const latestAttnds = await Attendence.findOne({
      createdAt: { $gte: twentyFourHoursAgo },
      employeeId,
    });
    if (!latestAttnds) {
      return res.status(400).json({
        success: false,
        message: "You have not marked attendence today!",
      });
    }
    const checkoutTime = await Attendence.findOneAndUpdate(
      { _id: latestAttnds._id },
      {
        checkout,
      },
      { new: true }
    );
    return res.status(200).json({ success: true, data: checkoutTime });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status } = req.body;

    const updatedAttendance = await Attendence.findByIdAndUpdate(
      attendanceId,
      { status },
      { new: true }
    );

    if (!updatedAttendance) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance not found" });
    }

    return res.status(200).json({ success: true, data: updatedAttendance });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    const getAttendence = await Attendence.findOne({ _id: attendanceId });

    if (getAttendence.permanentDeleted) {
      return res.status(400).json({
        success: false,
        error: "Attendence already deleted",
      });
    }

    getAttendence.permanentDeleted = true;
    await getAttendence.save();

    return res
      .status(200)
      .json({ success: true, message: "Attendance deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAttendenceByDate = async (req, res) => {
  try {
    const { date } = req.body;
    // console.log("*__Get Attendence Body__*", typeof date);

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Date" });
    }

    // const extractedDate = new Date(date.$d).toISOString().split("T")[0];
    // console.log(extractedDate);

    // const utcDate = new Date(date).toISOString();
    // console.log(utcDate);

    const attendance = await Attendence.find({
      date,
    }).populate({
      path: "employeeId",
      select: "name role jobTitle",
    });
    // const attendance1 = await Attendence.find({}).populate({
    //   path: "employeeId",
    //   select: "name role jobTitle",
    // });
    // console.log("sasasasa", attendance1);
    if (!attendance || attendance.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No Attendance for the given date" });
    }

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttendenceByEmp = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attnds = await Attendence.find({ employeeId }).populate({
      path: "employeeId",
      select: "name role jobTitle",
    });
    if (!attnds) {
      return res
        .status(200)
        .json({ success: true, message: "No Attendence Available" });
    }
    return res.status(200).json({ success: true, data: attnds });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
