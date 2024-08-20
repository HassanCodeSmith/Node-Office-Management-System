const Announcement = require("../models/Announcement.model");

/**
 * Create Announcement
 */
exports.createAnnouncement = async (req, res) => {
  try {
    const { userId } = req.user;

    trimObjects(req.body);

    const { title, description, date } = req.body;

    if (!(title && description && date)) {
      console.log("__Title, Description and Date are required fields");
      return res.status(400).json({
        success: false,
        message: "Title, Description and Date are required fields",
      });
    }

    if (req.files) {
      const attachments = req.files.map((attachment) => "/" + attachment.path);
      req.body.attachments = attachments;
    }

    req.body.createdBy = userId;

    const newAnnouncement = await Announcement.create(req.body);

    return res.status(200).json({
      success: true,
      message: "Announcement created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/** _____Trim req.body Object_____ */
function trimObjects(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    }
    if (typeof obj[key] === "object") {
      trimObjects(obj[key]);
    }
  }
}

exports.getAnnouncementSocket = async () => {
  try {
    // const { userId } = req.user;

    const announcement = await Announcement.find({});

    return { data: announcement };
  } catch (error) {
    console.log(error);
    return { message: error.message };
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    trimObjects(req.body);

    const { title, description, date } = req.body;

    if (req.files) {
      const attachments = req.files.map((attachment) => "/" + attachment.path);
      req.body.attachments = attachments;
      await Announcement.findOneAndUpdate(
        { _id: announcementId },
        { title, description, date, attachments }
      );
    }

    await Announcement.findOneAndUpdate(
      { _id: announcementId },
      { title, description, date }
    );

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
