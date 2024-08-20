const Estimation = require("../models/estimationForm");

exports.createEstimation = async (req, res) => {
  try {
    const { projectId, startTime, endTime, comment } = req.body;
    if (!projectId || !startTime) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Required Fields!" });
    }
    const exists = await Estimation.findOne({ projectId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Estimation Already Created For This Project",
      });
    } else {
      const estimationForm = await Estimation.create({
        projectId,
        startTime,
        endTime,
        comment,
      });
      return res.status(200).json({ success: true, data: estimationForm });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllEstimation = async (req, res) => {
  try {
    const estimationForm = await Estimation.find({}).populate({
      path: "projectId",
      select: "title description startDate endDate",
    });
    if (!estimationForm) {
      return res
        .status(400)
        .json({ success: false, message: "No Estimation Form Yet!" });
    }
    return res.status(200).json({ success: true, data: estimationForm });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getEstimation = async (req, res) => {
  try {
    const { estId } = req.params;
    const estimationForm = await Estimation.findById(estId).populate({
      path: "projectId",
      select: "title description startDate endDate",
    });
    if (!estimationForm) {
      return res
        .status(400)
        .json({ success: false, message: "No estimation Form With This Id!" });
    }
    return res.status(200).json({ success: true, data: estimationForm });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateEstimation = async (req, res) => {
  try {
    const { estId } = req.params;
    const { projectId, startTime, endTime, comment } = req.body;
    const estimationForm = await Estimation.findByIdAndUpdate(
      estId,
      {
        projectId,
        startTime,
        endTime,
        comment,
      },
      { new: true }
    );
    if (!estimationForm) {
      return res
        .status(400)
        .json({ success: false, message: "No Estimation Form With This Id!" });
    }
    return res.status(200).json({ success: true, data: estimationForm });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteEstimation = async (req, res) => {
  try {
    const { estId } = req.params;
    const estimationForm = await Estimation.findByIdAndRemove(estId);
    if (!estimationForm) {
      return res.status(400).json({
        success: false,
        message: "No Estimation Form With This Id Yet!",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
