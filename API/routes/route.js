const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const {
  user_post,
  user_get,
  user_put,
  user_delete,
  user_sendverification,
  user_getverification,
  user_sendotp,
  user_verifyotp,
  user_forgetpassword,
  user_changepassword,
} = require("../controller/user/api_user_controller.js");

const {
  devicedata_post,
} = require("../controller/devicedata/api_devicedata_controller.js");

const {
  inventory_post,
  inventory_delete,
  inventory_list,
  inventory_update,
  inventory_find,
} = require("../controller/inventory/api_inventory_controller.js");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("no authorisation");
    return res
      .status(400)
      .json({ message: "authorization header is missing." });
  }
  const [authType, apiKey] = authHeader.split(" ");
  if (authType !== "Bearer") {
    console.log("invalid authorization header");
    return res
      .status(400)
      .json({ message: "invalid Authorization header format." });
  }
  if (
    apiKey !== process.env.LOGIN_APIKEY &&
    apiKey !== process.env.ADMIN_APIKEY
  ) {
    return res.status(401).json({ message: "invalid Authorization" });
  }
  next();
};

// users

const validateRequestBody_post = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("user").exists().isString(),
  check("password").exists().isString(),
  check("name").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const post_middleware = [validateRequestBody_post, verifyToken];
router.post("/users", post_middleware, user_post);

const validateRequestBody_get = [
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
const get_middleware = [validateRequestBody_get, verifyToken];
router.get("/users", get_middleware, user_get);

const validateRequestBody_put = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    const putallowedFields = ["name", "user", "key"];
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    for (const key in req.body) {
      if (!putallowedFields.includes(key)) {
        return res
          .status(400)
          .json({ error: `Field '${key}' is not allowed.` });
      }
    }
    next();
  },
  check("key").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const put_middleware = [validateRequestBody_put, verifyToken];
router.put("/users", put_middleware, user_put);

const validateRequestBody_delete = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("key").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const delete_middleware = [validateRequestBody_delete, verifyToken];
router.delete("/users", delete_middleware, user_delete);

const validateRequestBody_sendverify = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("key").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const sendverify_middleware = [validateRequestBody_sendverify, verifyToken];
router.get(
  "/users/sendverification",
  sendverify_middleware,
  user_sendverification
);

const validateRequestBody_getverify = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("verification_key").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const getverify_middleware = [validateRequestBody_getverify, verifyToken];
router.get(
  "/users/getverification",
  getverify_middleware,
  user_getverification
);

const validateRequestBody_sendotp = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("key").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const sendotp_middleware = [validateRequestBody_sendotp, verifyToken];
router.get("/users/sendotp", sendotp_middleware, user_sendotp);

const validateRequestBody_verifyotp = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("otp").exists().isString(),
  check("key").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const verifyotp_middleware = [validateRequestBody_verifyotp, verifyToken];
router.get("/users/verifyotp", verifyotp_middleware, user_verifyotp);

const validateRequestBody_forgetpassword = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("forget_password_key").exists().isString(),
  check("key").exists().isString(),
  check("password").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const forgetpassword_middleware = [
  validateRequestBody_forgetpassword,
  verifyToken,
];
router.get(
  "/users/forgetpassword",
  forgetpassword_middleware,
  user_forgetpassword
);

const validateRequestBody_changepassword = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("oldpassword").exists().isString(),
  check("key").exists().isString(),
  check("password").exists().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "not in proper format" });
    }
    next();
  },
];
const changepassword_middleware = [
  validateRequestBody_changepassword,
  verifyToken,
];
router.get(
  "/users/changepassword",
  changepassword_middleware,
  user_changepassword
);

//devicedata route

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

//inventory route

const validateRequestBody_inventory_post = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("device").exists().isString(),
  check("deviceid").exists().isNumeric(),
];

router.post("/inventory", validateRequestBody_inventory_post, inventory_post);

const validateRequestBody_inventory_delete = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("deviceid").exists().isNumeric(),
];

router.delete(
  "/inventory",
  validateRequestBody_inventory_delete,
  inventory_delete
);

const validateRequestBody_inventory_find = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("device").exists().isString(),
];

router.get("/inventory", validateRequestBody_inventory_find, inventory_find);

const validateRequestBody_inventory_list = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("device").exists().isString(),
];

router.get(
  "/inventory/all",
  validateRequestBody_inventory_list,
  inventory_list
);

const validateRequestBody_inventory_update = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    next();
  },
  check("device").exists().isString(),
  check("olddeviceid").exists().isNumeric(),
  check("newdeviceid").exists().isNumeric(),
];

router.put(
  "/inventory",
  validateRequestBody_inventory_update,
  inventory_update
);

module.exports = router;
