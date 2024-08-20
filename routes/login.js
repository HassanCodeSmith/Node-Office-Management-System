const express = require("express");
const {
  adminLogin,
  forgetPasswordOtp,
  verifyPasswordOtp,
  resetPassword,
} = require("../controllers/login");

const adminRouter = express.Router();

adminRouter.post("/adminLogin", adminLogin);
// adminRouter.post("/employeeLogin", employeeLogin);
// adminRouter.post("/hrLogin", hrLogin);
// adminRouter.post("/managerLogin", managerLogin);
adminRouter.post("/forgotPassword", forgetPasswordOtp);
adminRouter.post("/verifyOTP", verifyPasswordOtp);
adminRouter.post("/resetPassword", resetPassword);

module.exports = adminRouter;
