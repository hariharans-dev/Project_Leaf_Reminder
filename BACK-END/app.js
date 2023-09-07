const express = require("express");
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get("/signup", (req, res) => {
  const body = req.body;
  console.log(body);
  return res.send("Hello, World!");
});

app.get("/signin", (req, res) => {
  const body = req.body;
  console.log(body);
  return res.send("Hello, World!");
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
