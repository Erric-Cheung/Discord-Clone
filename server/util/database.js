const mongodb = require("mongodb");

let db;

const uri =
  "mongodb+srv://erriccheung:7fXeGb6MwPwCVmOV@cluster0.ifep27x.mongodb.net/?retryWrites=true&w=majority";

const client = new mongodb.MongoClient(uri);

const connectMongo = async (callback) => {
  try {
    // Connect the client to the server
    await client.connect();
    db = client.db();
    console.log("Connected");
    await callback();
  } catch (err) {
    console.error(err);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};

const getDatabase = () => {
  if (db) {
    return db;
  }
  throw "No database found";
};

module.exports = { getDatabase, connectMongo };
