const express = require("express");
const router = express.Router();
const sessionFunctions = require("../functions/sessionFunctions");
const errorFunctions = require("../functions/errorFunctions");

router.post("/", function(req, res, next) {
  const userid = req.body.userid;
  const token = req.cookies.refreshToken;

  var sessionToken;
  var refreshToken;

  sessionFunctions
    .checkRefreshToken(userid, token)
    .then(() => sessionFunctions.killAllSessions(userid))
    .then(() => sessionFunctions.createNewSession(userid))
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
      if (error.id === 4001) {
        sessionFunctions
          .killAllSessions(userid)
          .then(() => res.json(errorFunctions.returnErrorMessage(error)));
      } else {
        res.json(errorFunctions.returnErrorMessage(error));
      }
    });
});

module.exports = router;
