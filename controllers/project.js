const Project = require("../models/Project");
const Estimation = require("../models/estimationForm");
const BusinessDoc = require("../models/BusinessDoc");
const User = require("../models/user");
const Notification = require("../models/Notification.model");
const sendEmail = require("../utils/sendEmail");

exports.createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    // const check = await user.find({ _id: { $in: assignedEmployees } });
    // if (check.length !== assignedEmployees.length) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "One or more assigned employees not found",
    //   });
    // }

    const project = await Project.create({
      title,
      description,
      startDate,
      endDate,
    });
    return res
      .status(200)
      .json({ success: true, message: "Project Created", data: project });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    let page = req.query.page || undefined;
    let limit = req.query.limit || 5;
    const projects = await Project.find({})
      .populate({
        path: "assignEmployee",
        select: "name phone email",
      })
      .sort({ createdAt: -1 });
    let result = await Promise.all(
      projects.map(async (project) => {
        const estimate = await Estimation.findOne({ projectId: project._id });
        const businessDoc = await BusinessDoc.findOne({
          projectId: project._id,
        });
        return {
          project,
          estimate: estimate ? estimate : null,
          businessDoc: businessDoc ? businessDoc : null,
        };
      })
    );
    if (!projects) {
      return res
        .status(400)
        .json({ success: false, message: "No Project Yet" });
    }
    let total = result.length;
    if (limit && page) {
      let startIndex = (page - 1) * limit;
      let endIndex = page * limit;
      result = result.slice(startIndex, endIndex);
    }
    return res.status(200).json({ success: true, data: result, total });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getSingleProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate(
      "assignTeamLead",
      "name email"
    );

    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "No project with this id" });
    }

    const result = await Promise.all([
      {
        project,
        estimate: await Estimation.findOne({ projectId: project._id }),
        businessDoc: await BusinessDoc.findOne({ projectId: project._id }),
      },
    ]);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, startDate, endDate } = req.body;
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        startDate,
        endDate,
        // $push: { assignedEmployees: assignedEmployees },
      },
      { new: true }
    );
    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "No project with this id" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Data Updated...", data: project });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByIdAndRemove(projectId);
    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "No project with this id" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Assign Employee
 */
exports.assignEmployee = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { employeeId } = req.body;

    const employee = await User.findById(employeeId);
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Employee Id" });
    }

    if (employee.permanentDeleted) {
      return res
        .status(400)
        .json({ success: false, message: "This employee is deleted" });
    }

    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      console.log("Invaild project ID");
      return res.status(400).json({
        success: false,
        error: "Invaild project ID",
      });
    }

    if (project.status === "cancelled") {
      console.log("This project is cancelled");
      return res.status(400).json({
        success: false,
        error: "This project is cancelled",
      });
    }

    project.assignEmployee = employeeId;
    await project.save();

    await Notification.create({
      title: "Project Assigned",
      description: "Team Leader assign you a new project",
      type: "Project",
      employeeId: employeeId,
    });

    sendEmail({
      to: employee.email,
      subject: "Assigned new Project",
      html: `<p>You have assigned new Project please check your portal</p>`,
    });
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Assign Team Lead
 */
exports.assignTeamLead = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { teamLeadId } = req.body;
    console.log(teamLeadId);

    const teamLead = await User.findById(teamLeadId);
    if (!teamLead) {
      console.log("Wrong team lead id");
      return res
        .status(400)
        .json({ success: false, message: "Wrong team lead id" });
    }

    if (teamLead.permanentDeleted) {
      console.log("This teamLead is deleted");
      return res
        .status(400)
        .json({ success: false, message: "This teamLead is deleted" });
    }

    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      console.log("Invaild project ID");
      return res.status(400).json({
        success: false,
        error: "Invaild project ID",
      });
    }

    if (project.status === "cancelled") {
      console.log("This project is cancelled");
      return res.status(400).json({
        success: false,
        error: "This project is cancelled",
      });
    }

    project.assignTeamLead = teamLeadId;
    await project.save();

    await Notification.create({
      title: "Project Assigned\n",
      description: "You have been assigned to a new project",
      type: "Project",
      employeeId: teamLeadId,
    });

    sendEmail({
      to: teamLead.email,
      subject: "Assigned new Project",
      html: `<p>You have assigned new Project please check your portal</p>`,
    });
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Get Assigned Project By Id
 */
exports.getAssignedProjectsById = async (req, res) => {
  try {
    const { userId } = req.user;

    const projects = await Project.find({
      $or: [{ assignEmployee: userId }, { assignTeamLead: userId }],
    });

    if (projects.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid id",
      });
    }

    const populatedProjects = await Promise.all(
      projects.map(async (project) => {
        if (project.assignEmployee == userId) {
          await project.populate("assignEmployee", "name phone email");
        } else if (project.assignTeamLead == userId) {
          await project.populate("assignTeamLead", "name phone email");
        }
        return project;
      })
    );

    let result = await Promise.all(
      populatedProjects.map(async (project) => {
        const estimate = await Estimation.findOne({ projectId: project._id });
        const businessDoc = await BusinessDoc.findOne({
          projectId: project._id,
        });
        return {
          project,
          estimate: estimate ? estimate : null,
          businessDoc: businessDoc ? businessDoc : null,
        };
      })
    );

    console.log("result", result);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Change Project Status
 */
exports.changeProjectStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    const { projectId } = req.params;
    const { status } = req.body;

    const project = await Project.findOne({
      _id: projectId,
    });

    if (!project) {
      return res.status(400).json({
        success: false,
        error: "Invalid Project ID",
      });
    }

    const user = await User.findOne({
      _id: userId,
    });

    if (user.role === "admin") {
      if (
        status === "cancelled" ||
        status === "delivered" ||
        status === "complete"
      ) {
        project.status = status;
        await project.save();
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid status for admin",
        });
      }
    } else if (user.role === "projectManager") {
      if (status === "delivered" || status === "complete") {
        if (project.status === "cancelled") {
          return res.status(400).json({
            success: false,
            error:
              "Admin cancelled this project, You can't change project's status",
          });
        }
        project.status = status;
        await project.save();
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid status for Project Manager",
        });
      }
    } else if (user.role === "employee") {
      if (status === "start" || status === "working") {
        if (project.status === "cancelled") {
          return res.status(400).json({
            success: false,
            error:
              "Admin cancelled this project, You can't change project's status",
          });
        }
        project.status = status;
        await project.save();
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid status for Employee",
        });
      }
    } else if (user.role === "teamLead") {
      if (status === "start" || status === "working" || status === "complete") {
        if (project.status === "cancelled") {
          return res.status(400).json({
            success: false,
            error:
              "Admin cancelled this project, You can't change project's status",
          });
        }
        project.status = status;
        await project.save();
      } else {
        return res.status(400).json({
          success: false,
          error: "Invalid status for Team Lead",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Project status updated`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
