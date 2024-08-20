const express = require("express");
const meetingNotiRouter = express.Router();
const {
  createMeetingNoti,
  getAllMeetingNoti,
  getMeetingNoti,
  updateMeetingNoti,
  deleteMeetingNoti,
  employeeFeedback,
  assignAttendee,
} = require("../controllers/meetingNoti");
const auth = require("../middlewares/authentication");
const managerAuth = require("../middlewares/managerAuth");

meetingNotiRouter.post("/createNoti", auth, createMeetingNoti);
meetingNotiRouter.get("/getAllNoti", auth, getAllMeetingNoti);
meetingNotiRouter.get("/getNoti/:notiID", auth, getMeetingNoti);
meetingNotiRouter.put("/employeeFeedback/:notiID", auth, employeeFeedback);
meetingNotiRouter.put(
  "/updateNoti/:notiID",
  auth,
  // managerAuth,
  updateMeetingNoti
);

meetingNotiRouter.put(
  "/assignAttendee/:notiID",
  auth,
  // managerAuth,
  assignAttendee
);
meetingNotiRouter.delete(
  "/deleteNoti/:notiID",
  auth,
  // managerAuth,
  deleteMeetingNoti
);

module.exports = meetingNotiRouter;
