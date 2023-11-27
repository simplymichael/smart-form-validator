const { is } = require("../helpers");


/**
 * Validate a value according to provided custom regular expression.
 * @param {Mixed} value (required): The value to validate
 * @param {Object} rule (required): Object containing the requirements for the value to be valid.
 * @param {Object|String} [rule.regex]: A regex string or a regex object.
 * @returns {Boolean}
 */
module.exports = function regexValidator(value, rule) {
  if(!rule.regex) {
    return true; // if the regex rule has not been defined for this value, bypass this validator
  }

  const { regex: regexStr } = rule;
  const regex = is.object(regexStr) ? regexStr : new RegExp(regexStr);
  
  return regex.test(value);
};