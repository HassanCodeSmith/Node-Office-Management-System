const Complaint = require("../models/Complaints");
const user = require("../models/user");

exports.createComplaint = async (req, res) => {
  try {
    const { employeeId, title, description, suggestion } = req.body;
    if (!employeeId || !title || !description || !suggestion) {
      return res.status(400).json({
        success: false,
        message: "Please Provide all required fields",
      });
    }
    const valid = await user.findById(employeeId);
    if (!valid) {
      return res
        .status(400)
        .json({ success: false, message: "You can not perform this action" });
    }
    await Complaint.create({
      employeeId,
      title,
      description,
      suggestion,
    });
    return res
      .status(200)
      .json({ success: true, message: "Complaint Submitted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({});
    if (!complaints) {
      return res
        .status(400)
        .json({ success: false, message: "No Complaint Yet" });
    }
    return res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSingleComplaints = async (req, res) => {
  try {
    const { compId } = req.params;
    const complaint = await Complaint.findById(compId);
    if (!complaint) {
      return res
        .status(400)
        .json({ success: false, message: "No Complaint with this id" });
    }
    return res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateComplaints = async (req, res) => {
  try {
    const { compId } = req.params;
    const { employeeId, title, description, suggestion } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      compId,
      {
        employeeId,
        title,
        description,
        suggestion,
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Data Updated...", data: complaint });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const { compId } = req.params;
    const complaint = await Complaint.findByIdAndRemove(compId);
    if (!complaint) {
      return res
        .status(400)
        .json({ success: false, message: "No complaint with this id" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
