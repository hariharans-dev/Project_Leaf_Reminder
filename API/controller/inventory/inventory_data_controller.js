const { client, connectToMongoDB } = require("../../model/data_model.js");

connectToMongoDB();

class Inventory_data {
  create_device(data) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_INVENTORY);
      const currentDateTime = new Date();
      data.created_time = currentDateTime.toTimeString();
      data.created_date = currentDateTime.toDateString();
      collections.insertOne(data);
      console.log(`Inserted document`);
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }

  update_device(filter, data) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_INVENTORY);
      const currentDateTime = new Date();
      data.updated_time = currentDateTime.toTimeString();
      data.updateed_date = currentDateTime.toDateString();
      const update = { $set: data };
      collections.updateOne(filter, update);
      console.log(`Inserted document`);
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }

  assigned_device(filter, data) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_INVENTORY);
      const currentDateTime = new Date();
      data.assigned_time = currentDateTime.toTimeString();
      data.assigned_date = currentDateTime.toDateString();
      const update = { $set: data };
      collections.updateOne(filter, update);
      console.log(`Inserted document`);
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }

  find_device(filter) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_INVENTORY);
      const result = collections.findOne(filter);
      return result;
    } catch (error) {
      console.error("Error finding document");
      return error;
    }
  }

  delete_device(filter) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_INVENTORY);
      const result = collections.deleteOne(filter);
      return result;
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }

  findall_device(filter) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_INVENTORY);
      const result = collections.find(filter).toArray();
      var data = [];
      for (var i = 0; i < result.length; i++) {
        // Extract the 'deviceid' field from each document and store it in 'data'
        data[i] = { deviceid: result[i]["deviceid"] };
      }
      return result;
    } catch (error) {
      console.error("Error finding document");
      return error;
    }
  }
}

module.exports = Inventory_data;
