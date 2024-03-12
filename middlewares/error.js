// it return error in json format
exports.generatedErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (
    err.name === "MongoServerError" &&
    err.message.includes("E11000 duplicate key")
  ) {
    err.message = "Employee with this Email Address already exists";
  }

  if (
    err.name === "Error" &&
    err.message.includes("MulterError: File too large")
  ) {
    err.message = "Please Upload Less Than 2MB File!";
  }

  res.status(statusCode).json({
    message: err.message,
    errName: err.name,
    stack: err.stack,
  });
};
