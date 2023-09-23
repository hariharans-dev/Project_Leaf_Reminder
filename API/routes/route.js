const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const {
  user_post,
  user_get,
  user_put,
  user_delete,
  user_sendverification,
  user_getverification,
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
const postmiddleware = [validateRequestBody_post, verifyToken];
router.post("/users", postmiddleware, user_post);

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
const getmiddleware = [validateRequestBody_get, verifyToken];
router.get("/users", getmiddleware, user_get);

const validateRequestBody_put = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    const putallowedFields = ["name", "user", "password", "key"];
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
const putmiddleware = [validateRequestBody_put, verifyToken];
router.put("/users", putmiddleware, user_put);

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
const deletemiddleware = [validateRequestBody_delete, verifyToken];
router.delete("/users", deletemiddleware, user_delete);

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
const sendverifymiddleware = [validateRequestBody_sendverify, verifyToken];
router.get(
  "/users/sendverification",
  sendverifymiddleware,
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
const getverifymiddleware = [validateRequestBody_getverify, verifyToken];
router.get("/users/getverification", getverifymiddleware, user_getverification);


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
