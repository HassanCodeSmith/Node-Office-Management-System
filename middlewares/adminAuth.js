const user = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const User = await user.findById(userId);
    if (User.role === "admin") {
      req.role = User.role;
      next();
      return;
    }
    return res
      .status(400)
      .json({ success: false, message: "Authentication invalid" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Authentication invalid" });
  }
};

module.exports = adminAuth;
