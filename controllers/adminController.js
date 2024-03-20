const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { SendToken } = require("../utils/SendToken");

const adminModel = require("../models/adminModel.js");
const employeeModel = require("../models/employeeModel.js");
const taskModel = require("../models/taskModel.js");

exports.home = catchAsyncErrors((req, res) => {
  res.status(200).json({ message: "This is Admin Home Page" });
});

exports.currentAdmin = catchAsyncErrors(async (req, res, next) => {
  const admin = await adminModel.findById(req.id);
  res.status(200).json(admin);
});

exports.signup = catchAsyncErrors(async (req, res, next) => {
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

//Employee
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

//Tasks
exports.addtasks = catchAsyncErrors(async (req, res, next) => {
  const employee = await employeeModel.findById(req.params.id);
  const task = await new taskModel(req.body);
  employee.tasks.push(task._id);
  task.employee = employee._id;
  await employee.save();
  await task.save();
  res.status(200).json({
    message: "Task Send Successfully!",
  });
});

exports.alltasks = catchAsyncErrors(async (req, res, next) => {
  const tasks = await taskModel.find().populate("employee", "name avatar");
  res.status(200).json({ tasks });
});

//Leave Request
exports.leaverequest = catchAsyncErrors(async (req, res, next) => {
  const { leaverequest } = req.body;
  const employee = await employeeModel.findById(req.params.id);
  if (!employee) {
    return next(new ErrorHandler("Employe Not Found", 500));
  }
  leaverequest.forEach((elm) => {
    employee.attendance.leaves.push(elm);
  });
  await employee.save();
  res.status(200).json({ message: "Leave Granted Successfully!" });
});

//Holidays
exports.holidays = catchAsyncErrors(async (req, res, next) => {
  const { holidays } = req.body;
  const employee = await employeeModel.find();
  employee.forEach((employeeElements) => {
    holidays.forEach((holidaysElements) => {
      employeeElements.attendance.holidays.push(holidaysElements);
    });
    employeeElements.save();
  });
  res.status(200).json({ message: "this is holidays", employee });
});
