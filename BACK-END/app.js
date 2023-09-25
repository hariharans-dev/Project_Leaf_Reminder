const express = require("express");
require("dotenv").config();
const app = express();
const cors = require('cors');
const router = require("./routes/route"); 

app.use(express.json());
app.use(cors());

// Use the router for a specific path prefix (e.g., /api)
app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
