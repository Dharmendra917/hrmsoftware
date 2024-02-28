const express = require("express");
const {
  home,
  signup,
  signin,
  signout,
  currentEmployee,
  employees,
} = require("../controllers/employeeController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

//GET /api/employee
router.get("/", home);

//POST /api/employee
router.post("/current", isAuthenticated, currentEmployee);

//POST /api/employee/signup
router.post("/signup", signup);

//POST /api/employee/signin
router.post("/signin", signin);

//GET /api/employee/signout
router.get("/signout", isAuthenticated, signout);

//GET /api/employee/employees
router.get("/employees", employees);

module.exports = router;
