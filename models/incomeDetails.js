const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the product"],
  },
  quantity: {
    type: Number,
    required: [true, "Please provide the quantity of the product"],
  },
  mrp: {
    type: Number,
    required: [true, "Please provide the MRP of the product"],
  },
  rsprice: {
    type: Number,
    required: [true, "Please provide the RS price of the product"],
  },
});

const incomeDetailsSchema = mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  offlinecustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "offlinecustomer",
  },
  products: [productSchema],
  addtime: {
    type: String,
  },
  updatetime: {
    type: String,
  },
  status: {
    type: String,
  },
  totalAmount: {
    type: Number,
    default: 0, // Default value is set to 0
  },
});

incomeDetailsSchema.pre("save", function (next) {
  let total = 0;
  this.products.forEach((product) => {
    total += product.quantity * product.rsprice;
  });
  this.totalAmount = total; // Set total amount
  next();
});

const IncomeDetails = mongoose.model("incomeDetails", incomeDetailsSchema);

module.exports = IncomeDetails;
