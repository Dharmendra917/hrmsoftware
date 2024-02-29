const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");

exports.home = catchAsyncErrors((req, res) => {
  res.status(200).json({ message: "This is Admin Home Page" });
});

exports.signin = catchAsyncErrors((req, res) => {
  res.status(200).json({ message: "This is Admin Home Page" });
});
