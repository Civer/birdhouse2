var MongoClient = require("mongodb").MongoClient;

var getDataFromDB = function(collection, query) {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(process.env.BACKEND_MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(function(db) {
        var dbo = db.db(process.env.BACKEND_MONGO_DATABASE);

        dbo
          .collection(collection)
          .find(query)
          .toArray()
          .then(result => {
            resolve(result);
            db.close();
          })
          .catch(error => {
            console.log(error);
            reject("Database Error");
          });
      })
      .catch(error => {
        console.log(error);
        reject("Database Error");
      });
  });
};

var usefulFunctions = {
  getDataFromDB
};

module.exports = usefulFunctions;
