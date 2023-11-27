/**
 * Validate that a value is not empty, that is, not undefined. 
 * @param {String} value (required): The value to validate
 * @param {Object} rule (required): Object containing the requirements to pass the validation.
 * @param {String} [rule.fieldType] (required): The type of the field (checkbox, text, select|dropdown).
 * @param {Boolean} [rule.checked] (optional): if the field is a checkbox, .
 * @returns {Boolean}
 */
module.exports = function requiredFieldValidator(value, rule, _, extras) {
  if(value === "" || typeof value === "undefined") {
    return false;
  }
  
  let passed;
  
  switch(rule.fieldType) {
  case "checkbox" : passed = extras.checked && value === "on"; break;
  case "text"     :
  case "select"   : 
  case "dropdown" : passed = value.length > 0; break;
  }
  
  return passed;
};