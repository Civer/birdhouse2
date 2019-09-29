const commonFunctions = require("./dbFunctions");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

/**
 *
 * @param {String} userid   MongoDB User ID
 *
 * @returns {String}        Salt stored in DB for given userid
 */

var getUserSecurityInformation = function(userid) {
  return new Promise(function(resolve, reject) {
    var securityInformation = {};

    //Set MongoDB collection
    var collection = "users";

    //Search for capitalized email
    var query = { _id: userid };

    //Limit results
    var projection = { projection: { securityInformation: 1 } };

    commonFunctions
      .dbFetchData(collection, query, projection)
      .then(result => {
        securityInformation = result[0].securityInformation;
        resolve(securityInformation);
      })
      .catch(err => {
        reject([
          {
            id: 2001,
            desc: "Error with database connection."
          }
        ]);
      });
  });
};

/**
 *
 * @param {String} userid           MongoDB User ID
 * @param {String} enteredPassword  SHA256 User password entered by user
 * @param {String} databasePassword SHA256 User password from database
 * @param {String} salt             SHA256 User salt from call "getUserSalt"
 *
 * @returns {Boolean}       Returns if password used is valid
 */

var checkPassword = function(enteredPassword, databasePassword, salt) {
  return new Promise(function(resolve, reject) {
    var passwordIsValid;

    enteredPassword = enteredPassword.toUpperCase();
    salt = salt.toUpperCase();

    var saltedPassword = enteredPassword + salt;

    var sha256Pass = crypto
      .createHash("sha256")
      .update(saltedPassword)
      .digest("hex");

    bcrypt
      .compare(sha256Pass, databasePassword)
      .then(function(result) {
        if (result === true) {
          passwordIsValid = true;
          resolve(passwordIsValid);
        } else {
          passwordIsValid = false;
          resolve(passwordIsValid);
        }
      })
      .catch(function(error) {
        console.log(error);
        reject(error);
      });
  });
};

/**
 * This function is used for sending out a new password
 * Be careful to use the email in the user object and not the one used for verification
 *
 * @param {String} userid User ID base of MongoDB _ID
 * @param {String} email  Email to which the password should be send
 *
 * @returns {Boolean}     Returns if token is send
 */

var sendPasswordResetToken = function(userid, email) {
  return new Promise(function(resolve, reject) {
    var tokenSend = false;
    var errors = [];

    //Try to kill session

    if (errors.length === 0) {
      resolve(tokenSend);
    } else {
      reject(errors);
    }
  });
};

/**
 * Checks userid and token from an email to verify if password token is valid
 *
 * @param {String} userid MongoDB user id
 * @param {String} token  SHA256 token
 *
 * @returns {Boolean}     Returns if token was valid
 */

var checkPasswordToken = function(userid, token) {
  return new Promise(function(resolve, reject) {
    var validToken = false;
    var errors = [];

    //Try to kill session

    if (errors.length === 0) {
      resolve(validToken);
    } else {
      reject(errors);
    }
  });
};

/**
 * This function is used for resetting password
 *
 * @param {String} userid       UserId based of MongoDB
 * @param {String} newPassword  New password as SHA256 hash
 *
 * @returns {Boolean}           Returns if reset is a success
 */

var resetPassword = function(userid, newPassword) {
  return new Promise(function(resolve, reject) {
    var validReset = false;
    var errors = [];

    //Try to kill session

    if (errors.length === 0) {
      resolve(validReset);
    } else {
      reject(errors);
    }
  });
};

var authFunctions = {
  getUserSecurityInformation,
  checkPassword,

  sendPasswordResetToken,
  checkPasswordToken,
  resetPassword
};

module.exports = authFunctions;
