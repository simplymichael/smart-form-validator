/**
 * Validate that a value is not empty, that is, not undefined. 
 * @param {String} value (required): The value to validate
 * @param {Object} rule (required): Object containing the requirements for the value to be valid.
 * @param {Boolean} [rule.required]: Dictates whether or not the value is required.
 * @param {Boolean} prevResult (optional);
 * @param {Object} extras
 * @param {Boolean} [extras.checked] (optional): if the value is of a checkbox, .
 * @returns {Boolean}
 */
module.exports = function requiredFieldValidator(value, rule, _, extras) {
  if(!rule.required) {
    return true; // bypass this validation if no rule has been specified for it.
  }

  if(value === "" || typeof value === "undefined") {
    return false;
  }
  
  let passed;
  
  switch(rule.type) {
  case "checkbox" : passed = extras.checked && value === "on"; break;
  default         : passed = value.length > 0; break;
  }
  
  return passed;
};