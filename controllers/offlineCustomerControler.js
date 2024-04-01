const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const offlineCustomerModel = require("../models/offlineCustomerModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { sendmailer } = require("../utils/NodeMailer");
const { SendToken } = require("../utils/SendToken");

exports.home = catchAsyncErrors(async (req, res, next) => {
  res.json({ message: "This is home route" });
});

exports.registration = catchAsyncErrors(async (req, res, next) => {
  const isExists = await offlineCustomerModel.findOne({
    $or: [{ email: req.body.email }, { contact: req.body.contact }],
  });

  if (isExists) {
    if (isExists.email === req.body.email) {
      return next(new ErrorHandler("Customer Already Exists With This Email!"));
    }
  }

  if (isExists) {
    if (isExists.contact === req.body.contact) {
      return next(
        new ErrorHandler("Customer Already Exists With This Contact!")
      );
    }
  }

  const customer = await new offlineCustomerModel(req.body).save();
  res.json({ message: "Registration Successfull!" });
});

exports.signin = catchAsyncErrors(async (req, res, next) => {
  const { emailOrContact } = req.body;
  const customer = await offlineCustomerModel
    .findOne({
      $or: [{ email: emailOrContact }, { contact: emailOrContact }],
    })
    .select("+password");

  if (!customer) {
    return next(new ErrorHandler("Customer not found with this email address"));
  }
  const isMatch = customer.comparepassword(req.body.password);
  if (!isMatch) return next(new ErrorHandler("Wrong Password", 500));

  customer.islogin = true;
  await customer.save();

  SendToken(customer, 201, res);
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
  const customer = await offlineCustomerModel.findById(req.id);

  res.clearCookie("token");
  customer.islogin = false;
  await customer.save();
  res.json({ message: "Successfully Singout!" });
});

exports.current = catchAsyncErrors(async (req, res, next) => {
  const current = await offlineCustomerModel.findById(req.id);
  res.status(200).json(current);
});

exports.employeesendmail = catchAsyncErrors(async (req, res, next) => {
  const customer = await offlineCustomerModel.findOne({
    email: req.body.email,
  });

  if (!customer) {
    return next(new ErrorHandler("Customer Not Found With This Email"));
  }
  const otp = Math.floor(Math.random() * 9000 + 1000);
  sendmailer(req, res, next, otp);
  customer.resetpasswordtoken = otp;
  await customer.save();
  setTimeout(() => {
    customer.resetpasswordtoken = "0";
    customer.save();
  }, 60 * 1000 * 10);
});

exports.offlinecustomerforgotpassword = catchAsyncErrors(
  async (req, res, next) => {
    const customer = await offlineCustomerModel.findOne({
      email: req.body.email,
    });
    if (!customer) {
      return next(new ErrorHandler("Customer Not Found!"));
    }

    if (customer.resetpasswordtoken === req.body.otp) {
      customer.password = req.body.password;
      customer.resetpasswordtoken = "0";
      await customer.save();
    } else {
      return next(new ErrorHandler("Invalid OTP! Please Try Again."));
    }

    res.json({ message: "Password Change Successfully!" });
  }
);
