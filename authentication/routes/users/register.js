const express = require("express");
const router = express.Router();
const authenticationFunctions = require("../functions/authenticationFunctions");
const userFunctions = require("../functions/userFunctions");
const sessionFunctions = require("../functions/sessionFunctions");
const errorFunctions = require("../functions/errorFunctions");

router.post("/", function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

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
  } else if (!email) {
    res.json(
      errorFunctions.returnErrorMessage({
        id: 2033,
        desc: "Email is not handed over."
      })
    );
  } else {
    userFunctions
      .checkUserIsUnique(username, email)
      .then(userIsUnique => {
        if (userIsUnique === true) {
          return userFunctions.createNewUser(username, password, email);
        } else {
          return Promise.reject({
            id: 2053,
            desc: "userIsUnique returned false even though not possible"
          });
        }
      })

      .catch(error => {
        res.json(errorFunctions.returnErrorMessage(error));
      });
  }
});

module.exports = router;
