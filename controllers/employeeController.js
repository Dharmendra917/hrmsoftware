const employeeModel = require("../models/employeeModel.js");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { SendToken } = require("../utils/SendToken.js");
const incomeDetails = require("../models/incomeDetails.js");
const { upload } = require("../middlewares/multer.js");
const expensesModel = require("../models/expensesModel.js");

exports.home = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ message: "this is  Home Route" });
});

exports.currentEmployee = catchAsyncErrors(async (req, res) => {
  const employee = await employeeModel
    .findById(req.id)
    .populate("services")
    .populate("expenses")
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

  const currentDate = new Date();
  const currentyear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const year = `${currentyear}-${currentMonth + 1}-${currentDay}`;

  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();
  const time = `${currentHour}:${currentMinute}:${currentSecond}`;

  const logEntry = {
    logintime: `${time} ${year}`,
    logouttime: null,
  };

  employee.logs.push(logEntry);
  await employee.save();

  SendToken(employee, 201, res);
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
  const employee = await employeeModel.findById(req.id);

  const currentDate = new Date();
  const currentyear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const year = `${currentyear}-${currentMonth + 1}-${currentDay}`;

  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();
  const currentTime = `${currentHour}:${currentMinute}:${currentSecond}`;

  let latestLog;
  if (employee && employee.logs.length > 0) {
    latestLog = employee.logs[employee.logs.length - 1];

    latestLog.logouttime = `${currentTime} ${year}`;
    await employee.save();
  } else {
    return next(new ErrorHandler("Employee not found or no login records"));
  }
  console.log(latestLog);
  const loginTime = latestLog.logintime;
  const [time, date] = loginTime.split(" ");
  const [hour, minute, second] = time.split(":").map(Number);
  const [Year, month, day] = date.split("-").map(Number);
  const dateObject = new Date(
    Year,
    month - 1,
    day,
    hour,
    minute,
    second
  ).getTime();

  const logoutTime = employee.logs[employee.logs.length - 1].logouttime;
  const [outtime, outdate] = logoutTime.split(" ");
  const [outhour, outminute, outsecond] = outtime.split(":").map(Number);
  const [outYear, outmonth, outday] = outdate.split("-").map(Number);
  const outdateObject = new Date(
    outYear,
    outmonth - 1,
    outday,
    outhour,
    outminute,
    outsecond
  ).getTime();

  const activeTime = (outdateObject - dateObject) / 1000;
  // console.log(dateObject);
  // console.log(activeTime);

  const halfdayTime = 1000 * 60 * 60 * 5;
  console.log(activeTime < halfdayTime);
  if (activeTime <= halfdayTime) {
    if (
      employee.attendance.halfdays[employee.attendance.halfdays.length - 1] !==
      `${year}`
    ) {
      employee.attendance.halfdays.push(
        `${currentyear}-${currentMonth + 1}-${currentDay}`
      );
    }
  } else {
    if (
      employee.attendance.presents[employee.attendance.presents.length - 1] !==
      `${currentyear}-${currentMonth + 1}-${currentDay}`
    ) {
      await employee.attendance.presents.push(
        `${currentyear}-${currentMonth + 1}-${currentDay}`
      );
    }
  }

  await employee.save();
  res.clearCookie("token");
  res.json({ message: "Successfully Singout!" });
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

exports.updateincome = catchAsyncErrors(async (req, res, next) => {
  console.log(req.params.id);
  const oneservice = await incomeDetails.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  await oneservice.save();
  res.status(200).json({ message: "Update Income Successfully" });
});

//Expense ---------------------

exports.addexpense = catchAsyncErrors(async (req, res, next) => {
  const employee = await employeeModel.findById(req.id);
  const expense = await expensesModel(req.body).save();

  employee.expenses.push(expense._id);
  expense.employee = employee._id;
  await employee.save();
  await expense.save();

  res.status(200).json({
    message: "Expense add successfully!",
  });
});

exports.updateexpense = catchAsyncErrors(async (req, res, next) => {
  const update = await expensesModel.findByIdAndUpdate(req.params.id, req.body);
  await update.save();
  res.status(200).json({
    message: "Expense Update Successfully!",
    update,
  });
});
