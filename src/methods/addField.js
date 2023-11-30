const errorMessages = require("../error-messages");
const { is, normalizeId, validateId } = require("../helpers");
const SmartField = require("../smart-field");

/**
 * Add a new field for validation
 * @param {Object} input: the field to validate. The field must have an `id` property.
 * @param {String} [input.id] (required): the id of the element 
 * @param {String} [input.role] (optional): the role of the element. 
 *    This can be particularly usefule for identifying submit buttons that are not defined 
 *    as `<input type="submit" />`. In such cases, if we want effects that work with submit buttons 
 *    to have access to the button, we have to give the element a role of "submit-button", e.g. 
 *    `<button role="submit-button">Submit</button>`.
 * @param {Object} rule (optional): object containing validation rules for this field.
 * @param {Boolean} [rule.required]: specifies whether the field is required (true) or not (false)
 * @param {Number|Object} [rule.length]: specifies the accepted input length. 
 *   If the value is a number, it specifies the maximum length. 
 *   If the value is an object, it specifies the minimum and/or maximum length.
 * @param {Number} [rule.length.min]: specifies the mininum accepted input length
 * @param {Number} [rule.length.max]: specifies the maximum accepted input length
 * @param {Boolean} [rule.matchCase]: performs case-sensitive (true) or case-insensitive (false) validation.
 * @param {String} [rule.type]: the field's expected data type (alnum|alpha|email|number|text).
 *    Default is alnum.
 * @param {String} [rule.regex]: specifies a custom validation regex
 * @returns this
 */
module.exports = function addField(input, rule) {
  if(!is.object(input)) {
    throw new TypeError(errorMessages.objectExpected.replace(":param:", "input"));
  }
  
  if(!validateId(input.id)) {
    throw new TypeError(
      errorMessages.objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "input")
        .replace(":type:", "a string or a number")
    );
  }
  
  const field = this.getField(normalizeId(input.id));
  
  if(field) {
    if(is.object(rule)) {
      rule.field = input.id;
  
      this.addRule(rule);
    }
  } else {
    this.fields.push(new SmartField(input, rule));
  }
    
  return this;
};