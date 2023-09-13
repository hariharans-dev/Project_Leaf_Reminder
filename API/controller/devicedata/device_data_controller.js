const { client, connectToMongoDB } = require("../../model/data_model.js");

connectToMongoDB();

class Device_data {
  createdata_devicedata(data) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_DEVICEDATA);
      const currentDateTime = new Date();
      data.created_time = currentDateTime.toTimeString();
      data.created_date = currentDateTime.toDateString();
      const result = collections.insertOne(data);
      console.log(`Inserted document`);
      return result;
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }

  data_additon(filter, data) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_DEVICEDATA);
      const update = {
        $push: { data: data },
      };
      const result = collections.updateOne(filter, update);
      console.log(`Inserted document`);
      return result;
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }

  findone_devicedata(filter) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_DEVICEDATA);
      const result = collections.findOne(filter);
      return result;
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }
  findcount_devicedata(filter, count) {
    try {
      const collections = client
        .db(process.env.DB_USER)
        .collection(process.env.COLLECTION_DEVICEDATA);
      const results = collections.find(filter).limit(count).toArray();
      return results;
    } catch (error) {
      console.error("Error inserting document:", error);
      return error;
    }
  }
}

module.exports = Device_data;
