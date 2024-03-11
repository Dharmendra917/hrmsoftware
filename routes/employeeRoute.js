const express = require("express");
const {
  home,
  signup,
  signin,
  signout,
  currentEmployee,
  addincome,
  document,
} = require("../controllers/employeeController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

//GET /api/employee/document
router.get("/document", document);

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

module.exports = router;
