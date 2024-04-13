const multer = require("multer");
const ErrorHandler = require("../utils/ErrorHandler");

const storage = multer.memoryStorage();
const limits = {
  fileSize: 1024 * 1024 * 2,
};

// if (limits.fileSize < size) {
//   console.log(";ldkg");
// }
const fileFilter = (req, file, cb, next) => {
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
