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
  employeesendmail,
  employeeforgotopt,
  createbolg,
  updateblog,
  deleteblog,
} = require("../controllers/employeeController");
const { isAuthenticated } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");

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

//POST /api/employee/send-mail
router.post("/send-mail", employeesendmail);

//POST /api/employee/forgot-password
router.post("/forgot-password", employeeforgotopt);

// Service---------------------
//POST /api/employee/service
router.post("/addincome", isAuthenticated, addincome);

//POST /api/employee/updateincome
router.post("/updateincome/:id/", isAuthenticated, updateincome);

// Expense--------------------

//POST /api/employee/addexpense
router.post("/addexpense", isAuthenticated, addexpense);

//POST /api/employee/updateexpense
router.post("/updateexpense/:id", isAuthenticated, updateexpense);

//POST /api/employee/updatetasks
router.post("/updatetasks/:id", updatetasks);

// Blogs---------------------
router.get("/createblog", isAuthenticated, upload.single("image"), createbolg);

router.post("/updateblog/:id", isAuthenticated, updateblog);

router.post("/deleteblog/:id", isAuthenticated, deleteblog);

module.exports = router;
