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
    console.error("Error:", error.response.data.message);
    return res.json({
      message: error.response.data.message,
      status: error.response.status,
    });
  }
});

app.get("/signin", async (req, res) => {
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
    console.error("Error:", error.response.data.message);
    return res.json({
      message: error.response.data.message,
      status: error.response.status,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
