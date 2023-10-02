const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { otp_mailer } = require("../functions/otp_mailer");

const user_session = (req, res) => {
  const data = { session_id: req.body.session_id };
  const url = "http://localhost:5000/api/users/login-session";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LOGIN_APIKEY}`,
  };
  try {
    axios
      .post(url, data, { headers })
      .then((response) => {
        console.log("response: ", response.data);
        response.data.status = response.status;
        return res.json(response.data);
      })
      .catch((error) => {
        try {
          console.error("error", error.response.data);
          error.response.data.status = error.response.status;
        } catch (error) {
          return res.json({ status: 500, message: "server error" });
        }
        return res.json(error.response.data);
      });
  } catch (error) {
    return res.json({ status: 500, message: "server error" });
  }
};

const user_login = (req, res) => {
  const body = req.body;
  const data = { user: body.user, password: body.password };
  const url = "http://localhost:5000/api/users/login";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LOGIN_APIKEY}`,
  };
  try {
    axios
      .post(url, data, { headers })
      .then((response) => {
        console.log("response: ", response.data);
        response.data.status = response.status;
        return res.json(response.data);
      })
      .catch((error) => {
        try {
          console.error("error", error.response.data);
          error.response.data.status = error.response.status;
        } catch (error) {
          console.log;
          return res.json({ status: 500, message: "server error" });
        }
        return res.json(error.response.data);
      });
  } catch (error) {
    return res.json({ status: 500, message: "server error" });
  }
};

const user_sendotp = (req, res) => {
  const body = req.body;
  const data = { user: body.user, password: body.password };
  const url = "http://localhost:5000/api/users/sendotp";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LOGIN_APIKEY}`,
  };
  try {
    axios
      .post(url, data, { headers })
      .then((response) => {
        const otp = response.data.otp;
        console.log(otp);
        try {
          const result = otp_mailer(body.user, otp);
        } catch (error) {
          return res.json({ status: 500, message: "server error" });
        }
        const result = { message: "otp sent", status: 200 };
        return res.json(result);
      })
      .catch((error) => {
        try {
          error.response.data.status = error.response.status;
          console.error("error", error.response.data);
          return res.json(error.response.data);
        } catch (error) {
          return res.json({ status: 500, message: "server error" });
        }
      });
  } catch (error) {
    return res.json({ status: 500, message: "server error" });
  }
};

const user_verifyotp = (req, res) => {
  const body = req.body;
  const data = { user: body.user, otp: body.otp };
  const url = "http://localhost:5000/api/users/verifyotp";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LOGIN_APIKEY}`,
  };
  try {
    axios
      .post(url, data, { headers })
      .then((response) => {
        const forget_password_key = response.data.forget_password_key;
        const result = {
          forget_password_key: forget_password_key,
          status: 200,
        };
        return res.json(result);
      })
      .catch((error) => {
        try {
          error.response.data.status = error.response.status;
          console.error("error", error.response.data);
          return res.json(error.response.data);
        } catch (error) {
          return res.json({ status: 500, message: "server error" });
        }
      });
  } catch (error) {
    return res.json({ status: 500, message: "server error" });
  }
};

const user_forgetpassword = (req, res) => {
  const body = req.body;
  const data = {
    forget_password_key: body.forget_password_key,
    password: body.password,
  };
  const url = "http://localhost:5000/api/users/forgetpassword";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LOGIN_APIKEY}`,
  };
  try {
    axios
      .post(url, data, { headers })
      .then((response) => {
        const result = { message: response.data.message, status: 200 };
        return res.json(result);
      })
      .catch((error) => {
        try {
          error.response.data.status = error.response.status;
          console.error("error", error.response.data);
          return res.json(error.response.data);
        } catch (error) {
          return res.json({ status: 500, message: "server error" });
        }
      });
  } catch (error) {
    return res.json({ status: 500, message: "server error" });
  }
};

module.exports = {
  user_login,
  user_sendotp,
  user_verifyotp,
  user_forgetpassword,
  user_session,
};
