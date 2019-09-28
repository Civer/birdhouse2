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
  var storedUserObject = {};

  authFunctions
    .checkEmailExists()
    .then(resultObject => {
      if (resultObject.userExists === true) {
        return authFunctions.getUserObject(resultObject.userid);
      } else {
        return Promise.reject([
          {
            id: 2020,
            desc: "User is not known."
          }
        ]);
      }
    })
    .then(userObject => {
      storedUserObject = userObject;
      if (userObject.isVerified === true) {
        return authFunctions.getUserSecurityInformation(userObject.id);
      } else {
        return Promise.reject([
          {
            id: 2021,
            desc: "User is not verified."
          }
        ]);
      }
    })
    .then(securityInformation => {
      return authFunctions.checkPassword(
        storedUserObject.id,
        securityInformation.password,
        securityInformation.salt
      );
    })
    .then(passwordIsValid => {
      if (passwordIsValid === true) {
        return authFunctions.createNewSession(storedUserObject.id);
      } else {
        return Promise.reject([
          {
            id: 2022,
            desc: "Password is invalid."
          }
        ]);
      }
    })
    .catch(error => {
      console.log(error);
    });

  //return Promise.reject(error);

  res.json("respond with a resource");
});

module.exports = router;
