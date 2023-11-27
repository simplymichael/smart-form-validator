const { is } = require("../helpers");


/**
 * Validate a value according to provided custom regular expression.
 * @param {Mixed} value (required): The value to validate
 * @param {Object} rule (required): 
 * @param {Object|String} [rule.regex]: A regex string or a regex object.
 * @returns {Boolean}
 */
module.exports = function regexValidator(value, rule) {
  const { regex: regexStr } = rule;
  const regex = is.object(regexStr) ? regexStr : new RegExp(regexStr);
  
  return regex.test(value);
};