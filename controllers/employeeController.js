const employeeModel = require("../models/employeeModel");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { SendToken } = require("../utils/SendToken");
const incomeDetails = require("../models/incomeDetails");
const { upload } = require("../middlewares/multer");

exports.home = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ message: "this is  Home Route" });
});

exports.currentEmployee = catchAsyncErrors(async (req, res) => {
  const employee = await employeeModel
    .findById(req.id)
    .populate("services")
    .exec();
  res.json(employee);
});

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const info = await new employeeModel(req.body);
  info.save();
  res.status(201).json({ message: "Create successfully", info });
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

  employee.logs.push({
    logingtime: new Date(),
  });
  await employee.save();

  SendToken(employee, 201, res);
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
  const employee = await employeeModel.findById(req.id);
  const currentDate = new Date();
  const currentyear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  await employee.attendance.push(
    `${currentyear}-${currentMonth + 1}-${currentDay}`
  );

  // employee.logs[0];
  await employee.save();

  res.clearCookie("token");
  res.json({ message: "Successfully Singout!", employee });
});

exports.document = catchAsyncErrors(async (req, res, next) => {
  upload.single("document")(req, res, (err) => {
    const file = req.file;

    if (err) {
      return next(new ErrorHandler(err, 500));
    }

    res.json({ message: "File uploaded successfully!", file });
  });
});

// Service ------------
exports.addincome = catchAsyncErrors(async (req, res, next) => {
  const data = req.body;
  const employee = await employeeModel.findById(req.id);
  const service = await incomeDetails(data).save();

  employee.services.push(service._id);
  service.employee = employee._id;
  await employee.save();
  await service.save();

  res.json({
    message: "submmit successfully",
  });
});
