const { createAlphanumericRegexObject } = require("./validator-helpers");

/**
 * Validate that a string contains only the characters A - Z, _ (underscore), or - (hyphen). 
 * @param {String} value (required): The string to validate
 * @param {Object} rule (required): Object containing the requirements for the value to be valid.
 * @param {String} [rule.type]: the expected type of the value.
 * @param {Boolean} [rule.allowWhitespace] (optional): specifies whether to allow whitespace or not.
 * @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
 * @returns {Boolean}
 */
module.exports = function alphaValidator(value, rule) {
  if(!rule.type || rule.type !== "alpha") {
    return true; // if the "alpha" rule has not been defined for this value, bypass this validator
  }

  if(!value || typeof value !== "string") {
    return false;
  }
  
  const regexStr = rule.allowWhitespace ? "[A-Z\\s_-]" : "[A-Z_-]";
  const regex = createAlphanumericRegexObject(regexStr, rule);
  
  return regex.test(value);
};