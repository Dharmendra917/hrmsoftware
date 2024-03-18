const { catchAsyncErrors } = require("./catchAsyncErrors");

exports.attendance = catchAsyncErrors(async (req, res, next) => {
  console.log(req, res);
});
