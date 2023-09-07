require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb+srv://Agri:epsqkQeFlEiva1rD@agri.tevb0vb.mongodb.net/?retryWrites=true&w=majority");
function connectToMongoDB() {
  try {
    client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
  return client;
}

module.exports = { client, connectToMongoDB };
