const express = require("express");
const estimationRouter = express.Router();
const {
  createEstimation,
  getAllEstimation,
  getEstimation,
  updateEstimation,
  deleteEstimation,
} = require("../controllers/estimationForm");
const auth = require("../middlewares/authentication");
const managerAuth = require("../middlewares/managerAuth");

estimationRouter.post("/createEstimation", auth, createEstimation);
estimationRouter.get("/getAllEstimation", auth, getAllEstimation);
estimationRouter.get("/getEstimation/:estId", auth, getEstimation);
estimationRouter.patch(
  "/updateEstimation/:estId",
  auth,
  // managerAuth,
  updateEstimation
);
estimationRouter.delete(
  "/deleteEstimation/:estId",
  auth,
  // managerAuth,
  deleteEstimation
);

module.exports = estimationRouter;
