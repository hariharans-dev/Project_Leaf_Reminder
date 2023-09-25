const axios = require("axios"); // Import Axios

const user_login = (req, res) => {
  const body = req.body;
  console.log(body);
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
        console.log("Response:", response.data);
        return res.json(response.data);
      })
      .catch((error) => {
        console.error(error.response.data);
        return res.json(error.response.data);
      });
  } catch (error) {
    return error;
  }
};

module.exports = { user_login };
