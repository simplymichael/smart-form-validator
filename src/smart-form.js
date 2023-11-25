"use strict";

const errorMessages = require("./error-messages");
const { form, is, object, validateId } = require("./helpers");
const SmartField = require("./smart-field");


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
SmartForm.prototype.addField = function addField(input, rule) {
  if(!is.object(input)) {
    throw new TypeError(errorMessages.objectExpected.replace(":param:", "input"));
  }

  if(!validateId(input.id)) {
    throw new TypeError(
      errorMessages
        .objectMustHaveProperty
        .replace(":param:", "input")
        .replace(":prop:", "id")
    );
  }

  const field = this.getField(input.id);

  if(field) {
    rule.fieldId = input.id;

    if(is.object(rule)) {
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
SmartForm.prototype.addFields = function addFields(fields) {
  const formInputIds = Array.from(this.form.elements).map(el => el.id);
  const formInputFields = fields.filter(field => formInputIds.includes(field.id));

  if(is.array(formInputFields) && formInputFields.length > 0) {
    formInputFields.forEach(field => this.addField(field.field, field.rule));
  }

  return this;
};

/**
 * Add a validation rule to a previuosly created field.
 * @param {Object} rule: object
 * @param {String} [rule.field]: the field to apply the rule to. This can be the element itself or its id.
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
SmartForm.prototype.addRule = function addRule(rule) {
  if(!is.object(rule)) {
    throw new TypeError(errorMessages.objectExpected.replace(":param:", "rule"));
  }

  if(!object.has(rule, "field")) {
    throw new TypeError(
      errorMessages
        .objectMustHaveProperty
        .replace(":param:", "rule")
        .replace(":prop:", "field")
    );
  }

  const fieldId = is.object(rule.field) ? rule.field.id : rule.field;
  const field = this.getField(fieldId);

  if(!field) {
    throw new TypeError(
      errorMessages.fieldNotRegistered
        .replace(":element:", "form")
        .replace(":id:", fieldId)
    );
  }

  field.addRule(rule);

  return this;
};

/**
 * 
 * @param {Number|String} element: the field whose rule we want to delete. This can be the element itself or its id.
 * @param {String} key (optional): the key of the rule we want to delete. 
 *    If not specified, the entire rule for the field is deleted.
 *    This means no more validation will take place for that field.
 * @returns this
 */
SmartForm.prototype.removeRule = function removeRule(element, key) {
  const fieldId = is.object(element) ? element.id : element;
  const field = this.getField(fieldId);

  if(field) {
    field.removeRule(key);
  }

  return this;
};

SmartForm.prototype.getField = function getField(fieldId) {
  return this.toJSON().find(field => field.id === fieldId) || null;
};

/**
 * Get all fields
 * @returns {Array}
 */
SmartForm.prototype.getFields = function getFields() {
  return this.fields;
};

/**
 * Reset the "error"|"ok" states for the form's input elements.
 */
SmartForm.prototype.restore = function restoreFormFields() {
  this.toJSON().forEach(field => field.restore());
};

/**
 * Support JSON.stringify
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */
SmartForm.prototype.toJSON = function toJSON() { 
  return this.fields;
};

/**
 * 
 * @param {Function} cb: A function to invoke on validation of each added field.
 *   The function will be passed the current field and the result (Boolean) of the validation for that field.
 * @returns {Boolean}: the overall result of the entire validation
 */
SmartForm.prototype.validate = function validate(cb) {
  const validated = this.toJSON().map(field => field.validate(cb));

  return validated.every(passed => Boolean(passed));
};

/**
 * Listen for input changes on a form's input members
 * and invoke the handleInputChange for each input element in the form
 * @param {Function} callback: A validation callback, 
 *   the function will be invoked for each input field validated and 
 *   will receive the input field element as the first argument,
 *   and a boolean indicating the validation result as the second argument.
 * @return {Object} with a valid() method. The method returns:
 *   true if all fields are valid according to supplied rules
 *   false otherwise.
 */
SmartForm.prototype.watch = function validateFormFields(callback) {
  let formValid = false;
  const validatedFields = {};
  const fields = this.getFields();
  const rules = fields.map(field => Boolean(field.getRule()));

  fields.forEach(field => {
    const input = field.getElement();
    let targetEvent;

    switch(input.type) {
    case "checkbox" : targetEvent = "click"; break;
    case "email"    :
    case "password" : 
    case "text"     : 
    default         : targetEvent = "input"; break;
    }

    input.addEventListener(targetEvent, () => {
      const valid = field.validate();
      validationCallback(field, valid);
      if(typeof callback === "function") {
        callback(field, valid);
      }
    });
  });

  return {
    valid: () => formValid,
  };

  function validationCallback(field, valid) {
    validatedFields[field.id] = validatedFields[field.id] || {};
    validatedFields[field.id].valid = valid;

    if(Object.keys(validatedFields).length === rules.length) {
      formValid = Object.values(validatedFields).every(field => field.valid);
    }

    form.canSubmit(formValid, field.getElement());
  }
};

