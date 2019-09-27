var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var authFunctions = require("../functions/authenticationFunctions");

const url = process.env.BACKEND_MONGO_URL;

var returnObject = {
  validCall: true,
  body: {},
  errors: {}
};

router.post("/", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  authFunctions
    .hasActiveSessionPromise()
    .then(
      function foundActiveSession(result) {
        return authFunctions.killActiveSessionPromise(result);
      },
      function foundNoActiveSession(error) {
        //return authFunctions.check
      }
    )
    .then(
      function(result) {
        console.log(result);
      },
      function(error) {
        console.log(error);
      }
    );

  //return Promise.reject(error);

  res.json("respond with a resource");
});

module.exports = router;
