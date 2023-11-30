const { createAlphanumericRegexObject } = require("./validator-helpers");

/**
 * Validate that a value contains only numbers. 
 * @param {Number|String} value (required): The string to validate
 * @param {Object} rule (required): Object containing the requirements for the value to be valid.
 * @param {String} [rule.type]: The expected type of the value.
 * @param {Boolean} [rule.allowWhitespace] (optional): specifies whether to allow whitespace or not.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @returns {Boolean}
 */
module.exports = function numberValidator(value, rule) {
  if(!rule.type || rule.type !== "number") {
    return true; // If the "number" rule has not been specified for this value, bypass this validator.
  }

  if(value === "" || value === null || typeof value === "undefined") {
    return false;
  }
  
  const regexStr = rule.allowWhitespace ? "[0-9\\s]" : "[0-9]";
  const regex = createAlphanumericRegexObject(regexStr, rule);
  
  return regex.test(value);
};