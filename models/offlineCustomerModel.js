const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const offlineCustomerModel = mongoose.Schema({
  buyproducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "incomeDetails" }],
  name: {
    type: String,
    required: true,
    minLength: [6, "Customer Name Should Be Atleast 6 Character"],
    maxLength: [16, "Customer Name Should Not Execeed 16 Character"],
  },
  email: {
    type: String,
    required: [true, "Customer Email is Required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please Fill a Valid Email Address",
    ],
  },
  contact: {
    type: String,
    required: [true, "Customer Contact is Required"],
    minLength: [10, "Contact must not exceed 10 character"],
    maxLength: [10, "Contact should be atleast 10 character "],
  },
  password: {
    type: String,
    select: false,
    minLength: [5, "Passwod should be atleast 6 or more character"],
  },
  address: {
    type: String,
    required: [true, "Customer Address is Required"],
  },
  city: {
    type: String,
    required: [true, "Customer Address is Required"],
  },
  islogin: {
    type: Boolean,
    default: false,
  },
  resetpasswordtoken: {
    type: String,
    default: "0",
  },
});

offlineCustomerModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

offlineCustomerModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//jwt
offlineCustomerModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("offlinecustomer", offlineCustomerModel);
