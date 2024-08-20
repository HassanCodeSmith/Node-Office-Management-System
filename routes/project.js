const express = require("express");
const projectRouter = express.Router();
const {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  assignEmployee,
  changeProjectStatus,
  assignTeamLead,
  getAssignedProjectsById,
} = require("../controllers/project");
const auth = require("../middlewares/authentication");
const managerAuth = require("../middlewares/managerAuth");
const { managerFeedback } = require("../controllers/dailyReport");

projectRouter.post("/createProject", auth, createProject);
projectRouter.get("/getAllProjects", auth, getAllProjects);
projectRouter.get(
  "/getProject/:projectId",
  auth,
  // managerAuth,
  getSingleProject
);
projectRouter.post(
  "/updateProject/:projectId",
  auth,
  // managerAuth,
  updateProject
);
projectRouter.put(
  "/assignEmployee/:projectId",
  auth,
  // managerAuth,
  assignEmployee
);

projectRouter.put(
  "/assignTeamLead/:projectId",
  auth,
  // managerAuth,
  assignTeamLead
);

projectRouter.delete(
  "/deleteProject/:projectId",
  auth,
  // managerAuth,
  deleteProject
);

projectRouter.put("/changeProjectStatus/:projectId", auth, changeProjectStatus);
projectRouter.get("/getAssignedProjectsById", auth, getAssignedProjectsById);

module.exports = projectRouter;
