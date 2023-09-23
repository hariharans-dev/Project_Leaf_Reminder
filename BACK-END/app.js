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

app.get("/signin", async (req, res) => {});

const request_data = async (url, body, method, res) => {
  try {
    const response = await axios({
      method: method,
      url: url,
      data: body,
    });
    
    const responseData = response.data.key;
    
    return res.status(response.status).json({
      status: response.status,
      key: responseData,
    });
  } catch (error) {
    if (error.response) {
      // Axios error with a response from the server
      return res.status(error.response.status).json({
        status: error.response.status,
        data: error.response.data.message,
      });
    } else {
      // Axios error with no response from the server
      return res.status(500).json({
        message: error.message,
      });
    }
  }
};


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
