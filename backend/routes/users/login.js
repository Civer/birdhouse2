var express = require("express");
var router = express.Router();
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
  var userid = "";

  authFunctions
    .checkUserExists(username)
    .then(resultObject => {
      if (resultObject.userExists === true) {
        if (resultObject.isVerified === true) {
          userid = resultObject.userid;
          return authFunctions.getUserSecurityInformation(userid);
        } else {
          return Promise.reject([
            {
              id: 2021,
              desc: "User is not verified."
            }
          ]);
        }
      } else {
        return Promise.reject([
          {
            id: 2020,
            desc: "User is not known."
          }
        ]);
      }
    })
    .then(securityInformation => {
      return authFunctions.checkPassword(
        password,
        securityInformation.password,
        securityInformation.salt
      );
    })
    .then(passwordIsValid => {
      if (passwordIsValid === true) {
        return authFunctions.createNewSession(userid);
      } else {
        return Promise.reject([
          {
            id: 2022,
            desc: "Password is invalid."
          }
        ]);
      }
    })
    .then(sessionToken => {})
    .catch(error => {
      console.log(error);
    });

  //return Promise.reject(error);

  res.json("respond with a resource");
});

module.exports = router;
