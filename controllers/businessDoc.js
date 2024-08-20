const BusinessDoc = require("../models/BusinessDoc");
const Project = require("../models/Project");

exports.addBusinessDoc = async (req, res) => {
  try {
    const { projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "No project with Given Id" });
    }
    // const files = req.files.map((file) => "/" + file.path);
    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Id & file" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please Upload A File!" });
    } else {
      const file = "/" + req.file.path;
      const businessDoc = await BusinessDoc.create({ projectId, file });
    }
    return res.status(200).json({ success: true, message: "File Uploaded" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllBusinessDoc = async (req, res) => {
  try {
    const businessDoc = await BusinessDoc.find({}).populate({
      path: "projectId",
      select: "title description startDate endDate",
    });
    if (!businessDoc) {
      return res
        .status(400)
        .json({ success: false, message: "No Document Added Yet" });
    }
    return res.status(200).json({ success: true, data: businessDoc });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getBusinessDoc = async (req, res) => {
  try {
    const { bdId } = req.params;
    const businessDoc = await BusinessDoc.findById(bdId).populate({
      path: "projectId",
      select: "title description startDate endDate",
    });
    if (!businessDoc) {
      return res
        .status(400)
        .json({ success: false, message: "No Document With This id" });
    }
    return res.status(200).json({ success: true, data: businessDoc });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBusinessDoc = async (req, res) => {
  try {
    const { bdId } = req.params;
    const businessDoc = await BusinessDoc.findById(bdId);
    if (!businessDoc) {
      return res
        .status(400)
        .json({ success: false, message: "No Document With This Id" });
    }
    // const files = req.files.map((file) => "/" + file.path);
    if (req.file) {
      const file = "/" + req.file.path;
      const businessDocUpdated = await BusinessDoc.findByIdAndUpdate(bdId, {
        file,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Document Updated..." });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBusinessDoc = async (req, res) => {
  try {
    const { bdId } = req.params;
    const businessDoc = await BusinessDoc.findByIdAndRemove(bdId);
    if (!businessDoc) {
      return res
        .status(400)
        .json({ success: false, message: "No Document With This Id" });
    }
    return res.status(200).json({ success: true, message: "Document Deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
