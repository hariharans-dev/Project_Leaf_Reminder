const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// Use cookie-parser middleware to handle cookies
app.use(cookieParser());

app.get("/set-cookie", (req, res) => {
  // Set a cookie with the name 'user' and the value 'hari'
  const user = "user";
  const name = "hari";
  res.cookie(user, name);
  res.send("Cookie saved: user=hari");
});

app.get("/get-cookie", (req, res) => {
  // Retrieve and print the value of the 'user' cookie
  const userCookie = req.cookies.user;
  console.log(userCookie);
  if (userCookie) {
    res.send(`User: ${userCookie}`);
  } else {
    res.send("User cookie not found.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
