const mongoose = require("mongoose");

const taskModel = mongoose.Schema({
  title: {
    type: String,
    require: [true, "Please Fill Title!"],
  },
  description: {
    type: String,
    require: [true, "Please Fill Description!"],
  },
  status: {
    type: String,
    default: "Pending",
  },
  startdate: {
    type: String,
    require: true,
  },
  enddate: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("task", taskModel);
