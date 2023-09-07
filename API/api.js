const Login = require("./usercontroller");
const express = require("express");
const { validationResult, check } = require("express-validator");
const app = express();
app.use(express.json());
const PORT = 5000;
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

var validateRequestBody = [
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

app.post("/api/users", validateRequestBody, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }

  const newuser = req.body;
  const byte64 = encode_byte64(newuser.user, newuser.password);
  const filter = { user: newuser.user };

  user_object.finduser(filter).then((value) => {
    if (value == null) {
      console.log("no duplication");
      try {
        const new_user = {
          user: newuser.user,
          name: newuser.name,
          key: byte64,
        };
        user_object.createuser(new_user);
        res.status(201).json({ key: byte64 });
      } catch (error) {
        console.error("Error inserting document:", error);
        res.status(404).json({ message: "server error" });
      }
    } else {
      console.log("duplication");
      return res.status(409).json({ message: "user already exits" });
    }
  });
});

validateRequestBody = [
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

app.get("/api/users", validateRequestBody, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const body = req.body;
  const byte64 = encode_byte64(body.user, body.password);
  const filter = { key: byte64 };

  user_object.finduser(filter).then((result) => {
    if (result == null) {
      return res.status(404).json({ message: "user not found" });
    } else {
      return res.status(200).json({ key: byte64 });
    }
  });
});

var allowedFields = ["name", "user", "password"];

validateRequestBody = [
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

app.put("/api/users", validateRequestBody, (req, res) => {
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
  const body = req.body;
  var filter = { key: apiKey };
  user_object.finduser(filter).then((result) => {
    if (result == null) {
      console.log("user not found");
      return res.status(404).json({ message: "user not found" });
    } else {
      const byte64 = encode_byte64(body.user, body.password);
      filter = { user: body.user };
      user_object.finduser(filter).then((result) => {
        if (result == null) {
          var data = body;
          data.key = byte64;
          try {
            filter = { key: apiKey };
            user_object.updateuser(filter, data);
            console.log("user updated");
            return res.status(200).json(data);
          } catch {
            console.log("error in finding");
            return res.status(404).json({ message: "server error" });
          }
        } else {
          return res.status(403).json({ message: "user already exits" });
        }
      });
    }
  });
});

validateRequestBody = [];

app.delete("/api/users", (req, res) => {
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
  user_object.finduser(filter).then((result) => {
    if (result == null) {
      console.log("no user found");
      return res.status(404).json({ message: "user not found" });
    } else {
      user_object.deleteuser(filter);
      return res
        .status(200)
        .json({ message: "user deleted", user: result.user });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
