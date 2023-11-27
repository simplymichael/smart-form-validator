const { is } = require("../helpers");
const { createAlphanumericRegexObject } = require("./validator-helpers");

/**
 * Validate that a string conforms to the passed length requirements.
 * @param {String} value (required): The value to validate
 * @param {Object} rule (required): Object containing the requirements for the value to be valid.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @returns {Boolean}
 */
module.exports = function lengthValidator(value, rule) {
  if(!(is.number(rule.length)) && !(is.object(rule.length))) {
    return true; // If the length rule has not been defined for the value, bypass this validator
  }

  if(typeof value === "undefined" || value === null || value === false) {
    return false;
  }
  
  const regexStr = "[A-Z0-9.\\s_-]";
  const regex = createAlphanumericRegexObject(regexStr, rule, "*");
  
  return regex.test(value);
};