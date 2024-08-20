const user = require("../models/user");

const managerAuth = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const User = await user.findById(userId);
    if (User.role === "admin") {
      req.role = User.role;
      next();
      return;
    }
    if (User.role === "manager") {
      req.role = User.role;
      next();
      return;
    }
    return res
      .status(400)
      .json({ success: false, message: "Authentication Invalid" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Authentication Invalid" });
  }
};

module.exports = managerAuth;
