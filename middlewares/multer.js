const multer = require("multer");
const ErrorHandler = require("../utils/ErrorHandler");

const storage = multer.memoryStorage();
const limits = {
  fileSize: 1024 * 1024 * 3,
};
const fileFilter = (req, file, cb, next) => {
  // Example: Accept only JPEG and PNG files
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        "Invalid file type. Only JPEG,JPG and PNG files are allowed."
      ),
      false
    );
  }
};

exports.upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter,
});
