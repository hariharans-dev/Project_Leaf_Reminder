const { validationResult } = require("express-validator");
const Login = require("./user_data_controller.js");
const {
  device_assignment,
} = require("../inventory/api_inventory_controller.js");
const {
  device_assignment,
} = require("../inter-link-functions/device_assignment_controller.js");

const user_object = new Login();

function encode_byte64(user, password) {
  const credentials = `${user}:${password}`;
  const base64Credentials = Buffer.from(credentials).toString("base64");
  return base64Credentials;
}

function decode_byte64(base64Credentials) {
  const decodedCredentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [user, password] = decodedCredentials.split(":");
  return [user, password];
}

const user_post = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("no authorisation");
    return res
      .status(400)
      .json({ message: "authorization header is missing." });
  }
  // Split the header into parts (e.g., "Bearer your-api-key")
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
  const newuser = req.body;
  const byte64 = encode_byte64(newuser.user, newuser.password);
  const filter = { user: newuser.user };

  try {
    user_object.finduser(filter).then((value) => {
      if (value == null) {
        console.log("no duplication");
        const new_user = {
          user: newuser.user,
          name: newuser.name,
          key: byte64,
        };
        user_object.createuser(new_user);
        res.status(201).json({ message: "user created" });
      } else {
        console.log("duplication");
        return res.status(409).json({ message: "user already exits" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const user_get = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const body = req.body;
  const byte64 = encode_byte64(body.user, body.password);
  const filter = { key: byte64 };

  try {
    user_object.finduser(filter).then((result) => {
      if (result == null) {
        return res.status(404).json({ message: "user not found" });
      } else {
        return res.status(200).json({ key: byte64 });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const user_put = (req, res) => {
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

  const body = req.body;
  var filter = { key: apiKey };
  try {
    user_object.finduser(filter).then((result) => {
      if (result == null) {
        console.log("user not found");
        return res.status(404).json({ message: "user not found" });
      } else {
        const [olduser, oldpassword] = decode_byte64(apiKey);
        if (olduser == body.user) {
          try {
            filter = { key: apiKey };
            var data = {
              user: body.user,
              key: encode_byte64(body.user, body.password),
              name: body.name,
            };
            user_object.updateuser(filter, data);
            console.log("user updated");
            return res.status(200).json({ message: "user updated" });
          } catch {
            console.log("error in finding");
            return res.status(500).json({ message: "server error" });
          }
        } else {
          filter = { user: body.user };
          try {
            user_object.finduser(filter).then((result) => {
              if (result == null) {
                data = {
                  user: body.user,
                  key: encode_byte64(body.user, body.password),
                  name: body.name,
                };
                try {
                  filter = { key: apiKey };
                  user_object.updateuser(filter, data);
                  console.log("user updated");
                  return res.status(200).json({ message: "user updated" });
                } catch {
                  console.log("error in finding");
                  return res.status(500).json({ message: "server error" });
                }
              } else {
                return res.status(403).json({ message: "user already exits" });
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
};

const user_delete = (req, res) => {
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
  // Split the header into parts (e.g., "Bearer your-api-key")
  const [authType, apiKey] = authHeader.split(" ");
  if (authType !== "Bearer") {
    console.log("invalid authorization header");
    return res
      .status(400)
      .json({ message: "invalid Authorization header format." });
  }
  const filter = { key: apiKey };
  try {
    user_object.finduser(filter).then((result) => {
      if (result == null) {
        console.log("no user found");
        return res.status(404).json({ message: "user not found" });
      } else {
        try {
          user_object.deleteuser(filter);
          return res
            .status(200)
            .json({ message: "user deleted", user: result.user });
        } catch (error) {
          return res.status(500).json({ message: "server error" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = { user_post, user_get, user_put, user_delete };
