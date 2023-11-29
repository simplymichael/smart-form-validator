"use strict";

const SmartForm = require("./smart-form");


module.exports = SmartFormValidator;


function SmartFormValidator() { 
  this.fields = [];
  this.form = null;
}

SmartFormValidator.prototype.addField = require("./methods/addField");
SmartFormValidator.prototype.addFields = require("./methods/addFields");

/**
 * Create a new SmartForm object.
 * @param {Object} the HTML form element to add validation routine to.
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
  return new SmartForm(form, rules);
};

SmartFormValidator.prototype.addRule = require("./methods/addRule");
SmartFormValidator.prototype.removeRule = require("./methods/removeRule");
SmartFormValidator.prototype.getField = require("./methods/getField");
SmartFormValidator.prototype.getFields = require("./methods/getFields");
SmartFormValidator.prototype.getEffects = require("./methods/getEffects");
SmartFormValidator.prototype.useEffect = require("./methods/useEffect");
SmartFormValidator.prototype.restore = require("./methods/restore");
SmartFormValidator.prototype.toJSON = require("./methods/toJSON");
SmartFormValidator.prototype.validate = require("./methods/validate");
SmartFormValidator.prototype.watch = require("./methods/watch");


