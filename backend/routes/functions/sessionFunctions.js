const jwt = require("jsonwebtoken");
const dbFunctions = require("./dbFunctions");
const usefulFunctions = require("./usefulFunctions");
const crypto = require("crypto");

/**
 * This function returns an active session.
 * If no session is found the flag hasActiveSessions will be false
 *
 * @param {String} userid                           MongoDB User ID
 * @param {String} sessionToken                     JWT with MongoDB SessionId
 *
 * @returns {Object.hasActiveSession}               Boolean   Indicate if user has active session
 * @returns {Object.sessionObject.id}               String    Returns ID of active session
 * @returns {Object.sessionObject.dateToTerminate}  Date      Date showing when session should be killed due to inactivity
 * @returns {Object.sessionObject.dateLastRenewal}  Date      Last reset of dateToTerminate counter
 */

var checkSession = function(userid, sessionToken) {
  return new Promise(function(resolve, reject) {
    var returnObject = {
      hasActiveSession: false,
      sessionObject: {}
    };

    jwt
      .verify(sessionToken, process.env.BACKEND_JWT_SECRET)
      .then(payload => {
        getSessionTokenFromDB(userid, payload.token);
      })
      .then(sessionid => {
        if (sessionid) {
          resetSessionToken(userid);
        } else {
          return Promise.reject({
            id: 3002,
            desc: "SessionTokenInvalid"
          });
        }
      })
      .then(newToken => {
        resolve(newToken);
      })
      .catch(error => {
        reject({
          id: 9002,
          desc: "Error within sessionFunctions.checkSession",
          error: error
        });
      });
  });
};

/**
 * This function is used for renewing an already existing session
 *
 * @param {String} sessionid  Session ID based on MongoDB Session table
 *
 * @returns {Boolean}         Returns if sessionRenewal was successful
 */

var resetSessionToken = function(userid) {
  return new Promise(function(resolve, reject) {
    var sessionRenewed = false;

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(sessionRenewed);
    } else {
      reject(errors);
    }
  });
};

/**
 * This function is used for renewing an already existing session
 *
 * @param {String} userid  Session ID based on MongoDB Session table
 *
 * @returns {Boolean}         Returns if sessionRenewal was successful
 */

var resetRefreshToken = function(userid) {
  return new Promise(function(resolve, reject) {
    var sessionRenewed = false;

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(sessionRenewed);
    } else {
      reject(errors);
    }
  });
};

/**
 * This function is used for creating a new user session
 *
 * @param {String} userid User ID based on MongoDB user table
 *
 * @returns {Boolean}     Returns if session was created
 */

var createNewSession = function(userid) {
  return new Promise(function(resolve, reject) {
    var sessionToken = crypto
      .createHash("sha256")
      .update(usefulFunctions.generateToken(32))
      .digest("hex");

    var refreshToken = crypto
      .createHash("sha256")
      .update(usefulFunctions.generateToken(32))
      .digest("hex");

    const payload = { token: sessionToken };

    const token = jwt.sign(payload, process.env.BACKEND_JWT_SECRET, {
      expiresIn: "1h"
    });

    storeSessionToken(userid, sessionToken)
      .then(storeRefreshToken(userid, refreshToken))
      .then(() => {
        resolve({
          sessionToken: token,
          refreshToken: refreshToken
        });
      })
      .catch(error =>
        reject({
          id: 9003,
          desc: "Error within sessionFunctions.createNewSession",
          error: error
        })
      );
  });
};

/**
 * This function is used for killing a returned activeSession
 *
 * @param {String} sessionid  Session ID based on MongoDB Session table
 *
 * @returns {Boolean}         Returns if session was killed
 */

var killSession = function(sessionid) {
  return new Promise(function(resolve, reject) {
    var sessionKilled = false;

    var errors = [];

    //Try to kill session

    if (errors.length === 0) {
      resolve(sessionKilled);
    } else {
      reject(errors);
    }
  });
};

/**
 * Kills all sessions of a given user
 *
 * @param {String} userid     userid of the user which sessions should be killed
 *
 * @returns {Boolean}         Returns if session was killed
 */

var killAllSessions = function(userid) {
  return new Promise(function(resolve, reject) {
    var sessionKilled = false;

    var errors = [];

    //Try to kill session

    if (errors.length === 0) {
      resolve(sessionKilled);
    } else {
      reject(errors);
    }
  });
};

/*********************
 * PRIVATE FUNCTIONS *
 *********************/

/**
 * This function is used for renewing an already existing session
 *
 * @param {String} userid         User ID
 * @param {String} sessiontoken   SessionToken
 *
 * @returns {Boolean}             Returns if sessionRenewal was successful
 */

var getSessionTokenFromDB = function(userid, token) {
  return new Promise(function(resolve, reject) {
    var collection = "sessionTokens";
    var query = { userid: userid, token: token };
    var projection = { projection: { _id: 1 } };

    dbFunctions
      .dbFetchData(collection, query, projection)
      .then(result => {
        if (result.length === 0) {
          resolve(false);
        } else {
          resolve(result._id);
        }
      })
      .catch(error => {
        reject({
          id: 9001,
          desc: "Error with database connection.",
          error: error
        });
      });
  });
};

/**
 * This function is used for renewing an already existing session
 *
 * @param {String} sessionid  Session ID based on MongoDB Session table
 *
 * @returns {Boolean}         Returns if sessionRenewal was successful
 */

var getRefreshTokenFromDB = function(userid, sessiontoken) {
  return new Promise(function(resolve, reject) {
    var sessionRenewed = false;

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(sessionRenewed);
    } else {
      reject(errors);
    }
  });
};

var storeSessionToken = function(userid, token) {
  return new Promise(function(resolve, reject) {
    //Choose MongoDB collection
    var collection = "sessionTokens";

    //Define object to be inserted
    var insertObject = {
      userid: userid,
      sessionToken: token,
      tokenCreated: new Date()
    };

    dbFunctions
      .dbInsertData(collection, insertObject)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject({
          id: 9001,
          desc: "Error with database connection.",
          error: error
        });
      });
  });
};

var storeRefreshToken = function(userid, token) {
  return new Promise(function(resolve, reject) {
    //Choose MongoDB collection
    var collection = "refreshTokens";

    //Define object to be inserted
    var insertObject = {
      userid: userid,
      renewalToken: token,
      tokenCreated: new Date()
    };

    dbFunctions
      .dbInsertData(collection, insertObject)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject({
          id: 9001,
          desc: "Error with database connection.",
          error: error
        });
      });
  });
};

var createSessionToken = function(token) {
  return new Promise(function(resolve, reject) {});
};

var verifySessionToken = function(token) {};

var sessionFunctions = {
  checkSession,

  resetSessionToken,
  resetRefreshToken,

  createNewSession,

  killSession,
  killAllSessions
};

module.exports = sessionFunctions;
