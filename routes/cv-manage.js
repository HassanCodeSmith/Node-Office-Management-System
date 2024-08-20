const express = require("express");
const upload = require("../utils/upload");
const cvRouter = express.Router();
const {
  addCV,
  getAllCV,
  getCV,
  updateCV,
  deleteCV,
} = require("../controllers/cv-manage");
const auth = require("../middlewares/authentication");
const hrAuth = require("../middlewares/hrAuth");

cvRouter.post("/addCv", upload.any(), addCV);
cvRouter.get("/getAllCv", auth, getAllCV);
cvRouter.get("/getCv/:cid", auth, getCV);
cvRouter.put("/updateCv/:cid", auth, upload.single("cvFile"), updateCV);
cvRouter.delete("/deleteCv/:cid", deleteCV);

module.exports = cvRouter;
