const express = require("express");
const app = express();
const router = require("./routes/route"); // Ensure the correct path to your router file

app.use(express.json());

// Use the router for a specific path prefix (e.g., /api)
app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
