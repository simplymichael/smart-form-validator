const { createAlphanumericRegexObject } = require("./validator-helpers");

/**
* Validate that a string contains only alphanumeric characters, _ (underscore), or - (hyphen). 
* @param {String} value (required): The string to validate
* @param {Object} rule (required): Object containing the requirements for the value to be valid.
* @param {String} [rule.type]: the expected type of the value.
* @param {Boolean} [rule.allowWhitespace] (optional): specifies whether to allow whitespace or not.
* @param {Number|Object} [rule.length] (required): The length requirements.
* @param {Number} [rule.length.min] (optional): minimum length requirement.
* @param {Number} [rule.length.max] (optional): maximum length requirement.
* @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
* @returns {Boolean}
*/
module.exports = function alphanumericValidator(value, rule) {
  if(!rule.type || rule.type !== "alnum") {
    return true; // if the "alnum" rule has not been defined for this value, bypass this validator
  }

  if(!value) {
    return false;
  }

  const regexStr = rule.allowWhitespace ? "[A-Z0-9\\s_-]" : "[A-Z0-9_-]";
  const regex = createAlphanumericRegexObject(regexStr, rule);

  return regex.test(value);
};