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
const defaultValidators = require("./validators");
const defaultValidatorEntries = Object.entries(defaultValidators);
const defaultValidatorKeys = Object.keys(defaultValidators);


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
  this.defaultValidators = new Map(defaultValidatorEntries);
  this.validators = new Map();
  this.disabledValidators = [];

  if(is.object(rule)) {
    this.addRule({ ...rule, fieldId: element.id });
  }
}

/**
 * Add a new rule to a SmartField instance or update the existing rule for the instance.
 * @param {Object} rule: Object containing the requirements for the field's value to be valid.
 * @param {Boolean} [rule.required]: (for checkbox, dropdown, and text fields): determines if the field is required.
 * @param {Number|Object} [rule.length]: specify the accepted input length. 
 *    If the value is a number, it specifies the maximum length.
 *    If the value is an object, it specifies the minimum and/or maximum length.
 * @param {Number} [rule.length.min]: specifies the mininum accepted input length
 * @param {Number} [rule.length.max]: specifies the maximum accepted input length
 * @param {Boolean} [rule.allowWhitespace]: specifies if white-space characters are allowed.
 * @param {Boolean} [rule.matchCase]: performs a case-sensitive (true) or case-insensitive(false) validation.
 * @param {String} [rule.type]: the input field's expected data type (alnum|alpha|ascii|email|number|text).
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
 * @param {String} validatorKey (required): The identifier for the validator.
 * @param {Function} validatorFn (required): A function that validates the field.
 *    The function is passed the following arguments in order: 
 *       - `value`: the value entered by the user for this field
 *       - `rule`: the rule defined for this field instance
 *       - `prevResult`: a Boolean value indicating the result of previous validators.
 *       - `extras`: object containing any other field-specific information, 
 *             like the "checked" state for checkboxes, etc.
 *    The function should return Boolean true or false to indicate if the validation passed.
 * @param {Object} validatorMeta (optional): Object containing validator metadata (namespace, author, etc.)
 * @param {String} [validatorMeta.namespace]: namespace of the validator. 
 *    This is appended to the key to prevent naming conflicts.
 * @returns this.
 */
SmartField.prototype.addValidator = function addValidator(validatorKey, validatorFn, validatorMeta) {
  if(typeof validatorKey !== "string") {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "validatorKey")
        .replace(":type:", "a string")
    );
  }

  let validatorNamespace = "";

  validatorKey = validatorKey.trim();

  if(!validatorKey) {
    throw new TypeError(errorMessages.functionParamIsRequired.replace(":param:", "validatorKey"));
  }

  if(is.object(validatorMeta) && is.string(validatorMeta.namespace)) {
    validatorNamespace = validatorMeta.namespace.trim();
  }

  validatorKey = generateValidatorKey(validatorKey, validatorNamespace);

  if(defaultValidatorKeys.includes(validatorKey)) {
    throw new TypeError(
      errorMessages.argNamesNotAllowed
        .replace(":argNames:", "keys")
        .replace(":argTypes:", "validator keys")
        .replace(":argValues:", defaultValidatorKeys.join("\n"))
    );
  }

  if(this.hasValidator(validatorKey)) {
    throw new TypeError(
      errorMessages.objectWithKeyExists
        .replace(":object:", "A validator")
        .replace(":key:", validatorKey)
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

/**
 * Disable a validator (including the default validators). 
 * Disabled validators will not be invoked during the validation process.
 * 
 * @param {String} validatorKey (required): The identifier for the validator.
 * @param {Object} validatorMeta (optional): Object containing validator metadata (namespace, author, etc.)
 * @param {String} [validatorMeta.namespace]: namespace of the validator. 
 *    This is appended to the key to prevent naming conflicts.
 * @returns void
 */
SmartField.prototype.disableValidator = function disableValidator(validatorKey, validatorMeta) {
  if(typeof validatorKey === "string") {
    validatorKey = validatorKey.trim();
  }

  let validatorNamespace = "";

  if(is.object(validatorMeta) && is.string(validatorMeta.namespace)) {
    validatorNamespace = validatorMeta.namespace.trim();
  }

  validatorKey = generateValidatorKey(validatorKey, validatorNamespace);

  if(!this.hasValidator(validatorKey) && !defaultValidatorKeys.includes(validatorKey)) {
    throw new TypeError(
      errorMessages.noObjectWithSpecifiedKey
        .replace(":object:", "validator")
        .replace(":key:", validatorKey)
    );
  }

  if(this.disabledValidators.includes(validatorKey)) {
    return true;
  }

  this.disabledValidators.push(validatorKey);

  return true;
};

/**
 * Disable a validator (including the default validators). 
 * Disabled validators will not be invoked during the validation process.
 * 
 * @param {String} validatorKey (required): The identifier for the validator.
 * @param {Object} validatorMeta (optional): Object containing validator metadata (namespace, author, etc.)
 * @param {String} [validatorMeta.namespace]: namespace of the validator. 
 *    This is appended to the key to prevent naming conflicts.
 * @returns void
 */
SmartField.prototype.enableValidator = function enableValidator(validatorKey, validatorMeta) {
  if(typeof validatorKey === "string") {
    validatorKey = validatorKey.trim();
  }

  let validatorNamespace = "";

  if(is.object(validatorMeta) && is.string(validatorMeta.namespace)) {
    validatorNamespace = validatorMeta.namespace.trim();
  }

  validatorKey = generateValidatorKey(validatorKey, validatorNamespace);

  if(!this.hasValidator(validatorKey) && !defaultValidatorKeys.includes(validatorKey)) {
    throw new TypeError(
      errorMessages.noObjectWithSpecifiedKey
        .replace(":object:", "validator")
        .replace(":key:", validatorKey)
    );
  }
  
  this.disabledValidators = this.disabledValidators.filter(key => key !== validatorKey);

  return true;
};

/**
 * @param {String} type (optional): "addon"|"default".
 * @returns {Object} with members: `default` and/or `addon`.
 */
SmartField.prototype.getValidators = function(type) {
  type = type.toLowerCase().trim();

  const validators = {
    default: defaultValidatorKeys,
    addon: this.validators.keys(),
  };

  if(["addon", "default"].includes(type)) {
    return validators[type];
  } else {
    return validators;
  }
};

SmartField.prototype.hasValidator = function hasValidator(validatorKey) {
  if(typeof validatorKey === "string") {
    validatorKey = validatorKey.trim().toLowerCase();
  }

  return (
    typeof validatorKey === "string"
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
 * Get the original input field passed to the constructor
 * @returns 
 */
SmartField.prototype.getElement = function getElement() { 
  return this.element;
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
  const disabledValidators = this.disabledValidators;
  const defaultValidators = getActiveValidators(this.defaultValidators, disabledValidators);
  const addonValidators = getActiveValidators(this.validators, disabledValidators);
  const validators = Array.from(defaultValidators.values()).concat(Array.from(addonValidators.values()));

  if(validators.length === 0) {
    throw new TypeError(errorMessages.noValidatorsActive);
  }

  let rule = this.getRule();
  const input = this.getElement();
  const value = this.getValue();
  const extras = {};

  if(rule.required && input.type === "checkbox") {
    extras.checked = input.checked;
  }

  const validationPassed = validators.reduce((passed, fn) => passed && fn(value, rule, passed, extras), true);

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

function generateValidatorKey(key, namespace) {
  if(key.length > 0 && namespace.length > 0) {
    return `${namespace}.${key}`.toLowerCase();
  } else if(key.length > 0) {
    return key.toLowerCase();
  } else {
    return "";
  }
}

/**
 * 
 * @param {Object<Map>} validators 
 * @param {Array<String>} disabledValidators 
 * @returns {Object<Map>}
 */
function getActiveValidators(validators, disabledValidators) {
  const activeValidators = new Map();  

  for(const [key, value] of validators.entries()) {
    if(!(disabledValidators.includes(key))) {
      activeValidators.set(key, value);
    }
  }

  return activeValidators;
}

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

function restoreField(input) {
  input.classList.remove(INVALID_FIELD_CLASSNAME);
  input.classList.remove(VALID_FIELD_CLASSNAME);
  input.classList.remove(APP_CLASSNAME);
}