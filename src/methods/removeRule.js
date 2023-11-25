const { is } = require("../helpers");


/**
 * 
 * @param {Number|String} element: the field whose rule we want to delete. This can be the underlying element or its id.
 * @param {String} key (optional): the key of the rule we want to delete. 
 *    If not specified, the entire rule for the field is deleted.
 *    This means no more validation will take place for that field.
 * @returns this
 */
module.exports = function removeRule(element, key) {
  const fieldId = is.object(element) ? element.id : element;
  const field = this.getField(fieldId);
  
  if(field) {
    field.removeRule(key);
  }
  
  return this;
};