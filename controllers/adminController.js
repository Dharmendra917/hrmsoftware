const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { SendToken } = require("../utils/SendToken");

const adminModel = require("../models/adminModel.js");
const employeeModel = require("../models/employeeModel.js");
const taskModel = require("../models/taskModel.js");
const incomeDetails = require("../models/incomeDetails.js");
const offlineCustomerModel = require("../models/offlineCustomerModel.js");
const { sendmailer } = require("../utils/NodeMailer.js");

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

exports.sendmail = catchAsyncErrors(async (req, res, next) => {
  const admin = await adminModel.findOne({ email: req.body.email });
  if (!admin) {
    return next(
      new ErrorHandler("Admin Not Found! Please Cheack Your Email ", 500)
    );
  }

  const otp = Math.floor(Math.random() * 9000 + 1000);
  sendmailer(req, res, next, otp);
  admin.resetpasswordtoken = otp;
  await admin.save();
  setTimeout(() => {
    admin.resetpasswordtoken = 0;
    admin.save();
  }, 60 * 1000 * 10);
});

exports.adminforgotpasswordotp = catchAsyncErrors(async (req, res, next) => {
  const admin = await adminModel.findOne({ email: req.body.email });

  if (!admin) {
    return next(new ErrorHandler("Admin Not Found!"));
  }

  if (admin.resetpasswordtoken === req.body.otp) {
    admin.password = req.body.password;
    admin.resetpasswordtoken = "0";
    await admin.save();
  } else {
    return next(new ErrorHandler("Invalid OTP! Please Try Again."));
  }

  res.json({ message: "Password Change Successfully!" });
});

//Employees
exports.allemployee = catchAsyncErrors(async (req, res, next) => {
  const employees = await employeeModel.find().populate("services").exec();

  res.status(200).json(employees);
});

//oneEmployees
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

//allTasks
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
  res.status(200).json({ message: "Monthly Holidays Added!" });
});

//offlineCustomers

//allofflineCustomers
exports.allofflinecustomers = catchAsyncErrors(async (req, res, next) => {
  const allcutomers = await offlineCustomerModel.find().exec();
  res.status(200).json({ allcutomers });
});

//oneofflineCustomer
exports.oneofflinecustomer = catchAsyncErrors(async (req, res, next) => {
  const onecustomer = await offlineCustomerModel
    .findById(req.params.id)
    .populate({
      path: "buyproducts",
      select: "-offlinecustomer",
      populate: { path: "employee", select: "name email employeeid avatar" },
    })
    .exec();
  res.status(200).json({ onecustomer });
});

//incomes----
exports.incomes = catchAsyncErrors(async (req, res, next) => {
  const allincome = await incomeDetails
    .find()
    .populate("offlinecustomer", "name contact email")
    .populate("employee", "name avatar email employeeid");
  res.status(200).json({
    allincome,
  });
});
