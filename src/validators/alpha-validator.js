const { createAlphanumericRegexObject } = require("./validator-helpers");

/**
 * Validate that a string contains only the characters A - Z, _ (underscore), or - (hyphen). 
 * @param {String} value (required): The string to validate
 * @param {Object} rule (required): Object containing the length and cases requirement.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
 * @returns {Boolean}
 */
module.exports = function alphaValidator(value, rule) {
  if(!value) {
    return false;
  }
  
  const regexStr = rule.allowWhitespace ? "[A-Z\\s_-]" : "[A-Z_-]";
  const regex = createAlphanumericRegexObject(regexStr, rule);
  
  return regex.test(value);
};