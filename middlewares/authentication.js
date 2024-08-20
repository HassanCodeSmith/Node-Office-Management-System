const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("__Please provide token");
    return res.status(400).json({
      success: false,
      messsage: "Please provide token",
    });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("__Token not found");
    return res.status(400).json({ success: false, message: "Token not found" });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(payload.userId);

    if (!user) {
      console.log("__Invalid user id - User not found with provided id");
      return res.status(400).json({
        success: false,
        error: "Invalid user id - User not found with provided id",
      });
    }

    if (user.permanentDeleted) {
      console.log("__User is deleted by admin");
      return res.status(400).json({
        success: false,
        error: "User is deleted by admin",
      });
    }

    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    console.log("__JWT verification failed:", error);
    return res.status(400).json({
      success: false,
      message: `JWT verification failed: ${error.message}`,
    });
  }
};

module.exports = auth;
