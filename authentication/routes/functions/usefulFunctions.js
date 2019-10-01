/**
 * This function is used for creating random Tokens
 *
 * @param {Number} len Length of token that should be returned
 */

var generateToken = function(len) {
  var length = len,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

var usefulFunctions = {
  generateToken
};

module.exports = usefulFunctions;
