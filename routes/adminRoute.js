const express = require("express");
const { home, signin } = require("../controllers/adminController");
const router = express.Router();

//GET /api/admin/
router.get("/", home);

//POST /api/admin/signin
router.get("/", signin);

module.exports = router;
