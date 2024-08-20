const express = require("express");
const dailyReportRouter = express.Router();
const {
  createReport,
  getAllReports,
  getReport,
  deleteReport,
  updateReport,
  managerFeedback,
} = require("../controllers/dailyReport");
const auth = require("../middlewares/authentication");
const upload = require("../utils/upload");
const managerAuth = require("../middlewares/managerAuth");

dailyReportRouter.post(
  "/createReport",
  auth,
  upload.single("drFile"),
  createReport
);
dailyReportRouter.get("/getAllReports", auth, getAllReports);
dailyReportRouter.get("/getReport/:repId", auth, getReport);
dailyReportRouter.delete(
  "/deleteReport/:repId",
  auth,
  // managerAuth,
  deleteReport
);
dailyReportRouter.put(
  "/updateReport/:repId",
  auth,
  // managerAuth,
  upload.single("drFile"),
  updateReport
);
dailyReportRouter.put(
  "/managerFeedback/:repId",
  auth,
  // managerAuth,
  managerFeedback
);

module.exports = dailyReportRouter;
