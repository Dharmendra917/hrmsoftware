const nodemailer = require("nodemailer");
const ErrorHandler = require("../utils/ErrorHandler.js");

exports.sendmailer = (req, res, next, otp, loginActivity) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: "465",
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  if (!otp) {
    const htmlTemplate = `
  <div style="height: 100%; border: 1px solid white;">
    <h1>Employee Information</h1>
    <h3><a href="${loginActivity.locationurl}">Click here to Check Location</a></h3>
    <h4>Name: ${loginActivity.name}</h4>
    <h4>Email: ${loginActivity.email}</h4>
    <h4>Id: ${loginActivity.employeeid}</h4>
    <h4>Date: ${loginActivity.logintime.time}, ${loginActivity.logintime.year}</h4>
    <img src="https://www.google.com/maps/place/23%C2%B019'4.1%22N+78%C2%B05'6.1%22E/@23.317819161822136,78.08501840028043,21z/data=!4m4!3m3!8m2!3d23.317819161822136!4d78.08501840028043?entry=ttu" alt="Location Map">
  </div>
`;
    const options = {
      from: "RS Online Private Limited <dp903604@gmail.com>",
      to: "dharmendrapatel0200@gmail.com",
      // to: req.body.email,
      subject: "Employee Login Location",
      html: htmlTemplate,
    };

    transport.sendMail(options, (err, info) => {
      if (err) return next(new ErrorHandler(err, 500));
    });
  } else {
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
  }
};
