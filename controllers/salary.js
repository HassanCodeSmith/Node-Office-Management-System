const Salary = require("../models/Salary");
const user = require("../models/user");

exports.createSalary = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, deduction, bonus } = req.body;

    if (!(employeeId || month || year || deduction || bonus || basicSalary)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const valid = await user.findById(employeeId);
    console.log("Is Employee Valid: ", valid);
    if (!valid) {
      console.log("Employee Not Found");
      return res
        .status(404)
        .json({ success: false, message: "Employee Not Found" });
    }

    const isSalaryAllreadyCreatedForCurrentMonth = await Salary.findOne({
      employeeId,
      month,
      permanentDeleted: false,
    });

    if (isSalaryAllreadyCreatedForCurrentMonth) {
      console.log("Salary for this month is already created this employ");
      return res.status(409).json({
        success: false,
        message: "Salary for this month is already created this employ",
      });
    }

    const totalSalary = Number(basicSalary) + Number(bonus) - Number(deduction);
    const salary = await Salary.create({
      employeeId,
      month,
      year,
      basicSalary,
      deduction,
      bonus,
      totalSalary,
    });
    return res.status(200).json({
      success: true,
      data: salary,
      message: "Salary Saved Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllSalaries = async (req, res) => {
  try {
    const salary = await Salary.find({ permanentDeleted: false }).populate({
      path: "employeeId",
      select: "name phone email",
    });
    if (!salary) {
      return res
        .status(400)
        .json({ success: false, message: "No salaries included yet" });
    }
    return res.status(200).json({ success: true, data: salary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSalary = async (req, res) => {
  try {
    const { salId } = req.params;
    const salary = await Salary.findOne({
      _id: salId,
      permanentDeleted: false,
    }).populate({
      path: "employeeId",
      select: "name phone email",
    });
    if (!salary) {
      return res
        .status(400)
        .json({ success: false, message: "No Salary For this Id" });
    }
    return res.status(200).json({ success: true, data: salary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const { salId } = req.params;
    const { month, year, basicSalary, deduction, bonus } = req.body;

    if (!(month || year || deduction || bonus || basicSalary)) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const totalSalary = Number(basicSalary) + Number(bonus) - Number(deduction);
    const salary = await Salary.findOneAndUpdate(
      { _id: salId },
      {
        month,
        year,
        basicSalary,
        deduction,
        bonus,
        totalSalary,
      },
      { new: true }
    );
    if (!salary) {
      return res
        .status(400)
        .json({ success: true, message: "Salary with this id can not update" });
    }
    return res.status(200).json({
      success: true,
      data: salary,
      message: "Salary Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    const { salId } = req.params;
    const salary = await Salary.findOneAndUpdate(
      { _id: salId, permanentDeleted: false },
      { permanentDeleted: true }
    );
    if (!salary) {
      return res
        .status(400)
        .json({ success: false, message: "Failed To Delete" });
    }
    return res.status(200).json({ success: true, message: "Salary Deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.salaryStatements = async (req, res) => {
  try {
    const userId = req.user.userId;
    const employee = await user.findById(userId);
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "No employee with this id" });
    }
    const salaries = await Salary.findOne({
      employeeId: userId,
      permanentDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "employeeId",
        select: "name phone email",
      });
    if (!salaries) {
      return res
        .status(400)
        .json({ success: false, message: "No Salary For Given ID yet" });
    }
    return res.status(200).json({ success: true, data: salaries });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.paymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const employee = await user.findById(userId);
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "No Employee With This Id" });
    }
    const salary = await Salary.find({
      employeeId: userId,
      permanentDeleted: false,
    })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "employeeId",
        select: "name phone email",
      });
    if (!salary) {
      return res
        .status(400)
        .json({ success: false, message: "No Salary For This Id" });
    }
    return res.status(200).json({ success: true, data: salary });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
