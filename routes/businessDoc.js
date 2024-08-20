const express = require("express");
const businessDocRouter = express.Router();
const upload = require("../utils/bussinessDocUpload");
const {
  addBusinessDoc,
  getAllBusinessDoc,
  getBusinessDoc,
  deleteBusinessDoc,
  updateBusinessDoc,
} = require("../controllers/businessDoc");
const auth = require("../middlewares/authentication");
const adminAuth = require("../middlewares/adminAuth");

businessDocRouter.post(
  "/addBusinessDoc",
  upload.single("file"),
  auth,
  addBusinessDoc
);
businessDocRouter.get("/getAllBusinessDoc", auth, getAllBusinessDoc);
businessDocRouter.get("/getBusinessDoc/:bdId", auth, getBusinessDoc);
businessDocRouter.patch(
  "/updateBusinessDoc/:bdId",
  upload.single("file"),
  updateBusinessDoc
);
businessDocRouter.delete(
  "/deleteBusinessDoc/:bdId",
  auth,
  // adminAuth,
  deleteBusinessDoc
);

module.exports = businessDocRouter;
