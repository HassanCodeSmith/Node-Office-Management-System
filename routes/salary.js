const express = require("express");
const salaryRouter = express.Router();
const {
  createSalary,
  getAllSalaries,
  getSalary,
  updateSalary,
  deleteSalary,
  salaryStatements,
  paymentHistory,
} = require("../controllers/salary");
const auth = require("../middlewares/authentication");
const managerAuth = require("../middlewares/managerAuth");

salaryRouter.post("/createSalary", auth, createSalary);
salaryRouter.get("/getAllSalary", auth, getAllSalaries);
salaryRouter.get("/getSalary/:salId", auth, getSalary);
salaryRouter.get("/getSalaryStatement", auth, salaryStatements);
salaryRouter.put("/updateSalary/:salId", auth, updateSalary);
salaryRouter.delete("/deleteSalary/:salId", auth, deleteSalary);
salaryRouter.get("/paymentHistory", auth, paymentHistory);

module.exports = salaryRouter;
