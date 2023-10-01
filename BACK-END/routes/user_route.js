const express = require("express");
const cors = require("cors");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const app = express();
app.use(cors());

const {
  user_session,
  user_login,
  user_sendotp,
  user_forgetpassword,
  user_verifyotp,
} = require("../controller/user");

// const verifyTokenuser = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     console.log("no authorisation");
//     return res
//       .status(400)
//       .json({ message: "authorization header is missing." });
//   }
//   const [authType, apiKey] = authHeader.split(" ");
//   if (authType !== "Bearer") {
//     console.log("invalid authorization header");
//     return res
//       .status(400)
//       .json({ message: "invalid Authorization header format." });
//   }
//   if (
//     apiKey !== process.env.LOGIN_APIKEY &&
//     apiKey !== process.env.ADMIN_APIKEY
//   ) {
//     return res.status(401).json({ message: "invalid Authorization" });
//   }
//   next();
// };

router.post("/login-session", user_session);

const validateRequestBody_login = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("user").exists().isString(),
  check("password").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const login_middleware = [validateRequestBody_login];
router.post("/login", login_middleware, user_login);

const validateRequestBody_sendotp = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("user").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const sendotp_middleware = [validateRequestBody_sendotp];
router.post("/sendotp", sendotp_middleware, user_sendotp);

const validateRequestBody_verifyotp = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("user").exists().isString(),
  check("otp").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const verifyotp_middleware = [validateRequestBody_verifyotp];
router.post("/verifyotp", verifyotp_middleware, user_verifyotp);

const validateRequestBody_forgetpassword = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("forget_password_key").exists().isString(),
  check("password").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const forgetpassword_middleware = [validateRequestBody_forgetpassword];
router.post("/forgetpassword", forgetpassword_middleware, user_forgetpassword);

module.exports = router;
