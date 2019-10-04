const jwt = require("jsonwebtoken");
const dbFunctions = require("./dbFunctions");
const crypto = require("crypto");
const mongo = require("mongodb");
const uuidv4 = require("uuid/v4");

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

var checkRefreshToken = function(userid, refreshToken) {
  return new Promise(function(resolve, reject) {
    getRefreshTokenFromDB(userid, refreshToken)
      .then(() => {
        resolve(true);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * This function is used for creating a new user session
 *
 * @param {String} userid User ID based on MongoDB user table
 *
 * @returns {Boolean}     Returns if session was created
 */

const createNewSession = function(userid) {
  return new Promise(function(resolve, reject) {
    const refreshToken = crypto
      .createHash("sha256")
      .update(uuidv4())
      .digest("hex");

    const payload = { userid: userid };
    const options = { algorithm: "HS512", expiresIn: "1h" };

    const sessionToken = jwt.sign(payload, process.env.JWT_SECRET, options);

    storeRefreshToken(userid, refreshToken)
      .then(() => {
        resolve({
          sessionToken: sessionToken,
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
 * Kills all sessions of a given user
 *
 * @param {String} userid     userid of the user which sessions should be killed
 *
 * @returns {Boolean}         Returns if session was killed
 */

var killAllSessions = function(userid) {
  return new Promise(function(resolve, reject) {
    var collection = "refreshTokens";
    var mongouser = new mongo.ObjectID(userid);

    //Define object to be inserted
    var query = {
      userid: mongouser
    };

    dbFunctions
      .dbDeleteData(collection, query)
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

var getRefreshTokenFromDB = function(userid, token) {
  return new Promise(function(resolve, reject) {
    var collection = "refreshTokens";
    var mongouser = new mongo.ObjectID(userid);

    var query = {
      $and: [{ userid: mongouser }, { refreshToken: token }]
    };
    var projection = { projection: { _id: 1 } };

    dbFunctions
      .dbFetchData(collection, query, projection)
      .then(result => {
        if (result.length === 0) {
          reject({
            id: 4001,
            desc: "Refresh token is not matching database entry!",
            error: "UserID: " + userid
          });
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

var storeRefreshToken = function(userid, token) {
  return new Promise(function(resolve, reject) {
    //Choose MongoDB collection
    var collection = "refreshTokens";
    var mongouser = new mongo.ObjectID(userid);

    //Define object to be inserted
    var insertObject = {
      userid: mongouser,
      refreshToken: token,
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

var sessionFunctions = {
  checkRefreshToken,

  createNewSession,

  killAllSessions
};

module.exports = sessionFunctions;
