"use strict";

const effects = require("./effects");
const errorMessages = require("./error-messages");
const { 
  APP_CLASSNAME,  
  SMART_FIELD_CLASSNAME,
  is,
  object,
  normalizeId,
  validateId,
} = require("./helpers");
const defaultValidators = require("./validators");

const defaultEffects = Object.values(effects);
const defaultEffectNames = defaultEffects.map(effect => effect.name);
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
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "element")
        .replace(":type:", "object")
    );
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
  this.defaultEffects = new Map();
  this.defaultValidators = new Map(defaultValidatorEntries);
  this.effects = new Map();
  this.validators = new Map();
  this.disabledEffects = [];
  this.disabledValidators = [];

  for(const effect of defaultEffects) {
    const { name, meta, valid, invalid } = effect;

    this.defaultEffects.set(name, { meta, valid, invalid });
  }

  if(is.object(rule)) {
    this.addRule({ ...rule, fieldId: element.id });
  }

  claimField(element);
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
 * Disable an effect (including the default effects). 
 * Disabled effects will not be invoked during the validation process.
 * 
 * @param {String} effectName (required): The name of the effect.
 * @param {Object} effectMeta (optional): Object containing effect metadata (namespace, author, version, etc.)
 * @param {String} [effectMeta.namespace]: namespace of the effect. 
 *    This is appended to the effect name to prevent naming conflicts.
 * @returns {Boolean}
 */
SmartField.prototype.disableEffect = function disableEffect(effectName, effectMeta) {
  if(!(is.string(effectName))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effectName")
        .replace(":type:", "string")
    );
  }

  effectName = effectName.trim();

  let effectNamespace = "";

  if(is.object(effectMeta) && is.string(effectMeta.namespace)) {
    effectNamespace = effectMeta.namespace.trim();
  }

  effectName = generateEffectName(effectName, effectNamespace);

  if(effectName.length === 0) {
    throw new TypeError(
      errorMessages.fieldCannotBeEmpty
        .replace(":field:", "effectName")
        .replace(":type:", "string")
    );
  }

  if(!(this.isUsingEffect(effectName)) && !(defaultEffectNames.includes(effectName))) {
    throw new TypeError(
      errorMessages.noObjectWithSpecifiedKey
        .replace(":object:", "effect")
        .replace(":key:", effectName)
    );
  }

  if(this.disabledEffects.includes(effectName)) {
    return true;
  }

  this.disabledEffects.push(effectName);

  return true;
};

/**
 * Re-enable a disabled effect (including the default effects). 
 * 
 * @param {String} effectName (required): The name of the effect.
 * @param {Object} effectMeta (optional): Object containing effect metadata (namespace, author, version, etc.)
 * @param {String} [effectMeta.namespace]: namespace of the effect. 
 *    This is appended to the effect name to prevent naming conflicts.
 * @returns {Boolean}
 */
SmartField.prototype.enableEffect = function enableEffect(effectName, effectMeta) {
  if(!(is.string(effectName))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effectName")
        .replace(":type:", "string")
    );
  }

  effectName = effectName.trim();

  let effectNamespace = "";

  if(is.object(effectMeta) && is.string(effectMeta.namespace)) {
    effectNamespace = effectMeta.namespace.trim();
  }

  effectName = generateEffectName(effectName, effectNamespace);

  if(effectName.length === 0) {
    throw new TypeError(
      errorMessages.fieldCannotBeEmpty
        .replace(":field:", "effectName")
        .replace(":type:", "string")
    );
  }

  if(!(this.isUsingEffect(effectName)) && !(defaultEffectNames.includes(effectName))) {
    throw new TypeError(
      errorMessages.noObjectWithSpecifiedKey
        .replace(":object:", "effect")
        .replace(":key:", effectName)
    );
  }

  if(!(this.disabledEffects.includes(effectName))) {
    return true;
  }

  this.disabledEffects = this.disabledEffects.filter(name => name !== effectName);

  return true;
};

/**
 * @param {String} type (optional): "addon"|"default".
 * @returns {Object} with members: `default` and/or `addon`.
 */
SmartField.prototype.getEffects = function(type) {
  type = is.string(type) ? type.toLowerCase().trim() : "";

  const effects = {
    default: defaultEffectNames,
    addon: this.effects.keys(),
  };

  if(["addon", "default"].includes(type)) {
    return effects[type];
  } else {
    return effects;
  }
};

SmartField.prototype.isUsingEffect = function isUsingEffect(effectName) {
  if(is.string(effectName)) {
    effectName = effectName.trim().toLowerCase();
  }

  return (
    is.string(effectName)
      ? this.effects.has(effectName) 
      : this.effects.size > 0
  );
};

/**
 * 
 * @param {Object} effect: 
 * @param {String} [effect.name] (required): The name of this effect, used when registering the effect.
 * @param {Object} [effect.meta] (optional): Effect meta data, e.g., namespace, author, version, etc.
 * @param {Function} [effect.valid] (required): Function to invoke post-validation if the field is valid.
 *    The function receives the validated input field as its first argument.
 * @param {Function} [effect.invalid] (required): Function to invoke post-validation if the field is invalid.
 *    The function is passed the validated input field as its first argument
 * @returns this.
 */
SmartField.prototype.useEffect = function useEffect(effect) {
  if(!(is.object(effect))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "object")
    );
  }

  let { name, meta, valid, invalid } = effect;

  if(!(is.string(name))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "string")
    );
  }

  let namespace = "";
  name = name.trim();

  if(!(is.function(valid))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.valid")
        .replace(":type:", "function")
    );
  }

  if(!(is.function(invalid))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.invalid")
        .replace(":type:", "function")
    );
  }

  if(is.object(meta) && is.string(meta.namespace)) {
    namespace = meta.namespace.trim();
  }

  const effectName = generateEffectName(name, namespace);

  if(effectName.length === 0) {
    throw new TypeError(
      errorMessages.fieldCannotBeEmpty
        .replace(":field:", "effect.name")
        .replace(":type:", "string")
    );
  }

  if(defaultEffectNames.includes(effectName)) {
    throw new TypeError(
      errorMessages.argNamesAreReserved
        .replace(":argNames:", "names")
        .replace(":argTypes:", "effect names")
        .replace(":argValues:", defaultEffectNames.join("\n"))
    );
  }

  if(this.isUsingEffect(effectName)) {
    throw new TypeError(
      errorMessages.objectWithKeyExists
        .replace(":object:", "An effect")
        .replace(":key:", effectName)
    );
  }

  this.effects.set(effectName, { meta, valid, invalid });

  return this;
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
  if(!(is.string(validatorKey))) {
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
      errorMessages.argNamesAreReserved
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

  if(!(is.function(validatorFn))) {
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
 *    This is appended to the validator key to prevent naming conflicts.
 * @returns {Boolean}
 */
SmartField.prototype.disableValidator = function disableValidator(validatorKey, validatorMeta) {
  if(is.string(validatorKey)) {
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
 * Re-enable a disabled validator (including the default validators). 
 * Disabled validators will not be invoked during the validation process.
 * 
 * @param {String} validatorKey (required): The identifier for the validator.
 * @param {Object} validatorMeta (optional): Object containing validator metadata (namespace, author, etc.)
 * @param {String} [validatorMeta.namespace]: namespace of the validator. 
 *    This is appended to the validator key to prevent naming conflicts.
 * @returns {Boolean}
 */
SmartField.prototype.enableValidator = function enableValidator(validatorKey, validatorMeta) {
  if(is.string(validatorKey)) {
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
  type = is.string(type) ? type.toLowerCase().trim() : "";

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
  if(is.string(validatorKey)) {
    validatorKey = validatorKey.trim().toLowerCase();
  }

  return (
    is.string(validatorKey)
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

  const disabledEffects = this.disabledEffects;
  const defaultEffects = getActiveEffects(this.defaultEffects, disabledEffects);
  const addonEffects = getActiveEffects(this.effects, disabledEffects);
  const effects = Array.from(defaultEffects.values()).concat(Array.from(addonEffects.values()));

  if(effects.length === 0) {
    throw new TypeError(errorMessages.noEffectsActive);
  }

  let rule = this.getRule();
  const input = this.getElement();
  const value = this.getValue();
  const extras = {};

  if(rule.required && input.type === "checkbox") {
    extras.checked = input.checked;
  }

  const validationPassed = validators.reduce((passed, fn) => passed && fn(value, rule, passed, extras), true);

  //handleValidationResult(this, validationPassed);

  effects.forEach(({ valid, invalid }) => {
    if(validationPassed) {
      valid(input);
    } else {
      invalid(input);
    }
  });

  return validationPassed;
};

/**
 * Start Listening for "input" events and perform validation
 * @param {Function} callback: A function to invoke on validation complete.
 *   The function will be passed the input field and the result (Boolean) of the validation.
 */
SmartField.prototype.watch = function watch(callback) {
  const input = this.getElement();
  let targetEvent;
  
  switch(input.type) {
  case "checkbox" : targetEvent = "click"; break;
  case "email"    :
  case "password" : 
  case "text"     : 
  default         : targetEvent = "input"; break;
  }
  
  input.addEventListener(targetEvent, () => this.validate(_, callback)); // eslint-disable-line
};


// Helpers

function generateEffectName(name, namespace) {
  if(name.length > 0 && namespace.length > 0) {
    return `${namespace}.${name}`.toLowerCase();
  } else if(name.length > 0) {
    return name.toLowerCase();
  } else {
    return "";
  }
}

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
 * @param {Map} effects
 * @param {Array<String>} disabledEffects
 * @returns {Map}
 */
function getActiveEffects(effects, disabledEffects) {
  const activeEffects = new Map();  

  for(const [key, value] of effects.entries()) {
    if(!(disabledEffects.includes(key))) {
      activeEffects.set(key, value);
    }
  }

  return activeEffects;
}

/**
 * 
 * @param {Map} validators 
 * @param {Array<String>} disabledValidators 
 * @returns {Map}
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

function claimField(input) {
  input.classList?.add(APP_CLASSNAME);
  input.classList?.add(SMART_FIELD_CLASSNAME);
}

function restoreField(input) {
  input.classList?.remove(SMART_FIELD_CLASSNAME);
  input.classList?.remove(APP_CLASSNAME);
}