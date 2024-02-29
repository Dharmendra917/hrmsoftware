const mongoose = require("mongoose");

const incomeDetails = mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
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
});

module.exports = mongoose.model("incomeDetails", incomeDetails);
