const Notification = require("../models/Notification.model");

/**
 * Get Notification
 */
exports.getNotification = async (req, res) => {
  try {
    const { userId } = req.user;

    const notification = await Notification.find({
      employeeId: userId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notifications feteched successfully",
      data: notification,
    });
  } catch (error) {
    console.log(error);
    return res.staus(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * read Notification
 */
exports.readNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findOneAndUpdate(
      { _id: notificationId },
      { isRead: true }
    );

    return res.status(200).json({
      success: true,
      message: "Notification readed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getNotificationSocket = async (userId) => {
  try {
    // const { userId } = req.user;

    const notification = await Notification.find({
      employeeId: userId,
    });
    // console.log(notification);
    // console.log(userId, "jahaha");
    return { data: notification };
  } catch (error) {
    console.log(error);
    return { message: error.message };
  }
};
