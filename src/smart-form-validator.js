"use strict";

const { addInstanceMethod, addStaticMethod } = require("./methods");
const SmartForm = require("./smart-form");

const staticMethods = ["getEffects", "useEffect"];
const instanceMethods = [
  "addField", "addFields", "addRule", "removeRule", "addValidator", "getValidators", 
  "getField", "getFields", "getEffects", "reset", "useEffect", "toJSON", "validate", "watch"
];


module.exports = SmartFormValidator;


function SmartFormValidator() { 
  this.fields = [];
  this.form = null;
}

/**
 * Create a new SmartForm object.
 * @param {Object|String} the HTML form element to add validation routine to.
 *    This can be the HTML form object if we already have it, or its ID.
 * @param {Array} rules (optional): array of objects specifying the validation rules for the form's elements.
 * @param {String} [rules[i].fieldId]: the id of the input field to apply these rules to
 * @param {Boolean} [rules[i].required]: specifies whether the field is required (true) or not (false)
 * @param {Number|Object} [rules[i].length]: specifies the accepted input length. 
 *    If the value is a number, it specifies the maximum length.
 *    If the value is an object, it specifies. the minimum and/or maximum length.
 * @param {Number} [rules[i].length.min]: specifies the mininum accepted input length
 * @param {Number} [rules[i].length.max]: specifies the maximum accepted input length
 * @param {Boolean} [rules[i].matchCase]: performs a case-sensitive (true) or case-insensitive (false) validation.
 * @param {String} [rules[i].type]: the input field's expected data type (alnum|alpha|email|number|text).
 *    Default is alnum.
 * @param {String} [rules[i].regex]: specifies a custom validation regex.
 * 
 * @returns {Object} SmartForm instance.
 * 
 * Before any of the form's fields can have any validation performed on them, 
 * a rule must be added to it
 * either here or by calling the addRule(rule) method on the returned SmartForm instance.
 */
SmartFormValidator.prototype.addForm = function addForm(form, rules) {
  const smartForm = new SmartForm(form, rules);

  this.form = smartForm.form;

  return smartForm;
};

staticMethods.forEach(function bindMethodToClass(method) {
  addStaticMethod(SmartFormValidator, method);
});

instanceMethods.forEach(function bindMethodToInstance(method) {
  addInstanceMethod(SmartFormValidator, method);
});
