const User = require("../models/user");
const Salary = require("../models/Salary");
const Attendence = require("../models/Attendence");
const LeaveApp = require("../models/LeaveApp");

/**
 * Create Admin
 */
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    return res.status(200).json({
      success: true,
      message: "Admin created successfully.",
    });
  } catch (error) {
    console.log("Create Admin API Error: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Add User
 */
exports.addUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      jobTitle,
      joiningDate,
      salary,
      role,
      department,
    } = req.body;
    console.log(req.body);
    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !jobTitle ||
      !joiningDate ||
      !salary ||
      !role ||
      !department
    ) {
      return res.status(400).json({
        success: false,
        message: "Please Provide All Required Fields",
      });
    }
    const { password, confirmPass } = req.body;
    if (!password || !confirmPass) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Password & Confirm Password",
      });
    }
    if (password !== confirmPass) {
      return res.status(400).json({
        success: false,
        message: "Password & Confirm Password didn't Matched",
      });
    }
    const user = await User.create({
      name,
      phone,
      email,
      address,
      password,
      jobTitle,
      joiningDate,
      salary,
      role,
      department,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get All Users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find({ permanentDeleted: false }).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "No user registered yet" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get All Employees Expect Admin
 */
exports.getAllEmployee = async (req, res) => {
  try {
    const users = await User.find({
      permanentDeleted: false,
      $or: [
        { role: "employee" },
        { role: "cto" },
        { role: "hr" },
        { role: "manager" },
        { role: "projectManager" },
        { role: "teamLead" },
      ],
    }).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );

    if (!users) {
      return res
        .status(400)
        .json({ success: false, message: "No Employee Yet" });
    }

    const employeeCount = users.length;

    const data = users.map((user) => {
      if (user.role === "employee") {
        user.role = "Employee";
      } else if (user.role === "cto") {
        user.role = "CTO";
      } else if (user.role === "hr") {
        user.role = "HR";
      } else if (user.role === "manager") {
        user.role = "Manager";
      } else if (user.role === "projectManager") {
        user.role = "Project Manager";
      } else if (user.role === "teamLead") {
        user.role = "Team Lead";
      }
      return user;
    });

    return res.status(200).json({ success: true, data, count: employeeCount });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Single Employee
 */
exports.getSingleEmployee = async (req, res) => {
  try {
    const { empId } = req.params;
    const employee = await User.findOne({
      _id: empId,
      permanentDeleted: false,
    }).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "No employee found with this ID" });
    }

    return res.status(200).json({ success: true, data: employee });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update User
 */
exports.updateUser = async (req, res) => {
  try {
    const { uId } = req.params;
    const {
      name,
      id,
      phone,
      email,
      address,
      jobTitle,
      joiningDate,
      salary,
      role,
      department,
    } = req.body;
    console.log(role);
    const find = await User.findByIdAndUpdate(
      uId,
      {
        name,
        id,
        phone,
        email,
        address,
        jobTitle,
        joiningDate,
        salary,
        role,
        department,
      },
      { new: true }
    );
    if (!find) {
      return res
        .status(400)
        .json({ success: false, message: "No user with this id" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User Updated", data: find });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete User
 */
exports.deleteUser = async (req, res) => {
  try {
    const { uId } = req.params;
    const find = await User.findOneAndUpdate(
      { _id: uId, permanentDeleted: false },
      {
        permanentDeleted: true,
      }
    );
    if (!find) {
      return res
        .status(400)
        .json({ success: false, message: "No user with this id" });
    }
    return res.status(200).json({ success: true, message: "Employee deleted" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get All HRs
 */
exports.getAllHR = async (req, res) => {
  try {
    const hr = await User.find({ role: "hr" }).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );
    if (!hr) {
      return res.status(400).json({ success: false, message: "No HR yet" });
    }
    const hrCount = hr.length;
    return res.status(200).json({ success: true, data: hr, count: hrCount });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Single HR
 */
exports.getSingleHR = async (req, res) => {
  try {
    const { hrId } = req.params;
    const hr = await User.findById(hrId).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );
    if (!hr) {
      return res
        .status(400)
        .json({ success: false, message: "No HR with this id" });
    }
    return res.status(200).json({ success: true, data: hr });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get All Managers
 */
exports.getAllManagers = async (req, res) => {
  try {
    const manager = await User.find({ role: "manager" }).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );
    if (!manager) {
      return res
        .status(400)
        .json({ success: false, message: "No Manager Yet" });
    }
    const managerCount = manager.length;
    return res
      .status(200)
      .json({ success: true, data: manager, count: managerCount });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Single Manager
 */
exports.getSingleManager = async (req, res) => {
  try {
    const { managerId } = req.params;
    const manager = await User.findById(managerId).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );
    if (!manager) {
      return res
        .status(400)
        .json({ success: false, message: "No Manager With Id" });
    }
    return res.status(200).json({ success: true, data: manager });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get All Accounts
 */
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await User.find({ role: "accounts" }).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );
    if (!accounts) {
      return res
        .status(400)
        .json({ success: false, message: "No Accounts Role Yet" });
    }
    const accountsCount = accounts.length;
    return res
      .status(200)
      .json({ success: true, data: accounts, count: accountsCount });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get Single Account
 */
exports.getSingleAccount = async (req, res) => {
  try {
    const { accId } = req.params;
    const accounts = await User.findById(accId).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );
    if (!accounts) {
      return res
        .status(400)
        .json({ success: false, message: "No Accounts Role with this id" });
    }
    return res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * User Profile
 */
exports.userProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await User.findById(userId).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );
    if (!profile) {
      return res
        .status(400)
        .json({ success: false, message: "No User Found!" });
    }
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * User Details
 */
exports.userDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const employeeInfo = await User.findOne({ _id: userId }).select(
      "-forgotPasswordOtp -forgotPasswordOtpExpire -setNewPassword -password"
    );
    if (!employeeInfo) {
      return res
        .status(400)
        .json({ success: false, message: "Employee Not Found" });
    }
    const attnds = await Attendence.find({ employeeId: userId });
    if (!attnds) {
      return res
        .status(400)
        .json({ success: false, message: "No Attendence Available" });
    }
    const salary = await Salary.find({ employeeId: userId });
    if (!salary) {
      return res
        .status(400)
        .json({ success: false, message: "No Salary Available" });
    }
    const leaves = await LeaveApp.find({ employeeId: userId });
    if (!leaves) {
      return res
        .status(400)
        .json({ success: false, message: "No Leave Applications" });
    }
    return res.status(200).json({
      success: true,
      data: employeeInfo,
      Attendence: attnds,
      Salary: salary,
      Leaves: leaves,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get All Team Leaders
 */
exports.getAllTeamLeaders = async (req, res) => {
  try {
    const teamLeaders = await User.find({
      role: "teamLead",
      permanentDeleted: false,
    });

    if (teamLeaders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Currently there is no any team leader",
        data: teamLeaders,
      });
    }

    const data = teamLeaders.map((obj) => {
      obj.role = "Team Leader";
      return obj;
    });

    return res.status(200).json({
      success: true,
      message: "Team leader's list fetched successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get All Employee With Department Name
 */
exports.getAllEmployeeByDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    const employees = await User.find({ department, permanentDeleted: false });

    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: true,
      error: error.message,
    });
  }
};
