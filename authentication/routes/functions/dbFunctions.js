var MongoClient = require("mongodb").MongoClient;

var option = {
  numberOfRetries: 5,
  auto_reconnect: true,
  poolSize: 40,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

var dbPool;

var initDatabase = function() {
  MongoClient.connect(process.env.MONGO_URL, option)
    .then(db => {
      dbPool = db;
    })
    .catch(error => reject(error));
};

var getDB = function() {
  return new Promise(function(resolve, reject) {
    resolve(dbPool);
  });
};

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
    getDB()
      .then(db => {
        var dbo = db.db(process.env.MONGO_DATABASE);

        dbo
          .collection(collection)
          .find(query, projection)
          .toArray()
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => reject(error));
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
    getDB()
      .then(db => {
        var dbo = db.db(process.env.MONGO_DATABASE);

        dbo
          .collection(collection)
          .insertOne(insertObject)
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => reject(error));
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
var dbDeleteData = function(collection, query) {
  return new Promise(function(resolve, reject) {
    getDB()
      .then(db => {
        var dbo = db.db(process.env.MONGO_DATABASE);

        dbo
          .collection(collection)
          .deleteMany(query)
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => reject(error));
  });
};

var dbFunctions = {
  initDatabase,

  dbFetchData,
  dbInsertData,
  dbDeleteData
};

module.exports = dbFunctions;
