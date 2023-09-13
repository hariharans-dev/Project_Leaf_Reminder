const { client, connectToMongoDB } = require("../../model/data_model.js");

connectToMongoDB();
class Login {
  createuser(data) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_USER);
      const currentDateTime = new Date();
      data.created_time = currentDateTime.toTimeString();
      data.created_date = currentDateTime.toDateString();
      const resutl = collections.insertOne(data);
      console.log(`Inserted document`);
      return resutl;
    } catch (error) {
      console.error("Error inserting document:");
      return error;
    }
  }

  finduser(data) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_USER);
      const result = collections.findOne(data);
      return result;
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }

  updateuser(filter, data) {
    const collections = client
      .db(process.env.DB_USER)
      .collection(process.env.COLLECTION_USER);
    const currentDateTime = new Date();
    data.updated_time = currentDateTime.toTimeString();
    data.update_date = currentDateTime.toDateString();
    const update = {
      $set: data,
    };
    try {
      const result = collections.updateMany(filter, update);
      return result;
      console.log(`document(s) updated`);
    } catch (error) {
      console.error("Error updating document:", error);
      return error;
    }
  }

  deleteuser(filter) {
    const collections = client
      .db(process.env.DB_USER)
      .collection(process.env.COLLECTION_USER);
    try {
      const result = collections.deleteOne(filter);
      console.log(`user deleted`);
      return result;
    } catch (error) {
      console.error("Error deleting user:", error);
      return error;
    }
  }
}

module.exports = Login;
