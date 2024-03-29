const express = require("express");
const {
  home,
  signup,
  signin,
  signout,
  currentEmployee,
  addincome,
  avatar,
  addexpense,
  updateincome,
  updateexpense,
  updatetasks,
} = require("../controllers/employeeController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

//GET /api/employee/avatar
router.get("/avatar/", isAuthenticated, avatar);

//GET /api/employee
router.get("/", home);

//POST /api/employee/current
router.post("/current", isAuthenticated, currentEmployee);

// POST / api / employee / signup;
router.post("/signup", signup);

//POST /api/employee/signin
router.post("/signin", signin);

//GET /api/employee/signout
router.get("/signout", isAuthenticated, signout);

// Service---------------------
//POST /api/employee/service
router.post("/addincome", isAuthenticated, addincome);

//POST /api/employee/updateincome
router.post("/updateincome/:id", isAuthenticated, updateincome);

// Expense--------------------

//POST /api/employee/addexpense
router.post("/addexpense", isAuthenticated, addexpense);

//POST /api/employee/updateexpense
router.post("/updateexpense/:id", isAuthenticated, updateexpense);

//POST /api/employee/updatetasks
router.post("/updatetasks/:id", updatetasks);

module.exports = router;
