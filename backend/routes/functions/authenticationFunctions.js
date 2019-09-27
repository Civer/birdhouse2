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
    var returnObject = {
      userExists: false,
      userid: ""
    };

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(returnObject);
    } else {
      reject(errors);
    }
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
    var returnObject = {
      userExists: false,
      userid: 0
    };

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(returnObject);
    } else {
      reject(errors);
    }
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
 * @returns {Object.isActive}            Boolean State if user is locked
 * @returns {Object.dateAccountCreated}  Date    Account Creation Date
 * @returns {Object.dateLastLogin}       Date    Last Login Date
 */

var getUserObject = function(userid) {
  return new Promise(function(resolve, reject) {
    var userObject = {
      id: "",
      email: "",
      firstname: "",
      lastname: "",
      country: "",
      isVerified: false,
      isActive: false,
      dateAccountCreated: new Date(),
      dateLastLogin: new Date()
    };

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(returnObject);
    } else {
      reject(errors);
    }
  });
};

/**
 *
 * @param {String} userid   MongoDB User ID
 *
 * @returns {String}        Salt stored in DB for given userid
 */

var getUserSalt = function(userid) {
  return new Promise(function(resolve, reject) {
    var salt = "";

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(salt);
    } else {
      reject(errors);
    }
  });
};

/**
 *
 * @param {String} userid   MongoDB User ID
 * @param {String} password SHA256 User password
 * @param {String} salt     SHA256 User salt from call "getUserSalt"
 *
 * @returns {Boolean}       Returns if password used is valid
 */

var checkPassword = function(userid, password, salt) {
  return new Promise(function(resolve, reject) {
    var passwordIsValid = false;

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(passwordIsValid);
    } else {
      reject(errors);
    }
  });
};

/**
 * This function returns an active session.
 * If no session is found the flag hasActiveSessions will be false
 *
 * @param {String} userid                           MongoDB User ID
 * @param {String} sessionid                        MongoDB Session ID
 *
 * @returns {Object.hasActiveSession}               Boolean   Indicate if user has active session
 * @returns {Object.sessionObject.id}               String    Returns ID of active session
 * @returns {Object.sessionObject.dateToTerminate}  Date      Date showing when session should be killed due to inactivity
 * @returns {Object.sessionObject.dateLastRenewal}  Date      Last reset of dateToTerminate counter
 */

var getSession = function(userid, sessionid) {
  return new Promise(function(resolve, reject) {
    var returnObject = {
      hasActiveSession: false,
      sessionObject: {}
    };

    var errors = [];

    //Check if user has session

    if (errors.length === 0) {
      resolve(returnObject);
    } else {
      reject(errors);
    }
  });
};

/**
 * This function is used for renewing an already existing session
 *
 * @param {String} sessionid  Session ID based on MongoDB Session table
 *
 * @returns {Boolean}         Returns if sessionRenewal was successful
 */

var renewSession = function(sessionid) {
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
    var sessionCreated = false;
    var errors = [];

    //Try to kill session

    if (errors.length === 0) {
      resolve(sessionCreated);
    } else {
      reject(errors);
    }
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
    var returnObject = {
      userCreated: false,
      id: "",
      email: ""
    };
    var errors = [];

    //Try to kill session

    if (errors.length === 0) {
      resolve(returnObject);
    } else {
      reject(errors);
    }
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
    var token = "";
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
 * This function triggers the sending of a verification token
 *
 * @param {String} email  Email of user
 * @param {String} userid MongoDB user id
 * @param {String} token  SHA256 token
 *
 * @returns {Boolean}     Returns if mail was send
 */

var sendVerificationToken = function(email, userid, token) {
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
  checkUserExists,
  checkEmailExists,

  getUserObject,

  checkPassword,

  getSession,
  renewSession,
  createNewSession,
  killSession,
  killAllSessions,

  createNewUser,
  createVerificationToken,
  sendVerificationToken,
  checkVerificationToken,
  activateUserAccount,

  sendPasswordResetToken,
  checkPasswordToken,
  resetPassword
};

module.exports = authFunctions;
