const returnErrorMessage = function(errorObject) {
  console.error(errorObject);
  return getUserError(errorObject.id);
};

const getUserError = function(errorId) {
  cleanUserError = {};

  cleanUserError.validCall = false;
  cleanUserError.errorId = errorId;

  switch (errorId) {
    case 2020:
      cleanUserError.message = "Username or password is invalid or not known";
      break;
    case 2021:
      cleanUserError.message = "User is not verified";
      break;
    case 2022:
      cleanUserError.message = "Username or password is invalid or not known";
      break;
    case 3001:
      cleanUserError.message = "Problem with connection";
      break;
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
