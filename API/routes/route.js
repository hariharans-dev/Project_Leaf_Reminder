const router = require("express").Router();
const { check } = require("express-validator");
const {
  user_post,
  user_get,
  user_put,
  user_delete,
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
];

router.post("/users", validateRequestBody_post, user_post);

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
];

router.get("/users", validateRequestBody_get, user_get);

var allowedFields = ["name", "user", "password"];

const validateRequestBody_put = [
  (req, res, next) => {
    const numberOfFields = Object.keys(req.body).length;
    if (numberOfFields == 0) {
      return res.status(400).json({ message: "no feild given" });
    }
    for (const key in req.body) {
      if (!allowedFields.includes(key)) {
        return res
          .status(400)
          .json({ error: `Field '${key}' is not allowed.` });
      }
    }
    next();
  },
];

router.put("/users", validateRequestBody_put, user_put);

const validateRequestBody_delete = [];

router.delete("/users", validateRequestBody_delete, user_delete);

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
