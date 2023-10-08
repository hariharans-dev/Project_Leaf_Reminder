const express = require("express");
const cors = require("cors");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const app = express();
app.use(cors());

const { weather } = require("../controller/utils");

const validateRequestBody_weather = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("latitude").exists().isString(),
  check("longitude").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const weather_middleware = [validateRequestBody_weather];
router.post("/weather", weather_middleware, weather);

module.exports = router;
