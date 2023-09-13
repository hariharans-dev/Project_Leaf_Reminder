const { validationResult } = require("express-validator");
const Inventory_data = require("./inventory_data_controller.js");

const inventory_object = new Inventory_data();

const inventory_post = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("no authorisation");
    return res
      .status(401)
      .json({ message: "authorization header is missing." });
  }
  const [authType, apiKey] = authHeader.split(" ");
  if (authType !== "Bearer") {
    console.log("invalid authorization header");
    return res
      .status(400)
      .json({ message: "invalid Authorization header format." });
  }
  if (apiKey !== process.env.INVENTORY_APIKEY && apiKey !== ADMIN_APIKEY) {
    return res.status(401).json({ message: "invalid Authorization" });
  } else {
    const body = req.body;
    const data = {
      device: body.device,
      deviceid: body.deviceid,
    };
    const filter = { deviceid: body.deviceid };
    try {
      inventory_object.find_device(filter).then((result) => {
        if (result == null) {
          try {
            inventory_object.create_device(data);
            return res.status(200).json({ message: "device added" });
          } catch (error) {
            return res.status(500).json({ message: "server error" });
          }
        } else {
          return res.status(409).json({ message: "deviceid already exists" });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  }
};

const inventory_find = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("no authorisation");
    return res
      .status(401)
      .json({ message: "authorization header is missing." });
  }
  const [authType, apiKey] = authHeader.split(" ");
  if (authType !== "Bearer") {
    console.log("invalid authorization header");
    return res
      .status(400)
      .json({ message: "invalid Authorization header format." });
  }
  if (apiKey !== process.env.INVENTORY_APIKEY && apiKey !== ADMIN_APIKEY) {
    return res.status(401).json({ message: "invalid Authorization" });
  } else {
    const body = req.body;
    const filter = { device: body.device };
    try {
      inventory_object.find_device(filter).then((result) => {
        return res.status(200).json(result);
      });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  }
};

const inventory_list = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("no authorisation");
    return res
      .status(401)
      .json({ message: "authorization header is missing." });
  }
  const [authType, apiKey] = authHeader.split(" ");
  if (authType !== "Bearer") {
    console.log("invalid authorization header");
    return res
      .status(400)
      .json({ message: "invalid Authorization header format." });
  }
  if (apiKey !== process.env.INVENTORY_APIKEY && apiKey !== ADMIN_APIKEY) {
    return res.status(401).json({ message: "invalid Authorization" });
  } else {
    const body = req.body;
    const filter = { device: body.device };
    try {
      inventory_object.findall_device(filter).then((result) => {
        var data = [];
        for (var i = 0; i < result.length; i++) {
          data[i] = { deviceid: result[i].deviceid };
        }
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  }
};

const inventory_update = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("no authorisation");
    return res
      .status(401)
      .json({ message: "authorization header is missing." });
  }
  const [authType, apiKey] = authHeader.split(" ");
  if (authType !== "Bearer") {
    console.log("invalid authorization header");
    return res
      .status(400)
      .json({ message: "invalid Authorization header format." });
  }
  if (apiKey !== process.env.INVENTORY_APIKEY && apiKey !== ADMIN_APIKEY) {
    return res.status(401).json({ message: "invalid Authorization" });
  } else {
    const body = req.body;
    var filter = { deviceid: body.olddeviceid };
    var data = { deviceid: body.newdeviceid, device: body.device };
    try {
      inventory_object.find_device(filter).then((result) => {
        if (result == null) {
          return res.status(404).json({ message: "no such deviceid" });
        } else {
          if (body.olddeviceid == body.newdeviceid) {
            try {
              filter = { deviceid: body.olddeviceid };
              inventory_object.update_device(filter, data);
              return res.status(200).json({ message: "device updated" });
            } catch (error) {
              return res.status(500).json({ message: "server error" });
            }
          } else {
            try {
              filter = { deviceid: body.newdeviceid };
              inventory_object.find_device(filter).then((result) => {
                if (result == null) {
                  try {
                    filter = { deviceid: body.olddeviceid };
                    inventory_object.update_device(filter, data);
                    return res.status(200).json({ message: "device updated" });
                  } catch (error) {
                    return res.status(500).json({ message: "server error" });
                  }
                } else {
                  return res
                    .status(404)
                    .json({ message: "deviceid already exists" });
                }
              });
            } catch (error) {
              return res.status(500).json({ message: "server error" });
            }
          }
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  }
};

const inventory_delete = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("no authorisation");
    return res
      .status(401)
      .json({ message: "authorization header is missing." });
  }
  const [authType, apiKey] = authHeader.split(" ");
  if (authType !== "Bearer") {
    console.log("invalid authorization header");
    return res
      .status(400)
      .json({ message: "invalid Authorization header format." });
  }
  if (apiKey !== process.env.INVENTORY_APIKEY && apiKey !== ADMIN_APIKEY) {
    return res.status(401).json({ message: "invalid Authorization" });
  } else {
    const body = req.body;
    const filter = { deviceid: body.deviceid };
    try {
      inventory_object.find_device(filter).then((result) => {
        if (result == null) {
          return res.status(404).json({ message: "no device found" });
        } else {
          console.log("device deleted");
          try {
            inventory_object.delete_device(filter);
          } catch (error) {
            return res.status(500).json({ message: "server error" });
          }
          return res.status(200).json({ message: "device deleted" });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "server error" });
    }
  }
};

const device_assignment = () => {
  const filter = { device: "leaf-reminder" };
  try {
    inventory_object.find_device(filter).then((result) => {
      if (result != null) {
        const deviceid = result.deviceid;
        filter = { deviceid: deviceid };
        try {
          var data = { device: "leaf-reminder-assigned" };
          inventory_object.update_device(filter, data);
          return deviceid;
        } catch (error) {
          return error;
        }
      } else {
        return null;
      }
    });
  } catch (error) {
    return error;
  }
};

module.exports = {
  inventory_post,
  inventory_delete,
  inventory_list,
  inventory_update,
  inventory_find,
  device_assignment,
};
