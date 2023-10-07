const cors = require("cors");
const express = require("express");
require("dotenv").config();
const router_user = require("./routes/user_route");
const router_util = require("./routes/utils_router");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", router_user);
app.use("/utils", router_util);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
