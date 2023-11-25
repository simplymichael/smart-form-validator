const { is } = require("../helpers");

/**
 * Add an array of new fields for validation.
 * @param {Array} fields: the fields to validate. 
 * @param {Object} [fields[i].field]: An object holding the input field to validate, must have an `id` property.
 * @param {String} [fields[i].field.id]: The id of the input field
 * @param {Object} [fields[i].rule]: (optional): object containing validation rules for this field.
 * @param {Boolean} [fields[i].rule.required]: specifies whether the field is required (true) or not (false)
 * @param {Number|Object} [fields[i].rule.length]: specifies the accepted input length. 
 *   If the value is a number, it specifies the maximum length. 
 *   If the value is an object, it specifies the minimum and/or maximum length.
 * @param {Number} [fields[i].rule.length.min]: specifies the mininum accepted input length
 * @param {Number} [fields[i].rule.length.max]: specifies the maximum accepted input length
 * @param {Booleean} [fields[i].rule.allowWhitespace]
 * @param {Boolean} [fields[i].rule.matchCase]: performs case-sensitive (true) or case-insensitive (false) validation.
 * @param {String} [fields[i].rule.type]: the field's expected data type (alnum|alpha|email|number|text).
 *    Default is alnum.
 * @param {String} [fields[i].rule.regex]: specifies a custom validation regex
 * @returns this
 * 
 * Only fields that have rules added to them will be considered for validation.
 */
module.exports = function addFields(fields) {
  if(is.array(fields) && fields.length > 0) {
    fields.forEach(field => this.addField(field.field, field.rule));
  }

  return this;
};