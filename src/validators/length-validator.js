const { createAlphanumericRegexObject } = require("./validator-helpers");

/**
 * Validate that a string conforms to the passed length requirements.
 * @param {String} value (required): The value to validate
 * @param {Object} rule (required): Object containing the length rule to apply.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @returns {Boolean}
 */
module.exports = function lengthValidator(value, rule) {
  if(typeof value === "undefined" || value === null || value === false) {
    return false;
  }
  
  const regexStr = "[A-Z0-9.\\s_-]";
  const regex = createAlphanumericRegexObject(regexStr, rule, "*");
  
  return regex.test(value);
};