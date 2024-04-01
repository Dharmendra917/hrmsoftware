const mongoose = require("mongoose");

const incomeDetails = mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  offlinecustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "offlinecustomer",
  },
  title: {
    type: String,
  },
  mrp: {
    type: String,
    require: [true, "please fill MRP!"],
  },
  rsprice: {
    type: String,
    require: [true, "please fill RS PRICE!"],
  },
  status: {
    type: String,
    require: [true, "please fill Status!"],
  },
  addtime: {
    type: String,
  },
  updatetime: {
    type: String,
  },
});

module.exports = mongoose.model("incomeDetails", incomeDetails);
