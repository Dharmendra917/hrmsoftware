// it return error in json format
exports.generatedErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // if (
  //   err.name === "MongoServerError" &&
  //   err.message.includes("E11000 duplicate key")
  // ) {
  //   err.message = "Employee with this Email Address already exists";
  // }

  // multerError
  if (
    err.name === "Error" &&
    err.message.includes("MulterError: File too large")
  ) {
    err.message = "Please Upload Less Than 2MB File!";
  }

  // offlineCustomer Validations
  if (
    err.name === "ValidationError" &&
    err.message.includes("Contact should be atleast 10 character")
  ) {
    err.message = "Contact should be atleast 10 character";
  }

  if (
    err.name === "ValidationError" &&
    err.message.includes("Contact must not exceed 10 character")
  ) {
    err.message = "Contact must not exceed 10 character";
  }

  if (
    err.name === "ValidationError" &&
    err.message.includes("Please provide at least one product")
  ) {
    err.message = "Please provide at least one product";
  }

  res.status(statusCode).json({
    message: err.message,
    errName: err.name,
    stack: err.stack,
  });
};
