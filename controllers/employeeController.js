const employeeModel = require("../models/employeeModel");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { SendToken } = require("../utils/SendToken");

exports.home = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ message: "this is  Home Route" });
});

exports.currentEmployee = catchAsyncErrors(async (req, res) => {
  const employee = await employeeModel.findById(req.id).exec();
  res.json(employee);
});

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const data = req.body;
  const all = await new employeeModel(data).save();
  res.status(201).json({ message: "create successfully", all });
});

exports.signin = catchAsyncErrors(async (req, res, next) => {
  const employee = await employeeModel
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found ", 500));
  }

  const isMatch = employee.comparepassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("Wrong Password", 500));

  const currentDate = Date.now();
  await employee.attendance.push(currentDate);

  // SendToken(employee, 201, res);
  res.status(201).json(employee);
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully Singout!" });
});

exports.employees = catchAsyncErrors(async (req, res, next) => {
  const employees = await employeeModel.find().exec();
  res.json({ message: " All Employees!", employees });
});
