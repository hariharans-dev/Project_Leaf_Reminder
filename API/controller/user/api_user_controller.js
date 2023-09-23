const { validationResult } = require("express-validator");
const {
  device_assignment,
} = require("../inter_functions/device_allocation.js");
const Login = require("./user_data_controller.js");
const crypto = require("crypto");

const user_object = new Login();

function generateRandomKey() {
  const length = 15;
  return crypto.randomBytes(length).toString("hex");
}

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
  const newuser = req.body;
  const byte64 = encode_byte64(newuser.user, newuser.password);
  const filter = { user: newuser.user };
  try {
    user_object.finduser(filter).then((value) => {
      if (value == null) {
        console.log("no duplication");
        (async () => {
          try {
            const deviceId = await device_assignment();
            if (deviceId !== null) {
              const currentDateTime = new Date();
              const new_user = {
                user: newuser.user,
                name: newuser.name,
                key: byte64,
                created_time: currentDateTime,
                deviceid: deviceId,
                verified: false,
              };
              try {
                user_object.createuser(new_user);
                console.log("user created");
                res.status(201).json({ message: "user created" });
              } catch (error) {
                console.log("error");
                return res.status(500).json({ message: "server error" });
              }
            } else {
              res.status(404).json({ message: "user not created" });
            }
          } catch (error) {
            console.error("An error occurred:");
            return res.status(500).json({ message: "server error" });
          }
        })();
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
  const body = req.body;
  var userkey = body.key;
  var filter = { key: userkey };
  try {
    user_object.finduser(filter).then((result) => {
      if (result == null) {
        console.log("user not found");
        return res.status(404).json({ message: "user not found" });
      } else {
        var filter = { key: userkey };
        [olduser, oldpassword] = decode_byte64(userkey);
        var update_data = body;
        if (body.user != null && body.password != null) {
          if (olduser == body.user) {
            if (body.password != null) {
              userkey = encode_byte64(body.user, body.password);
            } else {
              userkey = encode_byte64(body.user, oldpassword);
            }
          } else if (olduser != body.user) {
            try {
              filter = { user: body.user };
              user_object.finduser(filter).then((result2) => {
                if (result2 == null) {
                  if (body.password != null) {
                    userkey = encode_byte64(body.user, body.password);
                  } else {
                    userkey = encode_byte64(body.user, oldpassword);
                  }
                } else {
                  return res
                    .status(404)
                    .json({ message: "user already exists" });
                }
              });
            } catch (error) {
              return res.status(500).json({ message: "server error" });
            }
          } else {
            userkey = encode_byte64(olduser, body.password);
          }
        }
        if (userkey != null) {
          update_data.key = userkey;
        }
        delete update_data.password;
        const currentDateTime = new Date();
        update_data.updated_time = currentDateTime;
        const update = { $set: update_data };
        try {
          user_object.updateuser(filter, update);
          console.log("user updated");
          return res.status(200).json({ message: "user updated" });
        } catch {
          return res.status(500).json({ message: "server error" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const user_delete = (req, res) => {
  const body = req.body;
  const filter = { key: body.key };
  try {
    user_object.finduser(filter).then((result) => {
      if (result == null) {
        console.log("no user found");
        return res.status(404).json({ message: "user not found" });
      } else {
        try {
          user_object.deleteuser(filter);
          console.log("user deleted");
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

const user_sendverification = (req, res) => {
  const filter = { key: req.body.key };
  try {
    const currentDateTime = new Date();
    user_object.finduser(filter).then((result) => {
      if (result == null) {
        return res.status(404).json({ message: "user not found" });
      } else {
        if (result.verified == true) {
          return res.status(409).json({ message: "user already verified" });
        }
        const verification_key = generateRandomKey();
        const update = {
          $set: {
            verify_send_time: currentDateTime,
            verification_key: verification_key,
          },
        };
        try {
          user_object.updateuser(filter, update);
        } catch (error) {
          return res.status(500).json({ message: "server error" });
        }
        return res.status(200).json({ verification_key: verification_key });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const user_getverification = (req, res) => {
  const filter = { verification_key: req.body.verification_key };
  try {
    user_object.finduser(filter).then((result) => {
      if (result == null) {
        return res.status(404).json({ message: "verification key not found" });
      } else {
        const verify_send_time = result.verify_send_time;
        const currentDateTime = new Date();
        const timedifference = verify_send_time - currentDateTime;
        const minutes = timedifference / (1000 * 60);
        const expireminutes = 60;
        if (minutes < expireminutes) {
          const update = {
            $unset: {
              verification_key: 1,
              verify_send_time: 1,
            },
            $set: {
              verified: true,
              updated_time: currentDateTime,
              verified_time: currentDateTime,
            },
          };
          try {
            user_object.updateuser(filter, update);
            return res.status(200).json({ message: "user verified" });
          } catch (error) {
            return res.status(500).json({ message: "server error" });
          }
        } else {
          return res.status(409).json({ message: "verification key expired" });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  user_post,
  user_get,
  user_put,
  user_delete,
  user_sendverification,
  user_getverification,
};
