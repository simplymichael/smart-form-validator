"use strict";

const errorMessages = require("./error-messages");
const { is, object, normalizeId, validateId } = require("./helpers");
const SmartField = require("./smart-field");
const SmartForm = require("./smart-form");


module.exports = SmartFormValidator;
exports.smartValidator = new SmartFormValidator();


function SmartFormValidator() { 
  this.fields = [];
  this.form = null;
}

/**
 * Add a new field for validation
 * @param {Object} input: the field to validate. The field must have an `id` property.
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
SmartFormValidator.prototype.addField = function addField(input, rule) {
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


  input.id = normalizeId(input.id);

  const field = this.getField(input.id);

  if(field) {
    if(is.object(rule)) {
      rule.fieldId = input.id;

      this.addRule(rule);
    }
  } else {
    this.fields.push(new SmartField(input, rule));
  }
  
  return this;
};

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
 * @param {Boolean} [fields[i].rule.matchCase]: performs case-sensitive (true) or case-insensitive (false) validation.
 * @param {String} [fields[i].rule.type]: the field's expected data type (alnum|alpha|email|number|text).
 *    Default is alnum.
 * @param {String} [fields[i].rule.regex]: specifies a custom validation regex
 * @returns this
 * 
 * Only fields that have rules added to them will be considered for validation.
 */
SmartFormValidator.prototype.addFields = function addFields(fields) {
  if(is.array(fields)) {
    fields.forEach(field => this.addField(field.field, field.rule));
  }
};

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

/**
 * Add a validation rule to a previuosly created field.
 * @param {Object} rule: object
 * @param {String} [rule.fieldId]: the id of the field to apply the rule to.
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
SmartFormValidator.prototype.addRule = function addRule(rule) {
  if(!is.object(rule)) {
    throw new TypeError(errorMessages.objectExpected.replace(":param:", "rule"));
  }

  if(!object.has(rule, "fieldId")) {
    throw new TypeError(
      errorMessages
        .objectMustHaveProperty
        .replace(":param:", "rule")
        .replace(":prop:", "fieldId")
    );
  }

  const field = this.getField(rule.fieldId);

  if(!field) {
    throw new TypeError(errorMessages.fieldNotRegistered.replace(":element:", "validator"));
  }

  field.addRule(rule);

  return this;
};

/**
 * 
 * @param {Number|String} fieldId: the id of the field whose rule we want to delete.
 * @param {String} key (optional): the key of the rule we want to delete. 
 *    If not specified, the entire rule for the field is deleted.
 *    This means no more validation will take place for that field.
 * @returns this
 */
SmartFormValidator.prototype.removeRule = function removeRule(fieldId, key) {
  const field = this.getField(fieldId);

  if(field) {
    field.removeRule(key);
  }

  return this;
};

SmartFormValidator.prototype.getField = function getField(fieldId) {
  return this.toJSON().find(field => field.id === normalizeId(fieldId)) || null;
};

/**
 * Get all fields
 * @returns {Array}
 */
SmartFormValidator.prototype.getFields = function getFields() {
  return this.fields;
};

/**
 * Support JSON.stringify
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */
SmartFormValidator.prototype.toJSON = function toJSON() {
  return this.fields;
};


/**
 * @returns {Boolean}: the overall result of the entire validation
 */
SmartFormValidator.prototype.validate = function validate() {
  const validated = this.toJSON().map(field => field.validate());

  return validated.every(passed => Boolean(passed));
};

/**
 * Listen for input changes on a registered input members
 * and invoke the validation method for each.
 * @param {Function} callback: A validation callback, 
 *   the function will be invoked for each input field validated and 
 *   will receive the input field element as the first argument,
 *   and a boolean indicating the validation result as the second argument.
 * @return {Object} with a valid() method. The method returns:
 *   true if all fields are valid according to supplied rules
 *   false otherwise.
 */
SmartFormValidator.prototype.watch = function validateFormFields(callback) {
  let allValid = false;
  const validatedFields = {};
  const fields = this.getFields();
  const rules = fields.map(field => Boolean(field.getRule()));

  fields.forEach(field => {
    const input = field.getElement();

    input.addEventListener("input", () => {
      const valid = field.validate();
      validationCallback(field, valid);
      if(typeof callback === "function") {
        callback(field, valid);
      }
    });
  });

  return {
    valid: () => allValid,
  };

  function validationCallback(field, valid) {
    validatedFields[field.id] = validatedFields[field.id] || {};
    validatedFields[field.id].valid = valid;

    if(Object.keys(validatedFields).length === rules.length) {
      allValid = Object.values(validatedFields).every(field => field.valid);
    }
  }
};
