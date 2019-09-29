const express = require("express");
const router = express.Router();
const authenticationFunctions = require("../functions/authenticationFunctions");
const userFunctions = require("../functions/userFunctions");
const sessionFunctions = require("../functions/sessionFunctions");

const url = process.env.BACKEND_MONGO_URL;

var returnObject = {
  validCall: true,
  body: {},
  errors: {}
};

router.post("/", function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var keepUserLoggedIn = req.body.keepUserLoggedIn;
  console.log(req.headers.authorization);
  var userid;
  var sessionToken;
  var refreshToken;

  userFunctions
    .checkUserExists(username)
    .then(resultObject => {
      if (resultObject.userExists === true) {
        if (resultObject.isVerified === true) {
          userid = resultObject.userid;
          return authenticationFunctions.getUserSecurityInformation(userid);
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
      return authenticationFunctions.checkPassword(
        password,
        securityInformation.password,
        securityInformation.salt
      );
    })
    .then(passwordIsValid => {
      if (passwordIsValid === true) {
        return sessionFunctions.createNewSession(userid, keepUserLoggedIn);
      } else {
        return Promise.reject([
          {
            id: 2022,
            desc: "Password is invalid."
          }
        ]);
      }
    })
    .then(tokenArray => {
      sessionToken = tokenArray.sessionToken;
      refreshToken = tokenArray.refreshToken;
      res.json({
        userid: userid,
        sessionToken: sessionToken,
        refreshToken: refreshToken
      });
    })
    .catch(error => {
      console.log(error);
    });

  //return Promise.reject(error);

  res.json("respond with a resource");
});

module.exports = router;
