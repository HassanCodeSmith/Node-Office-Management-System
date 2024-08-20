/** create express router instance */
const router = require("express").Router();

/** import controllers */
const {
  getNotification,
  readNotification,
} = require("../controllers/notification.controllers");

/** import middlewares */
const auth = require("../middlewares/authentication");

router.route("/getNotification").get(auth, getNotification);
router.route("/readNotification/:notificationId").put(auth, readNotification);

module.exports = router;
