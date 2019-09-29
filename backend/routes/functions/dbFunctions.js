var MongoClient = require("mongodb").MongoClient;

/**
 * This function will find data in the MongoDB
 *
 * @param {String} collection Name of MongoDB collection
 * @param {String} query      MongoDB conform query object
 *
 * @returns {Array.object}    MongoDB result
 */
var dbFetchData = function(collection, query, projection) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(process.env.BACKEND_MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(function(db) {
        var dbo = db.db(process.env.BACKEND_MONGO_DATABASE);

        dbo
          .collection(collection)
          .find(query, projection)
          .toArray()
          .then(result => {
            db.close();
            resolve(result);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * This function will add data to the MongoDB
 *
 * @param {String} collection                 Name of MongoDB collection
 * @param {Array with objects} insertObject   MongoDB conform query object
 *
 * @returns {Number}                          Number of successful inserts
 */
var dbInsertData = function(collection, insertObject) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(process.env.BACKEND_MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(function(db) {
        var dbo = db.db(process.env.BACKEND_MONGO_DATABASE);

        dbo
          .collection(collection)
          .insertOne(insertObject)
          .then(result => {
            db.close();
            resolve(result.insertedIds);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
};

var dbFunctions = {
  dbFetchData,
  dbInsertData
};

module.exports = dbFunctions;
