const employeeModel = require("../models/employeeModel.js");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const { SendToken } = require("../utils/SendToken.js");
const incomeDetails = require("../models/incomeDetails.js");
const { upload } = require("../middlewares/multer.js");
const expensesModel = require("../models/expensesModel.js");
const { attendance, cleartimeout } = require("../middlewares/attendance.js");
const taskModel = require("../models/taskModel.js");
const { model } = require("mongoose");
const offlineCustomerModel = require("../models/offlineCustomerModel.js");
const blogModel = require("../models/blogs.js");
const { sendmailer } = require("../utils/NodeMailer.js");
const { dateAndTime } = require("../middlewares/dateAndTime.js");

exports.home = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ message: "this is  Home Route" });
});

exports.currentEmployee = catchAsyncErrors(async (req, res) => {
  const employee = await employeeModel
    .findById(req.id)
    .populate({
      path: "services",
      populate: [
        {
          path: "offlinecustomer",
          select: "contact name",
        },
        { path: "employee", select: "name email" },
      ],
    })
    .populate("expenses")
    .populate("tasks")
    .exec();
  res.json(employee);
});

exports.signup = catchAsyncErrors(async (req, res, next) => {
  const month = new Date().getMonth() + 1;
  const paddedMonth = month < 10 ? "0" + month : month;
  const day = new Date().getDate();
  const paddedDay = day < 10 ? "0" + day : day;
  const employeeid =
    `${paddedDay}` +
    `${paddedMonth}` +
    process.env.EMPLOYEE_SECERET_ID +
    Math.floor(Math.random() * 10000);

  const find = await employeeModel.findOne({ email: req.body.email });
  if (find) {
    return next(
      new ErrorHandler(
        "Employee already exist! Please use another email address",
        500
      )
    );
  }
  const info = await new employeeModel(req.body);
  info.employeeid = employeeid;
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
  await employee.logs.push(logEntry);
  employee.islogin = true;
  await employee.save();

  const loginActivity = {
    name: employee.name,
    email: employee.email,
    employeeid: employee.employeeid || null,
    logintime: { year, time },
    locationurl: req.body.locationurl,
  };
  const otp = null;
  sendmailer(req, res, next, otp, loginActivity);
  attendance(employee._id);
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

  const halfdayTime = 1000 * 60 * 60 * 5;
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

  employee.islogin = false;
  await employee.save();
  cleartimeout();
  res.clearCookie("token");
  res.json({ message: "Successfully Singout!" });
});

exports.avatar = catchAsyncErrors(async (req, res, next) => {
  upload.single("avatar")(req, res, async (err) => {
    const { originalname, buffer } = req.file;
    const employee = await employeeModel.findById(req.id);
    if (err) {
      return next(new ErrorHandler(err, 500));
    }
    employee.avatar = {
      data: buffer,
      filename: originalname,
    };
    await employee.save();
    res.json({ message: "File uploaded successfully!" });
  });
});

exports.employeesendmail = catchAsyncErrors(async (req, res, next) => {
  const employee = await employeeModel.findOne({ email: req.body.email });

  if (!employee) {
    return next(new ErrorHandler("Employee Not Found With This Email"));
  }
  const otp = Math.floor(Math.random() * 9000 + 1000);
  sendmailer(req, res, next, otp);
  employee.resetpasswordtoken = otp;
  await employee.save();
  setTimeout(() => {
    employee.resetpasswordtoken = "0";
    employee.save();
  }, 60 * 1000 * 10);
});

exports.employeeforgotopt = catchAsyncErrors(async (req, res, next) => {
  const employee = await employeeModel.findOne({ email: req.body.email });
  if (!employee) {
    return next(new ErrorHandler("Employee Not Found!"));
  }

  if (employee.resetpasswordtoken === req.body.otp) {
    employee.password = req.body.password;
    employee.resetpasswordtoken = "0";
    await employee.save();
  } else {
    return next(new ErrorHandler("Invalid OTP! Please Try Again."));
  }

  res.json({ message: "Password Change Successfully!" });
});

// Service ------------
let counter = 1;
exports.addincome = catchAsyncErrors(async (req, res, next) => {
  const data = req.body;
  const { contact, products } = req.body;

  if (!contact) {
    return next(new ErrorHandler("Fill Customer Contact!"));
  }
  const addDateAndTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  const dateObj = new Date(addDateAndTime);

  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getYear();
  const fullyear = dateObj.getFullYear();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  data.addtime = `${fullyear}-${month}-${day} ${hour}:${minute}:${seconds}`;

  data.invoicenumber = `${day}${month}${year}${counter}${Math.floor(
    Math.random() * 10000
  )}`;
  counter++;
  const employee = await employeeModel.findById(req.id);
  const offlinecustomer = await offlineCustomerModel.findOne({
    contact: req.body.contact,
  });
  if (!offlinecustomer) {
    return next(
      new ErrorHandler(
        "Customer Not Found With This Number! Please Check Number"
      )
    );
  }
  const service = await new incomeDetails(data).save();
  employee.services.push(service._id);
  service.employee = employee._id;

  offlinecustomer.buyproducts.push(service._id);
  service.offlinecustomer = offlinecustomer._id;
  await offlinecustomer.save();

  await employee.save();
  await service.save();

  res.json({
    message: "Income Add Successfully",
    data,
  });
});

exports.updateincome = catchAsyncErrors(async (req, res, next) => {
  const {
    currentyear,
    currentMonth,
    currentDay,
    currentHour,
    currentMinute,
    currentSecond,
  } = dateAndTime();

  const { id } = req.params;
  const { status, productsids } = req.body;

  const income = await incomeDetails.findById(id);

  if (!income) {
    return next(new ErrorHandler("Income Not Found!", 500));
  }

  income.status = status;
  let product;
  let productNotFound = false;
  if (productsids.length >= 1) {
    productsids.forEach((elm) => {
      product = income.products.id(elm._id);
      if (!product) {
        productNotFound = true;
        return;
      }
      if (product) {
        product.quantity = elm.quantity;
      }
    });
  }
  if (productNotFound) {
    return next(new ErrorHandler("Product Not Found!", 500));
  }
  income.updatetime = `${currentyear}-${currentMonth}-${currentDay} ${currentHour}:${currentMinute}:${currentSecond}`;
  await income.save();

  res.status(200).json({ message: "Update Income Successfully" });
});

//Expense ---------------------

exports.addexpense = catchAsyncErrors(async (req, res, next) => {
  const data = req.body;
  const addDateAndTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  data.addtime = addDateAndTime;
  const employee = await employeeModel.findById(req.id);
  const expense = await new expensesModel(data).save();

  employee.expenses.push(expense._id);
  expense.employee = employee._id;
  await employee.save();
  await expense.save();

  res.status(200).json({
    message: "Expense add successfully!",
  });
});

exports.updateexpense = catchAsyncErrors(async (req, res, next) => {
  const addDateAndTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  const update = await expensesModel.findByIdAndUpdate(req.params.id, req.body);
  update.updatetime = addDateAndTime;
  await update.save();
  res.status(200).json({
    message: "Expense Update Successfully!",
  });
});

//----------------
exports.updatetasks = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const updateTasks = await taskModel.findByIdAndUpdate(req.params.id, {
    status: status,
  });
  updateTasks.save();
  res.status(201).json({ message: "Taks Update Successfully!" });
});

//Blogs

exports.bolg = catchAsyncErrors(async (req, res, next) => {
  const blog = await blogModel(req.body);
  blog.employee = req.id;
  blog.save();
  res.status(200).json({ message: "Blog Uploaded Successfully!", blog });
});
