/** create router instance */
const router = require("express").Router();

/** import utils */
const upload = require("../utils/upload");

/** import middlewares */
const userAuth = require("../middlewares/authentication");
const adminAuth = require("../middlewares/adminAuth");
const {
  createAnnouncement,
  updateAnnouncement,
} = require("../controllers/Announcement.controllers");

/** import controllers */

router
  .route("/createAnnouncement")
  .post(userAuth, upload.any(), createAnnouncement);
router
  .route("/updateAnnouncement/:announcementId")
  .patch(userAuth, upload.any(), updateAnnouncement);

module.exports = router;
