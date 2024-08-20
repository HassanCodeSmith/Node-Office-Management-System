const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendOtpEmail = require("../templates/sendOtp");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/user");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.trim() || !password.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill required fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "No User with this email" });
    }
    const isMatched = await user.comparePassword(password);

    if (!isMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Password is wrong" });
    }
    // if (user.role !== "admin") {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Only Admin can login here" });
    // }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: process.env.LIFE_TIME }
    );
    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      token,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
// exports.employeeLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!(email || password)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter Email & Password" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No user with this email" });
//     }
//     const isMatched = await user.comparePassword(password);
//     if (!isMatched) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Wrong Password" });
//     }
//     if (user.role !== "employee") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Only employee can login here" });
//     }
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         email: user.email,
//       },
//       process.env.SECRET_KEY,
//       {
//         expiresIn: process.env.LIFE_TIME,
//       }
//     );
//     return res
//       .status(200)
//       .json({ success: true, message: "Loged In", role: user.role, token });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

// exports.hrLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!(email || password)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Enter Email & Password" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No User with this email" });
//     }
//     isMatched = await user.comparePassword(password);
//     if (!isMatched) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Wrong Password" });
//     }
//     if (user.role !== "hr") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Only HR can login here" });
//     }
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.SECRET_KEY,
//       {
//         expiresIn: process.env.LIFE_TIME,
//       }
//     );
//     return res
//       .status(200)
//       .json({ success: true, message: "Loged In", role: user.role, token });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

// exports.managerLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!(email || password)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Please Provide Email & Password" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No User With This Email" });
//     }
//     const isMatched = await user.comparePassword(password);
//     if (!isMatched) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Wrong Password" });
//     }
//     if (user.role !== "manager") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Only Manager Can Login Here" });
//     }
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       process.env.SECRET_KEY,
//       {
//         expiresIn: process.env.LIFE_TIME,
//       }
//     );
//     return res
//       .status(200)
//       .json({ success: true, message: "Loged In", role: user.role, token });
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.forgetPasswordOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter email" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const otp = (Math.floor(Math.random() * 899999) + 100000).toString();
  const otpExpire = new Date(Date.now() + 5 * 60 * 1000);
  const salt = await bcrypt.genSalt(10);
  user.forgotPasswordOtp = await bcrypt.hash(otp, salt);
  user.forgotPasswordOtpExpire = otpExpire;
  await user.save();

  const emailTemplates = sendOtpEmail(user.name, otp);

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: emailTemplates,
    });
    console.log("Email sent successfully");
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.verifyPasswordOtp = async (req, res) => {
  try {
    const { email, forgotPasswordOtp } = req.body;
    if (!email || !forgotPasswordOtp) {
      return res
        .status(404)
        .json({ success: false, message: "Please enter email and OTP" });
    }
    const user = await User.findOne({
      email,
      forgotPasswordOtpExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Session expired" });
    }
    const valid = await user.campareForgotPasswordOtp(forgotPasswordOtp);

    if (valid) {
      await User.findOneAndUpdate(
        { email },

        {
          forgotPasswordOtp: "",
          setNewPassword: true,
        }
      );
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      return res.status(404).json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter email" });
    }
    const orignalUser = await User.findOne({ email });
    if (!orignalUser.setNewPassword) {
      return res
        .status(400)
        .json({ success: false, message: "You are not allowed" });
    }
    let { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords are not matching " });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        setNewPassword: false,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
