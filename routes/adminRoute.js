const express = require("express");
const {
  home,
  signin,
  signup,
  signout,
  allemployee,
  oneemployee,
  currentAdmin,
  addtasks,
  leaverequest,
  holidays,
} = require("../controllers/adminController.js");
const { isAuthenticated } = require("../middlewares/auth.js");

const router = express.Router();

//GET /api/admin/
router.get("/", home);

//POST /api/admin/current
router.post("/current", isAuthenticated, currentAdmin);

//POST /api/admin/signup
router.post("/signup", signup);

//POST /api/admin/signin
router.post("/signin", signin);

//GET /api/admin/signout
router.get("/signout", isAuthenticated, signout);

//GET /api/admin/
router.get("/allemployee", isAuthenticated, allemployee);

//GET /api/admin/oneEmployee
router.get("/oneemployee/:id", isAuthenticated, oneemployee);

//POST /api/admin/addTask
router.post("/task/:id", isAuthenticated, addtasks);

//POST /api/admin/leaverequest
router.post("/leaverequest/:id", isAuthenticated, leaverequest);

//POST /api/admin/holidays
router.post("/holidays/", isAuthenticated, holidays);

module.exports = router;
