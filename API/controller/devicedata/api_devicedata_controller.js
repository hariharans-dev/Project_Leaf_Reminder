const { validationResult } = require("express-validator");
const Device_data = require("./device_data_controller.js");

const device_object = new Device_data();

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

const devicedata_post = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "not in proper format" });
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "authorization header is missing." });
  }
  const [authType, apiKey] = authHeader.split(" ");
  if (authType !== "Bearer") {
    return res
      .status(400)
      .json({ message: "invalid Authorization header format." });
  }
  const [key, deviceid] = decode_byte64(apiKey);
  const body = req.body;
  const currentDateTime = new Date();

  if (key === process.env.DEVICE_DATA_APIKEY || key === ADMIN_APIKEY) {
    const filter = { deviceid: deviceid };
    var data = {
      deviceid: deviceid,
      data: [
        {
          time: currentDateTime,
          soilmoisture: body.soilmoisture,
          temperature: body.temperature,
        },
      ],
    };
    try {
      device_object.findone_devicedata(filter).then((result) => {
        if (result == null) {
          try {
            device_object.createdata_devicedata(data);
            console.log("created device for the first time");
            return res
              .status(200)
              .json({ message: "created deviceid and data added" });
          } catch {
            return res.status(500).json({ message: "server error" });
          }
        } else {
          data = {
            time: currentDateTime,
            soilmoisture: body.soilmoisture,
            temperature: body.temperature,
          };
          try {
            const update = {
              $push: { data: data },
            };
            device_object.data_additon(filter, update);
            console.log("inserted data from already created deviceid");
            return res.status(200).json({ message: "data added" });
          } catch (error) {
            return res.status(500).json({ message: "server error" });
          }
        }
      });
    } catch (error) {
      console.log("error");
      return res.status(500).json({ message: "server error" });
    }
  } else {
    return res.status(401).json({ message: "Invalid authentication" });
  }
};

module.exports = { devicedata_post };
