const dbFunctions = require("./dbFunctions");
const crypto = require("crypto");
const usefulFunctions = require("./usefulFunctions");
const bcrypt = require("bcrypt");

/**
 * This function will check if an user exists and return its ID
 *
 * @param {String} username       String with username
 *
 * @returns {Object.userExists}   Boolean indicating if user exists
 * @returns {Object.userid}       MongoDB userid
 */

var checkUserExists = function(username) {
  return new Promise(function(resolve, reject) {
    var returnObject = {};

    //Set MongoDB collection
    var collection = "users";

    //Search for users with this username
    var query = { username: username.toLowerCase() };

    //Limit results
    var projection = { projection: { _id: 1, isVerified: 1 } };

    dbFunctions
      .dbFetchData(collection, query, projection)
      .then(result => {
        if (result.length === 0) {
          returnObject.userExists = false;
          resolve(returnObject);
        } else {
          returnObject.userExists = true;
          returnObject.isVerified = result[0].isVerified;
          returnObject.userid = result[0]._id;
          resolve(returnObject);
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
 * This function will check if an email exists and return dedicated userid
 *
 * @param {String} email          String with email
 *
 * @returns {Object.userExists}   Boolean indicating if user exists
 * @returns {Object.userid}       MongoDB userid
 */

var checkEmailExists = function(email) {
  return new Promise(function(resolve, reject) {
    var returnObject = {};

    //Set MongoDB collection
    var collection = "users";

    //Search for capitalized email
    var query = { email: email.toLowerCase() };

    //Limit results
    var projection = { projection: { _id: 1, isVerified: 1 } };

    dbFunctions
      .dbFetchData(collection, query, projection)
      .then(result => {
        if (result.length === 0) {
          returnObject.userExists = false;
          resolve(returnObject);
        } else {
          returnObject.userExists = true;
          returnObject.isVerified = result[0].isVerified;
          returnObject.userid = result[0]._id;
          resolve(returnObject);
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
 * This function will check if an email exists and return dedicated userid
 *
 * @param {String} username          String with email
 * @param {String} email          String with email
 *
 * @returns {Object.userExists}   Boolean indicating if user exists
 * @returns {Object.userid}       MongoDB userid
 */

var checkUserIsUnique = function(username, email) {
  return new Promise(function(resolve, reject) {
    checkUserExists(username)
      .then(usernameReturnObject => {
        if (usernameReturnObject.userExists === false) {
          return checkEmailExists(email);
        } else {
          return Promise.reject({
            id: 2051,
            desc: "User already existing"
          });
        }
      })
      .then(emailReturnObject => {
        if (emailReturnObject.userExists === false) {
          resolve(true);
        } else {
          return Promise.reject({
            id: 2052,
            desc: "EMail already existing"
          });
        }
      })
      .catch(error => reject(error));
  });
};

/**
 *
 * @param {String} userid                MongoDB Id of user
 *
 * @returns {Object.id}                  String  MongoDB id of user
 * @returns {Object.email}               String  Email of user
 * @returns {Object.firstname}           String  Firstname of user
 * @returns {Object.lastname}            String  Lastname of user
 * @returns {Object.country}             String  Country of user as ISO Code
 * @returns {Object.isVerified}          Boolean State if user is verified
 * @returns {Object.dateAccountCreated}  Date    Account Creation Date
 * @returns {Object.dateLastLogin}       Date    Last Login Date
 */

var getUserObject = function(userid) {
  return new Promise(function(resolve, reject) {
    var userObject = {};

    //Set MongoDB collection
    var collection = "users";

    //Search for capitalized email
    var query = { _id: userid };

    //Limit results
    var projection = {};

    dbFunctions
      .dbFetchData(collection, query, projection)
      .then(result => {
        userObject.id = result[0]._id;
        userObject.email = result[0].email;
        userObject.firstname = result[0].firstname;
        userObject.lastname = result[0].lastname;
        userObject.country = result[0].country;
        userObject.isVerified = result[0].isVerified;
        userObject.dateAccountCreated = result[0].dateAccountCreated;
        userObject.dateLastLogin = result[0].dateLastLogin;

        resolve(userObject);
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
 * This function is used for creating a new user in the database
 *
 * @param {String} username Username as string
 * @param {String} email    Email of user
 * @param {String} password SHA256 hash of password from fronted
 *
 * @returns {Object.userCreated}  Boolean States if user is created in database
 * @returns {Object.id}           String  Returned MongoDB _id for new user
 * @returns {Object.email}        String  Email of user
 */

var createNewUser = function(username, email, password) {
  return new Promise(function(resolve, reject) {
    const saltRounds = 14;

    var salt = crypto
      .createHash("sha256")
      .update(usefulFunctions.generateToken(32))
      .digest("hex");

    var saltedPassword = password + salt;

    var sha256Pass = crypto
      .createHash("sha256")
      .update(saltedPassword)
      .digest("hex");

    bcrypt
      .hash(sha256Pass, saltRounds)
      .then(function(result) {
        var encryptedPassword = result;
        return storeUserInDatabase(username, email, encryptedPassword, salt);
      })
      .then(result => {
        resolve(result);
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

/**
 * This function is used for creating a new user in the database
 *
 * @param {String} username Username as string
 * @param {String} email    Email of user
 * @param {String} encryptedPassword bcrypt password
 * @param {String} salt SHA256 salt
 *
 * @returns {Object.userCreated}  Boolean States if user is created in database
 * @returns {Object.id}           String  Returned MongoDB _id for new user
 * @returns {Object.email}        String  Email of user
 */

var storeUserInDatabase = function(username, email, encryptedPassword, salt) {
  return new Promise(function(resolve, reject) {
    //Choose MongoDB collection
    var collection = "users";

    //Define object to be inserted
    var insertObject = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      securityInformation: {
        password: encryptedPassword,
        salt: salt
      },
      isVerified: false,
      creationDate: new Date()
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

/**
 * This function will create and return a SHA256 token created in the verification table
 *
 * @param {String} userid MongoDB user id that will be used while creating the token
 *
 * @returns {String}      String including the newly created SHA256 token
 */

var createVerificationToken = function(userid) {
  return new Promise(function(resolve, reject) {
    var token = crypto
      .createHash("sha256")
      .update(usefulFunctions.generateToken(32))
      .digest("hex");

    var collection = "verificationTokens";

    //Define object to be inserted
    var insertObject = {
      token: token,
      userid: userid,
      creationDate: new Date(),
      active: true
    };

    dbFunctions
      .dbInsertData(collection, insertObject)
      .then(() => {
        resolve(token);
      })
      .catch(error => {
        reject({
          id: 9001,
          desc: "Error with database connection.",
          error: error
        });
      });
    console.log("TEst");
  });
};

/**
 * Checks userid and token from an email to verify if verification token is valid
 *
 * @param {String} userid MongoDB user id
 * @param {String} token  SHA256 token
 *
 * @returns {Boolean}     Returns if token was valid
 */

var checkVerificationToken = function(userid, token) {
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
 * Will set an user account to verified and is active
 *
 * @param {String} userid User ID base of MongoDB _ID
 *
 * @returns {Boolean}     Returns if account is activated properly
 */

var activateUserAccount = function(userid) {
  return new Promise(function(resolve, reject) {
    var accountActivated = false;
    var errors = [];

    //Try to kill session

    if (errors.length === 0) {
      resolve(accountActivated);
    } else {
      reject(errors);
    }
  });
};

var userFunctions = {
  checkUserExists,
  checkEmailExists,
  checkUserIsUnique,

  getUserObject,

  createNewUser,
  createVerificationToken,
  checkVerificationToken,
  activateUserAccount
};

module.exports = userFunctions;
