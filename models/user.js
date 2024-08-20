const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: [true, "User already exist with this email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    address: String,
    jobTitle: String,
    joiningDate: {
      type: Date,
    },
    password: {
      type: String,
    },
    department: {
      type: String,
    },
    salary: String,
    role: {
      type: String,
      enum: [
        "employee",
        "admin",
        "cto",
        "hr",
        "manager",
        "projectManager",
        "teamLead",
      ],
      default: "employee",
    },
    forgotPasswordOtp: {
      type: String,
      default: "",
    },
    forgotPasswordOtpExpire: {
      type: Date,
      default: "",
    },
    setNewPassword: {
      type: Boolean,
      default: false,
    },
    permanentDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

userSchema.methods.compareOTP = async function (candidateOTP) {
  const isMatch = await bcrypt.compare(candidateOTP, this.otp);
  return isMatch;
};
userSchema.methods.campareForgotPasswordOtp = async function (
  forgotPasswordOtp
) {
  const isMatch = await bcrypt.compare(
    forgotPasswordOtp,
    this.forgotPasswordOtp
  );
  return isMatch;
};

module.exports = mongoose.model("user", userSchema);
