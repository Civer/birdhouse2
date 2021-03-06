const returnErrorMessage = function(errorObject) {
  console.error(errorObject);
  return getUserError(errorObject.id);
};

const getUserError = function(errorId) {
  cleanUserError = {};

  cleanUserError.validCall = false;
  cleanUserError.errorId = errorId;

  switch (errorId) {
    /**
     * 2000er Code Range
     * Username and Password related errors
     */

    case 2020:
      cleanUserError.message = "Username or password is invalid or not known";
      break;
    case 2021:
      cleanUserError.message = "User is not verified";
      break;
    case 2022:
      cleanUserError.message = "Username or password is invalid or not known";
      break;
    case 2031:
      cleanUserError.message = "Username not handed over";
      break;
    case 2032:
      cleanUserError.message = "Password not handed over";
      break;
    case 2033:
      cleanUserError.message = "Email not handed over";
      break;
    case 2051:
      cleanUserError.message = "Username already taken";
      break;
    case 2052:
      cleanUserError.message = "Email already taken";
      break;
    case 2053:
      cleanUserError.message = "An unexpected backend error occured";
      break;
    /**
     * 4000er Code Range
     * Refresh Token
     */

    case 4001:
      cleanUserError.message = "Refresh Token not valid";
      break;
    /**
     * 9000er Code Range
     * Backend and Database
     */

    case 9001:
      cleanUserError.message = "An unexpected backend error occured";
      break;
    case 9002:
      cleanUserError.message = "An unexpected backend error occured";
      break;
    case 9003:
      cleanUserError.message = "An unexpected backend error occured";
      break;
    case 9004:
      cleanUserError.message = "An unexpected backend error occured";
      break;
    default:
    case 9999:
      cleanUserError.message = "An unexpected backend error occured";
  }

  return cleanUserError;
};

const errorFunctions = {
  returnErrorMessage
};

module.exports = errorFunctions;
