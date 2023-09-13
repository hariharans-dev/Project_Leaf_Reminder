const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
const axios = require("axios");
const port = 3000;

app.use(cors());

app.get("/forgetpassword", async (req, res) => {
  try {
    const requestData = {
      user: req.body.user,
      password: req.body.password,
    };

    const apiUrl = "http://localhost:5000/api/users";

    const response = await axios({
      method: "get",
      url: apiUrl,
      data: requestData,
    });

    const responseData = response.data;

    return res.json(responseData);
  } catch (error) {
    console.error("Error:");
    return res.send("error");
  }
});

app.get("/signin", async (req, res) => {
  try {
    const requestData = {
      user: req.body.user,
      password: req.body.password,
    };

    const apiUrl = "http://localhost:5000/api/users";

    try {
      const response = await axios({
        method: "get",
        url: apiUrl,
        data: requestData,
      });
      const responseData = response.data.key;
      return res.json({
        status: response.status,
        key: responseData,
      });
    } catch (error) {
      if (error.response.data) {
        return res.json({
          status: error.response.status,
          data: error.response.data.message,
        });
      } else {
        return res.json({
          message: error.message,
        });
      }
    }
  } catch (error) {
    console.log("api down");
    return res.status(404).json({
      message: error.message,
      detials: "api not found"
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
