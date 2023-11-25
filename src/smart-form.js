"use strict";

const errorMessages = require("./error-messages");
const { is, validateId } = require("./helpers");


module.exports = SmartForm;


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
 * @returns this.
 * 
 * Before any of the form's fields can have any validation performed on them, 
 * a rule must be added to it
 * either during initialization or by calling the addRule(rule) method on the SmartForm instance.
 */
function SmartForm(form, rules) {
  if(!is.object(form)) {
    throw new TypeError(
      errorMessages
        .htmlElementExpected
        .replace(":param:", "form")
        .replace(":elementType:", "form")
    );
  }

  this.form = form;
  this.fields = [];
  const elements = form.elements;

  if(elements) {
    Array.from(elements).forEach(input => {
      if(validateId(input.id)) {
        this.addField(input);
      }
    });
  }
  
  if(is.array(rules)) {
    // Grab a hold of only the input fields passed to our smart-form-validator processor; 
    // Ignore other fields and let the user handle those themselves.
    rules.forEach(rule => {
      const input = form.querySelector(`#${rule.fieldId}`);

      /*if(input) {
        this.addField(input, rule);
      }*/

      if(input && this.getField(input.id)) {
        this.addRule(rule);
      }
    });
  }
}

SmartForm.prototype.addField = require("./methods/addField");
SmartForm.prototype.addFields = function addFields(fields) {
  const formInputIds = Array.from(this.form.elements).map(el => el.id);
  const formInputFields = fields.filter(field => formInputIds.includes(field.id));

  return require("./methods/addFields").call(this, formInputFields);
};

SmartForm.prototype.addRule = require("./methods/addRule");
SmartForm.prototype.removeRule = require("./methods/removeRule");
SmartForm.prototype.getField = require("./methods/getField");
SmartForm.prototype.getFields = require("./methods/getFields");
SmartForm.prototype.restore = require("./methods/restore");
SmartForm.prototype.toJSON = require("./methods/toJSON");
SmartForm.prototype.validate = require("./methods/validate");
SmartForm.prototype.watch = require("./methods/watch");
