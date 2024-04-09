const employeeModel = require("../models/employeeModel");
const { catchAsyncErrors } = require("./catchAsyncErrors");
const { dateAndTime } = require("./dateAndTime");

let timeoutId;
exports.attendance = catchAsyncErrors(async (id) => {
  executed = false;
  const employee = await employeeModel.findById(id);

  if (!executed) {
    executed = true;
    const expiresIn = process.env.JWT_EXPIRE || "12h";
    let expirationMilliseconds;
    if (expiresIn.endsWith("ms")) {
      expirationMilliseconds = parseInt(expiresIn);
    } else {
      const expirationSeconds = parseInt(expiresIn) * 60 * 60;
      expirationMilliseconds = expirationSeconds * 1000;
    }

    const self = employee;
    timeoutId = setTimeout(async () => {
      const { formattedDate, year } = dateAndTime();
      if (self.attendance.presents.length == 0) {
        self.attendance.presents.push(`${year}`);
      } else {
        if (!year === self.attendance.presents.length - 1) {
          self.attendance.presents.push(`${year}`);
        }
      }
      self.logs[self.logs.length - 1].logouttime = formattedDate;
      const updatedEmployee = await self.save();
      console.log(updatedEmployee);
    }, expirationMilliseconds);
  }
});

exports.cleartimeout = catchAsyncErrors(async () => {
  if (timeoutId) {
    console.log("clear");
    clearTimeout(timeoutId);
    timeoutId = null;
  }
});
