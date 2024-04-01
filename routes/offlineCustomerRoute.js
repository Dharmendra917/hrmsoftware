const express = require("express");
const {
  home,
  registration,
  signin,
  signout,
  current,
} = require("../controllers/offlineCustomerControler");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

//GET /
router.get("/", home);

//POST /registration
router.post("/registration", registration);

//POST /signin
router.post("/signin", signin);

//GET /signout
router.get("/signout", isAuthenticated, signout);

//POST /current
router.post("/current", isAuthenticated, current);

module.exports = router;
