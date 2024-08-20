const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/authentication");
const {
  addUser,
  getAllUsers,
  getAllEmployee,
  getSingleEmployee,
  getAllHR,
  getSingleHR,
  getAllManagers,
  getSingleManager,
  getAllAccounts,
  getSingleAccount,
  updateUser,
  deleteUser,
  userProfile,
  userDetails,
  createAdmin,
  getAllTeamLeaders,
  getAllEmployeeByDepartment,
} = require("../controllers/user");
const adminAuth = require("../middlewares/adminAuth");
const managerAuth = require("../middlewares/managerAuth");

userRouter.post("/createAdmin", createAdmin);
userRouter.post("/addUser", auth, addUser);

userRouter.get("/allUser", auth, getAllUsers);
userRouter.get("/getAllEmployee", auth, getAllEmployee);
userRouter.get("/getEmployee/:empId", auth, getSingleEmployee);
userRouter.get("/getAllHr", auth, getAllHR);
userRouter.get("/getHr/:hrId", auth, getSingleHR);
userRouter.get("/userDetails/:userId", auth, userDetails);
userRouter.get("/getAllManager", auth, getAllManagers);
userRouter.get("/getManager/:managerId", auth, getSingleManager);
userRouter.get("/getAllAccounts", auth, getAllAccounts);
userRouter.get("/getAccount/:accId", auth, getSingleAccount);
userRouter.get("/userProfile", auth, userProfile);
userRouter.get("/getAllTeamLeaders", getAllTeamLeaders);
userRouter.put("/updateUser/:uId", auth, updateUser);
userRouter.delete("/deleteUser/:uId", auth, deleteUser);
userRouter.get("/getAllEmployeeByDepartment", auth, getAllEmployeeByDepartment);

module.exports = userRouter;
