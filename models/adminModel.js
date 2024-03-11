const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminModel = mongoose.Schema({
  name: {
    type: String,
    minLength: [6, "Name should be atleast 4 character "],
    require: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: [true, "Email is already Exist"],
    require: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    select: false,
  },
  contact: {
    type: String,
    require,
  },
  avatar: {
    type: Object,
    filename: String,
    data: Buffer,
    default: {
      url: "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
    },
  },
});

adminModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

//compare password
adminModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//jwt
adminModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("admin", adminModel);
