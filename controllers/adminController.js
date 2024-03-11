const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { SendToken } = require("../utils/SendToken");

const adminModel = require("../models/adminModel.js");
const employeeModel = require("../models/employeeModel.js");

exports.home = catchAsyncErrors((req, res) => {
  res.status(200).json({ message: "This is Admin Home Page" });
});

exports.signup = catchAsyncErrors(async (req, res, next) => {
  data = {
    name: "Sachin Pawar",
    email: "sachinspindofficial@gmail.com",
    password: "Sachin@2000",
    contact: " 0123456789",
  };
  const result = await new adminModel(req.body).save();
  res.status(200).json({ message: "SignUp Successfully!" });
});

exports.signin = catchAsyncErrors(async (req, res, next) => {
  const admin = await adminModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!admin) {
    return next(new ErrorHandler("Admin Not Found ", 500));
  }

  const isMatch = admin.comparepassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("Wrong Password", 500));

  SendToken(admin, 201, res);
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully Singout!" });
});

exports.allemployee = catchAsyncErrors(async (req, res, next) => {
  const employees = await employeeModel.find().populate("services").exec();

  res.status(200).json(employees);
});

exports.oneemployee = catchAsyncErrors(async (req, res, next) => {
  const employee = await employeeModel
    .findById(req.params.id)
    .populate("services");

  res.status(200).json(employee);
});
