const nodemailer = require("nodemailer");
const ErrorHandler = require("../utils/ErrorHandler.js");

exports.sendmailer = (req, res, next, otp) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: "465",
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const options = {
    from: "RS Online Private Limited <dp903604@gmail.com>",
    to: req.body.email,
    subject: "Password Reset OTP",
    html: `<div   style = "background-color:#CDE0C4; border:1px solid white">
           <h1>Forgot Password OTP</h1>
           <h5><span style= "color:red";>Note</span>: The token will expire in 10min </h5>
             <h1 style="background-color:#17be08;"> ${otp} </h1> 
            </div>`,
  };

  transport.sendMail(options, (err, info) => {
    if (err) return next(new ErrorHandler(err, 500));

    return res
      .status(200)
      .json({ message: "OTP sent successfully! Please Check Your Mail Box" });
  });
};
