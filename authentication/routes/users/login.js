const express = require("express");
const router = express.Router();
const authenticationFunctions = require("../functions/authenticationFunctions");
const userFunctions = require("../functions/userFunctions");
const sessionFunctions = require("../functions/sessionFunctions");
const errorFunctions = require("../functions/errorFunctions");

router.post("/", function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  var userid;
  var sessionToken;
  var refreshToken;

  if (!username) {
    res.json(
      errorFunctions.returnErrorMessage({
        id: 2031,
        desc: "Username is not handed over."
      })
    );
  } else if (!password) {
    res.json(
      errorFunctions.returnErrorMessage({
        id: 2032,
        desc: "Password is not handed over."
      })
    );
  } else {
    userFunctions
      .checkUserExists(username)
      .then(resultObject => {
        if (resultObject.userExists === true) {
          if (resultObject.isVerified === true) {
            userid = resultObject.userid;
            return authenticationFunctions.getUserSecurityInformation(userid);
          } else {
            return Promise.reject({
              id: 2021,
              desc: "User is not verified."
            });
          }
        } else {
          return Promise.reject({
            id: 2020,
            desc: "User is not known."
          });
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
          return sessionFunctions.createNewSession(userid);
        } else {
          return Promise.reject({
            id: 2022,
            desc: "Password is invalid."
          });
        }
      })
      .then(tokenArray => {
        sessionToken = tokenArray.sessionToken;
        refreshToken = tokenArray.refreshToken;
        res.json({
          validCall: true,
          sessionToken: sessionToken,
          refreshToken: refreshToken
        });
      })
      .catch(error => {
        res.json(errorFunctions.returnErrorMessage(error));
      });
  }
});

module.exports = router;
