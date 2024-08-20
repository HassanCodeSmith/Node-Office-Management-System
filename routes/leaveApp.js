const express = require("express");
const leaveRouter = express.Router();
const {
  createLeaveApp,
  getAllApplications,
  singleEmpApplications,
  updateEmpApplication,
  deleteEmpApplication,
  feedbackLeaveApp,
  leaveAppOther,
} = require("../controllers/leaveApp");
const auth = require("../middlewares/authentication");
const managerAuth = require("../middlewares/managerAuth");

leaveRouter.post("/createLeave", auth, createLeaveApp);
leaveRouter.post("/createLeaveOther", auth, leaveAppOther);
leaveRouter.get("/getAllApps", auth, getAllApplications);
leaveRouter.get("/singleApp/:appId", auth, singleEmpApplications);
leaveRouter.put("/updateApp/:appId", auth, updateEmpApplication);
leaveRouter.put(
  "/feedbackLeaveApp/:appId",
  // auth,
  // managerAuth,
  feedbackLeaveApp
);
leaveRouter.delete(
  "/deleteApp/:appId",
  auth,
  // managerAuth,
  deleteEmpApplication
);

module.exports = leaveRouter;
