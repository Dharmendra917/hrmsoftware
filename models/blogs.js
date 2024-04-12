const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  title: {
    type: String,
    required: ["Please Fill Title", true],
    minLength: [6, "Customer Name Should Be Atleast 6 Character"],
  },
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    minLength: [15, "Customer Name Should Be Atleast 15 Character"],
    required: [true, "Please Fill Blog Description!"],
  },
  likes: [],
});

module.exports = mongoose.model("blog", blogSchema);
