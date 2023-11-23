"use strict";

const errorMessages = require("./error-messages");
const { 
  APP_CLASSNAME, 
  VALID_FIELD_CLASSNAME, 
  INVALID_FIELD_CLASSNAME, 
  is,
  object,
  normalizeId,
  validateId,
} = require("./helpers");
const {
  regexValidator,
  emailValidator,
  alphaValidator,
  numberValidator,
  alphanumericValidator,
  asciiTextValidator,
  requiredFieldValidator,
} = require("./validators");


module.exports = SmartField;


/**
 * Create a new SmartField object.
 * @param {Object} element: the element to create a SmartField instance from;
 * @param {String} [element.id] (required): the id of the element 
 * @param {Function} [element.getValue] (optional): A function to get the element value.
 *    The function should return the element's value when called.
 *    If the element is an HTML element such as `input`, `select`, `checkbox`, or a contenteditable field, 
 *    this property is optional, and the element's value can be retrieved automatically. 
 *    For other types of elements, this value is required for getting the element's value during validation.
 * @param {Object} rule (optional): object specifying the validation rules to apply to this instance.
 * @param {Boolean} [rule.required]: specifies whether the field is required (true) or not (false)
 * @param {Number|Object} [rule.length]: specifies the accepted input length. 
 *    If the value is a number, it specifies the maximum length.
 *    If the value is an object, it specifies. the minimum and/or maximum length.
 * @param {Number} [rule.length.min]: specifies the mininum accepted input length
 * @param {Number} [rule.length.max]: specifies the maximum accepted input length
 * @param {Boolean} [rule.matchCase]: performs a case-sensitive (true) or case-insensitive (false) validation.
 * @param {String} [rule.type]: the acceptable data type of the value  for this field (alnum|alpha|email|number|text).
 *    Default is alnum.
 * @param {String} [rule.regex]: specifies a custom validation regex.
 * 
 * @returns this
 * 
 * Before the field can have any validation performed on it, a rule must be added to it
 * either durinc initialization or by calling the addRule(rule) method on the instance.
 */
function SmartField(element, rule) {
  if(!is.object(element)) {
    throw new TypeError(errorMessages.objectExpected.replace(":param:", "element"));
  }

  if(!validateId(element.id)) {
    throw new TypeError(
      errorMessages
        .objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "element")
        .replace(":type:", "a string or a number")
    );
  }
  
  element.id = normalizeId(element.id);

  if(element.id.length === 0) {
    throw new TypeError(
      errorMessages
        .objectPropertyCannotBeEmpty
        .replace(":prop:", "id")
        .replace(":object:", "element")
    );
  }

  if(typeof element.getValue !== "undefined" && typeof element.getValue !== "function") {
    throw new TypeError(
      errorMessages
        .objectPropertyShouldHaveType
        .replace(":prop:", "getValue")
        .replace(":object:", "element")
        .replace(":type:", "a function")
    );
  }

  this.id = element.id;
  this.element = element;
  this.validators = new Map();

  if(is.object(rule)) {
    this.addRule({ ...rule, fieldId: element.id });
  }
}

/**
 * Add a new rule to a SmartField instance or update the existing rule for the instance.
 * @param {Object} rule: object
 * @param {Boolean} [rule.required]
 * @param {Number|Object} [rule.length]: specify the accepted input length. 
 *    If the value is a number, it specifies the maximum length.
 *    If the value is an object, it specifies the minimum and/or maximum length.
 * @param {Number} [rule.length.min]: specifies the mininum accepted input length
 * @param {Number} [rule.length.max]: specifies the maximum accepted input length
 * @param {Boolean} [rule.allowWhitespace]: specifies if white-space characters are allowed.
 * @param {Boolean} [rule.matchCase]: performs a case-sensitive (true) or case-insensitive(false) validation.
 * @param {String} [rule.type]: the input field's expected data type (alnum|alpha|email|number|text).
 *    Default is alnum.
 * @param {String} [rule.regex]: specifies a custom validation regex
 * @param {Boolean} replace (optional): replace the existing rule completely with the new rule.
 *    This will not only overwrite a specific key, but replace the entire previous `rule` object.
 * 
 * @returns this
 * 
 */
SmartField.prototype.addRule = function addRule(rule) {
  const existingRule = this.rule;
  
  if(is.object(existingRule) && is.object(rule)) {
    this.rule = object.cloneAndExtend(existingRule, rule); //Object.assign({}, existingRule, rule);
  } else {
    this.rule = rule;
  }
  
  return this;
};

/**
 * Delete the rule for this instance.
 * @param {String} key (optional): If specified, delete only the specified rule.
 * Otherwise, delete the entire rule object for this instance.
 * 
 * @returns this
 */
SmartField.prototype.removeRule = function removeRule(key) {
  const existingRule = this.rule;

  if(!is.object(existingRule)) {
    return this;
  }
  
  if(key) {
    delete this.rule[key];
  } else {
    delete this.rule;
  }

  return this;
};

/**
 * Get the rule object associated with this field
 * @param {String} key (optional): get specific rule by key.
 * @return {Boolean|Object|String|Undefined}
 */
SmartField.prototype.getRule = function getRule(key) {
  if(key && this.rule) {
    return typeof this.rule[key] !== "undefined" ? this.rule[key] : null;
  } else {
    return this.rule || null;
  }
};

/**
 * Add a validator to the list of validators for this field.
 * 
 * @param {String} validatorKey 
 * @param {Function} validatorFn: A function that validates the field.
 *    The function is passed the following arguments in order: 
 *       - `value`: the value entered by the user for this field
 *       - `rule`: the rule defined for this field instance
 *       - `prevResult`: a Boolean value indicating the result of previous validators.
 *       - `extras`: object containing any other field-specific information, 
 *             like the "checked" state for checkboxes, etc.
 *    The function should return Boolean true or false to indicate if the validation passed.
 * @returns this.
 */
SmartField.prototype.addValidator = function addValidator(validatorKey, validatorFn) {
  if(typeof validatorKey !== "string") {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorKey")
        .replace(":type:", "a string")
    );
  }

  validatorKey = validatorKey.trim();

  if(!validatorKey) {
    throw new TypeError(errorMessages.functionParamIsRequired.replace(":param:", "validatorKey"));
  }

  if(this.hasValidator(validatorKey)) {
    throw new TypeError(
      errorMessages
        .objectWithKeyExistsCanReplace
        .replace(":object:", "A validator")
        .replace(":key:", validatorKey)
        .replace(":replacer:", "replaceValidator(validatorKey, validatorFn)")
    );
  }

  if(typeof validatorFn !== "function") {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorFn")
        .replace(":type:", "a function")
    );
  }

  this.validators.set(validatorKey, validatorFn);

  return this;
};

SmartField.prototype.hasValidator = function hasValidator(validatorKey) {
  if(typeof validatorKey === "string") {
    validatorKey = validatorKey.trim();
  }

  return (
    typeof validatorKey !== "undefined"
      ? this.validators.has(validatorKey) 
      : this.validators.size > 0
  );
};

SmartField.prototype.removeAllValidators = function removeAllValidators() {
  this.validators.clear();

  return this;
};

/**
 * Remove a validator from the list of validators for this field.
 * @param {String} validatorKey 
 * @returns this.
 */
SmartField.prototype.removeValidator = function removeValidator(validatorKey) {
  if(this.hasValidator(validatorKey)) {
    this.validators.delete(validatorKey);
  }

  return this;
};

/**
 * Replace a validator for this field. If the validator does not exist, add it.
 * 
 * @param {String} validatorKey 
 * @param {Function} validatorFn: A function that validates the field.
 *    The function is passed the following arguments in order: 
 *       - `value`: the value entered by the user for this field
 *       - `rule`: the rule defined for this field instance
 *       - `prevResult`: a Boolean value indicating the result of previous validators.
 *       - `extras`: object containing any other field-specific information, 
 *             like the "checked" state for checkboxes, etc.
 *    The function should return Boolean true or false to indicate if the validation passed.
 * @returns this.
 */
SmartField.prototype.replaceValidator = function replaceValidator(validatorKey, validatorFn) {
  if(typeof validatorKey !== "string") {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorKey")
        .replace(":type:", "a string")
    );
  }

  validatorKey = validatorKey.trim();

  if(!validatorKey) {
    throw new TypeError(errorMessages.functionParamIsRequired.replace(":param:", "validatorKey"));
  }

  if(typeof validatorFn !== "function") {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorFn")
        .replace(":type:", "a function")
    );
  }

  this.validators.set(validatorKey, validatorFn);

  return this;
};

/**
 * Get the original input field passed to the constructor
 * @returns 
 */
SmartField.prototype.getElement = function getElement() { 
  return this.element;
};

/**
 * Get the acceptable input data type for this field
 * @returns {String}
 */
SmartField.prototype.getType = function getType() {
  let expectedValueType;
  let input = this.getElement();
  let valueType = this.getRule("valueType")?.trim();

  if(valueType?.length > 0) {
    expectedValueType = valueType;
  } else if(input.type?.toLowerCase() === "checkbox") {
    expectedValueType = "checkbox";
  } else if(input.tagName.toLowerCase() === "select") {
    expectedValueType = "select";
  } else if(input.type === "email") {
    expectedValueType = "email";
  } else if(typeof input.value !== "undefined") {
    expectedValueType = "text";
  } else if(input.isContentEditable && typeof input.textContent !== "undefined") {
    expectedValueType = "text";
  }

  return expectedValueType.toLowerCase();
};

/**
 * Get the value entered by the user for this field
 * @returns {String|Mixed}
 */
SmartField.prototype.getValue = function getValue() {
  let value;
  let input = this.getElement();

  if(typeof input.getValue === "function") {
    value = input.getValue();
  } else if(input.type?.toLowerCase() === "checkbox") {
    value = input.value;
  } else if(input.tagName?.toLowerCase() === "select") {
    value = getHtmlSelectElementSelectedOption(input)?.value?.trim();
  } else if(typeof input.value !== "undefined") {
    value = input.value?.trim();
  } else if(input.isContentEditable && typeof input.textContent !== "undefined") {
    value = input.textContent;
  }

  return value;
};

SmartField.prototype.restore = function() {
  restoreField(this.getElement());
};

/**
 * @returns {Boolean}
 */
SmartField.prototype.validate = function validate() {
  registerValidatorsBeforeValidation(this);

  if(!this.hasValidator()) {
    throw new TypeError(
      "There are no validators registered for this field. " +
      "Please add a rule using the `addRule(rule)` method " +
      "or a validator using the `addValidator(key, validator)` method"
    );
  }

  let rule = this.getRule();
  const value = this.getValue();
  const fieldType = this.getType();
  const extras = {};

  if(rule.required) {
    rule = object.cloneAndExtend(rule, { fieldType });

    if(fieldType === "checkbox") {
      const input = this.getElement();
      extras.checked = input.checked;
    }
  }

  const validatorFns = Array.from(this.validators.values());
  const validationPassed = validatorFns.reduce((passed, fn) => passed && fn(value, rule, passed, extras), true);

  handleValidationResult(this, validationPassed);

  return validationPassed;
};

/**
 * Start Listening for "input" events and perform validation
 * @param {Function} callback: A function to invoke on validation complete.
 *   The function will be passed the input field and the result (Boolean) of the validation.
 */
SmartField.prototype.watch = function watch(callback) {
  this.element.addEventListener("input", () => this.validate(_, callback)); // eslint-disable-line
};


// Helpers

function getHtmlSelectElementSelectedOption(selectElement) {
  return {
    value : selectElement.value,
    text  : selectElement.options[selectElement.selectedIndex].text,
  };
}

function handleValidationResult(field, passed) {
  const input = field.getElement();
  input.classList.add(APP_CLASSNAME);

  if(passed) {
    markAsValid(input);
  } else {
    markAsInvalid(input);
  }
}

function markAsValid(field) {
  field.classList.remove(INVALID_FIELD_CLASSNAME);
  field.classList.add(VALID_FIELD_CLASSNAME);
}

function markAsInvalid(field) {
  field.classList.remove(VALID_FIELD_CLASSNAME);
  field.classList.add(INVALID_FIELD_CLASSNAME);
}

function registerValidatorsBeforeValidation(_this) {
  let rule = _this.getRule();
  const existingValidators = object.clone(_this.validators);

  _this.removeAllValidators(); // Ensure the in-built validators come first.

  if(rule.regex) {
    this.replaceValidator("regex", regexValidator);
  } else {
    const type = _this.getType();

    if(rule.required) {
      _this.replaceValidator("required", requiredFieldValidator);
    }

    switch(type) {
    case "email"   : _this.replaceValidator(type, emailValidator); break;
    case "alpha"   : _this.replaceValidator(type, alphaValidator); break;
    case "number"  : _this.replaceValidator(type, numberValidator); break;
    case "alnum"   : _this.replaceValidator(type, alphanumericValidator); break;
    case "text"    : _this.replaceValidator(type, asciiTextValidator); break;  
    }
  }

  // Re-register any user-registered custom validators.
  if(existingValidators.size > 0) {
    for(const [key, value] of existingValidators.entries()) {
      _this.addValidator(key, value);
    }
  }
}

function restoreField(input) {
  input.classList.remove(INVALID_FIELD_CLASSNAME);
  input.classList.remove(VALID_FIELD_CLASSNAME);
  input.classList.remove(APP_CLASSNAME);
}