const express = require("express");
const attendenceRouter = express.Router();
const {
  createAttendence,
  getAttendence,
  getAllAttendence,
  updateAttendance,
  deleteAttendance,
  updateAttendanceTimeOUt,
  createAttendenceAdmin,
  getAttendenceByDate,
  getAttendenceByEmp,
} = require("../controllers/attendence");
const auth = require("../middlewares/authentication");
const managerAuth = require("../middlewares/managerAuth");
const adminAuth = require("../middlewares/adminAuth");

attendenceRouter.post("/createAttendenceAdmin", auth, createAttendence);
attendenceRouter.post("/getAttendenceByDate", auth, getAttendenceByDate);
// attendenceRouter.post(
//   "/createAttendenceAdmin",
//   auth,
//   // adminAuth,
//   createAttendenceAdmin
// );
attendenceRouter.get("/getAllAttendence", auth, getAllAttendence);
attendenceRouter.get(
  "/getAttendenceByEmp/:employeeId",
  auth,
  getAttendenceByEmp
);
attendenceRouter.get(
  "/getAttendence/:attendanceId",
  auth,
  // managerAuth,
  getAttendence
);
attendenceRouter.put(
  "/updateAttendence/:attendanceId",
  auth,
  // managerAuth,
  updateAttendance
);
attendenceRouter.patch(
  "/checkoutTime",
  auth,

  updateAttendanceTimeOUt
);
attendenceRouter.delete(
  "/deleteAttendence/:attendanceId",
  auth,
  // managerAuth,
  deleteAttendance
);

module.exports = attendenceRouter;
