const router = require("express").Router();
const { check, validationResult } = require("express-validator");

const {
  devicedata_post,
} = require("../controller/devicedata/api_devicedata_controller.js");

const validateRequestBody_devicedata_post = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("soilmoisture").exists().isNumeric(),
  check("temperature").exists().isNumeric(),
];

router.post(
  "/devicedata",
  validateRequestBody_devicedata_post,
  devicedata_post
);

module.exports = router;
