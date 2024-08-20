const CV_Manage = require("../models/CV_Manage");

exports.addCV = async (req, res) => {
  try {
    const { fullname, email, phone, address, education, experience, skill } =
      req.body;
    console.log(req.body);
    if (
      !fullname ||
      !email ||
      !phone ||
      !address ||
      !education ||
      !experience ||
      !skill
    ) {
      return res.status(400).json({
        success: false,
        message: "Please Provide all required fields",
      });
    }
    if (!req.files) {
      console.log(req.files);

      return res
        .status(400)
        .json({ success: false, mesasge: "Please upload cv" });
    } else {
      const cvFile = "/" + req.files[0].path;
      console.log(req.files);
      const cv = await CV_Manage.create({
        fullname,
        email,
        phone,
        address,
        education,
        experience,
        skill,
        cvFile,
      });
      return res.status(200).json({ success: true, data: cv });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
exports.getAllCV = async (req, res) => {
  try {
    const cv = await CV_Manage.find({ permanentDeleted: false });
    return res.status(200).json({ success: true, data: cv });
  } catch (error) {
    return res.status(400).json({ success: false, mesasge: error.message });
  }
};

exports.getCV = async (req, res) => {
  try {
    const { cid } = req.params;
    const cv = await CV_Manage.findOne({ _id: cid, permanentDeleted: false });
    if (!cv) {
      return res
        .status(400)
        .json({ success: false, message: "No cv with this Id" });
    }
    return res.status(200).json({ success: true, data: cv });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCV = async (req, res) => {
  try {
    const { cid } = req.params;
    const { fullname, email, phone, address, education, experience, skill } =
      req.body;
    if (req.file) {
      const cvFile = "/" + req.file.path;
      const cv = await CV_Manage.findByIdAndUpdate(
        cid,
        {
          fullname,
          email,
          phone,
          address,
          education,
          experience,
          skill,
          cvFile,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "CV Updated", data: cv });
    }
    const cv = await CV_Manage.findByIdAndUpdate(
      cid,
      {
        fullname,
        email,
        phone,
        address,
        education,
        experience,
        skill,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, data: cv, message: "CV Updated" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.mesasge });
  }
};

exports.deleteCV = async (req, res) => {
  try {
    const { cid } = req.params;
    const cv = await CV_Manage.findOneAndUpdate(
      { _id: cid, permanentDeleted: false },
      { permanentDeleted: true }
    );
    if (!cv) {
      return res
        .status(400)
        .json({ success: false, message: "No cv with this id" });
    }
    return res
      .status(200)
      .json({ success: true, message: "CV Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
