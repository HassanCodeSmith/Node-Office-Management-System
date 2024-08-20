const express = require("express");
const router = express.Router();
const {
  getSchedulers,
  getScheduler,
} = require("../controllers/Scheduler.controllers");

const userAuth = require("../middlewares/authentication");

// Get all schedulers
router.get("/schedulers", userAuth, getSchedulers);

// Get a single scheduler by id
router.get("/schedulers/:id", getScheduler);

module.exports = router;
