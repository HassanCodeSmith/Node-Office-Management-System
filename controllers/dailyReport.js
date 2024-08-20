const DailyReport = require("../models/DailyReport");
const user = require("../models/user");
const sendEmail = require("../utils/sendEmail");

/**
 * Create Daily Report
 */
exports.createReport = async (req, res) => {
  try {
    const employeeId = req.user.userId;

    const { dailySummary, date } = req.body;
    if (!dailySummary || !date) {
      console.log("__Date and Daily-Summary are required fields");
      return res.status(400).json({
        success: false,
        message: "Date and Daily-Summary are required fields",
      });
    }

    const employee = await user.findById(employeeId);

    let report;
    if (req.file) {
      const drFile = "/" + req.file.path;
      report = await DailyReport.create({
        employeeId,
        dailySummary,
        date,
        drFile,
      });
    } else {
      report = await DailyReport.create({
        employeeId,
        dailySummary,
        date,
      });
    }
    const allEmailers = await user.find({
      $or: [
        { role: "projectManager" },
        { role: "hr" },
        { $and: [{ department: employee.department }, { role: "teamLead" }] },
      ],
    });
    console.log("__All Emailer Persons\n", allEmailers);

    const allEmails = allEmailers.map((emailer) => emailer.email);
    console.log("__All Emails\n", allEmails);

    for (let i = 0; i < allEmailers.length; i++) {
      sendEmail({
        from: employee.email,
        to: allEmails[i],
        subject: "Employee Daily Report",
        html: `<>${report.dailySummary}</>`,
      });
      console.log("__Email sent to:", allEmails[i]);
    }
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get All Reports
 */
exports.getAllReports = async (req, res) => {
  try {
    const report = await DailyReport.find({}).populate({
      path: "employeeId",
      select: "name phone email jobTitle",
    });
    if (!report) {
      return res.status(400).json({ success: false, message: "No Report Yet" });
    }
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Report
 */
exports.getReport = async (req, res) => {
  try {
    const { repId } = req.params;
    const report = await DailyReport.findById(repId).populate({
      path: "employeeId",
      select: "name phone email jobTitle",
    });
    if (!report) {
      return res
        .status(400)
        .json({ success: false, message: "No Report With This Id" });
    }
    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update Report
 */
exports.updateReport = async (req, res) => {
  try {
    const { repId } = req.params;
    const findRep = await DailyReport.findById(repId);
    if (!findRep) {
      return res.status(400).json({ success: false, message: "Not Available" });
    }
    const { dailySummary, date } = req.body;
    let drFile = findRep.drFile;
    if (req.file) {
      const drFile = "/" + req.file.path;
      const report = await DailyReport.findByIdAndUpdate(
        repId,
        {
          dailySummary,
          // taskLink,
          date,
          drFile,
        },
        { new: true }
      );
      if (!report) {
        return res
          .status(400)
          .json({ success: false, message: "No Report With This Id" });
      }
      return res.status(200).json({ success: true, data: report });
    } else {
      const report = await DailyReport.findByIdAndUpdate(
        repId,
        {
          dailySummary,
          // taskLink,
          date,
          drFile,
        },
        { new: true }
      );
      if (!report) {
        return res
          .status(400)
          .json({ success: false, message: "No Report With This Id" });
      }
      return res.status(200).json({ success: true, data: report });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete Report
 */
exports.deleteReport = async (req, res) => {
  try {
    const { repId } = req.params;
    const report = await DailyReport.findByIdAndRemove(repId);
    if (!report) {
      return res
        .status(400)
        .json({ success: false, message: "No Report With This Id" });
    }
    return res.status(200).json({ success: true, message: "Report Deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Manager Feedback
 */
exports.managerFeedback = async (req, res) => {
  try {
    const { repId } = req.params;
    const { feedback } = req.body;
    const report = await DailyReport.findById(repId);
    if (!report) {
      return res
        .status(400)
        .json({ success: false, message: "No Report with given Id" });
    }
    if (!feedback) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Feedback" });
    }
    await DailyReport.findByIdAndUpdate(repId, {
      feedback,
    });
    return res.status(200).json({ success: true, message: "Report Updated" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
