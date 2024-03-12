const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeModel = mongoose.Schema({
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "incomeDetails" }],
  // attendance: [],
  attendance: {
    presents: [{ type: String }],
    halfdays: [{ type: String }],
    holidays: [{ type: String }],
    leaves: [{ type: String }],
  },
  name: {
    type: String,
    minLength: [6, "Name should be atleast 6 character "],
    require: [true, "Name is required"],
  },
  // lastname: {
  //   type: String,
  //   minLength: [4, "Last Name should be atleast 4 character"],
  //   require: [true, "Last Name is required"],
  // },
  email: {
    unique: true,
    type: String,
    require: [true, "Email is required"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  contact: {
    type: String,
    require: [true, "Contact No is required"],
    minLength: [10, "Contact No. Should be atleast 10 digit"],
  },
  password: {
    type: String,
    require: [true, "Password is required"],
    select: false,
  },
  document: {
    filename: String,
    data: Buffer,
  },
  joindate: {
    type: {},
  },
  role: {
    type: String,
  },
  gander: {
    type: String,
  },
  avatar: {
    type: Object,
    default: {
      url: "https://toppng.com/uploads/preview/donna-picarro-dummy-avatar-115633298255iautrofxa.png",
    },
  },
  logs: [
    {
      logintime: {
        type: String,
      },
      logouttime: {
        type: String,
      },
    },
  ],
});

employeeModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }

  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

//compare password
employeeModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//jwt
employeeModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
module.exports = mongoose.model("employee", employeeModel);
