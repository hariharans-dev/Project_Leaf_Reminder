const { client, connectToMongoDB } = require("./usermodel");

connectToMongoDB();
class Login {
  createuser(data) {
    try {
      const collections = client.db("Agri").collection("users");
      collections.insertOne(data);
      console.log(`Inserted document`);
    } catch (error) {
      console.error("Error inserting document:", error);
    }
  }

  finduser(data) {
    try {
      const collections = client.db("Agri").collection("users");
      const result = collections.findOne(data);
      return result;
    } catch (error) {
      console.error("Error inserting document:", error);
    }
  }

  updateuser(filter, data) {
    const collections = client.db("Agri").collection("users");
    const update = {
      $set: data,
    };
    try {
      const result = collections.updateMany(filter, update);
      console.log(`document(s) updated`);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  deleteuser(filter) {
    const collections = client.db("Agri").collection("users");
    try {
      const result = collections.deleteOne(filter);
      console.log(`user deleted`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
}

module.exports = Login;
