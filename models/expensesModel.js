const mongoose = require("mongoose");

const expensesModel = mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },

  title: {
    type: String,
    require: [true, "Please Fill Expense Title!"],
  },
  description: {
    type: String,
    require: [true, "Please Fill Expense Description!"],
  },
  amount: {
    type: String,
    require: [true, "Please Fill Expense Amount"],
  },
  status: {
    type: String,
    require: [true, "Please Fill Expense Status"],
  },
});

module.exports = mongoose.model("expenseDetails", expensesModel);
