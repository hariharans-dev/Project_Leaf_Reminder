const express = require("express");
const router = express.Router();
// const { check, validationResult } = require("express-validator");
const { user_login } = require("../controller/user");

router.post("/user", user_login);

module.exports = router;
