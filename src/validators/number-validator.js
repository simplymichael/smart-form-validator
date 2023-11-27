const { createAlphanumericRegexObject } = require("./validator-helpers");

/**
 * Validate that a value contains only numbers. 
 * @param {Number|String} value (required): The string to validate
 * @param {Object} rule (required): Object containing the length requirement.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @returns {Boolean}
 */
module.exports = function numberValidator(value, rule) {
  if(value === "" || value === null || typeof value === "undefined") {
    return false;
  }
  
  const regexStr = rule.allowWhitespace ? "[0-9\\s]" : "[0-9]";
  const regex = createAlphanumericRegexObject(regexStr, rule);
  
  return regex.test(value);
};