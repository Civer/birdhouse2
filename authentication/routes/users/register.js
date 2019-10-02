const express = require("express");
const router = express.Router();
const userFunctions = require("../functions/userFunctions");
const errorFunctions = require("../functions/errorFunctions");
const mailFunctions = require("../functions/mailFunctions");

router.post("/", function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  var userid;

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
          return userFunctions.createNewUser(username, email, password);
        } else {
          return Promise.reject({
            id: 2053,
            desc: "userIsUnique returned false even though not possible"
          });
        }
      })
      .then(createdUserResult => {
        userid = createdUserResult.insertedId;
        return userFunctions.createVerificationToken(
          createdUserResult.insertedId
        );
      })
      .then(verificationToken => {
        console.log(verificationToken);
        return mailFunctions.sendRegistrationMail(
          email,
          userid,
          verificationToken
        );
      })
      .then(() => {
        //Send Email + Password + UserID so that the user can be cloned in business database
        res.json("");
      })
      .catch(error => {
        res.json(errorFunctions.returnErrorMessage(error));
      });
  }
});

module.exports = router;
