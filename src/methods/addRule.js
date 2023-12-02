const errorMessages = require("../error-messages");
const { is, object } = require("../helpers");


/**
 * Add a validation rule to a previuosly created field.
 * @param {Object} rule: object
 * @param {Object|String} [rule.field]: the field to apply the rule to. This can be the element itself or its id.
 * @param {Boolean} [rule.required]: specifies whether the field is required (true) or not (false)
 * @param {Number|Object} [rule.length]: specifies the accepted input length. 
 *    If the value is a number, it specifies the maximum length.
 *    If the value is an object, it specifies the minimum and/or maximum accepted length.
 * @param {Number} [rule.length.min]: specify the mininum accepted input length
 * @param {Number} [rule.length.max]: specify the maximum accepted input length
 * @param {Boolean} [rule.allowWhitespace]: specifies if white-space characters are allowed.
 * @param {Boolean} [rule.matchCase]: performs a case-sensitive (true) or case-insensitive (false) validation
 * @param {String} [rule.type]: the input field's expected data type (alnum|alpha|email|number|text).
 *    Default is alnum.
 * @param {String} [rule.regex]: specifies a custom validation regex
 * @returns this
 */
module.exports = function addRule(rule) {
  if(!is.object(rule)) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "rule")
        .replace(":type:", "object")
    );
  }
  
  if(!object.has(rule, "field")) {
    throw new TypeError(
      errorMessages.objectMustHaveProperty
        .replace(":param:", "rule")
        .replace(":prop:", "field")
    );
  }
  
  const fieldId = is.object(rule.field) ? rule.field.id : rule.field;
  const field = this.getField(fieldId);
  
  if(!field) {
    throw new TypeError(
      errorMessages.fieldNotRegistered
        .replace(":element:", "validator")
        .replace(":id:", fieldId)
    );
  }
  
  field.addRule(rule);
  
  return this;
};
  