"use strict";

const effects = require("./effects");
const errorMessages = require("./error-messages");
const { 
  APP_CLASSNAME,  
  SMART_FIELD_CLASSNAME,
  is,
  object,
  generateEffectName,
  getEffectNames,
  getValidatorNames,
  preEffectRegistrationCheck,
  preValidatorRegistrationCheck,
  isSubmitBtn,
  normalizeId,
  validateId,
} = require("./helpers");
const defaultValidators = require("./validators");

const defaultEffects = Object.values(effects);
const defaultEffectNames = getEffectNames(effects);
const defaultValidatorFunctions = Object.entries(defaultValidators);
const defaultValidatorKeys = getValidatorNames(defaultValidators); //Object.keys(defaultValidators);


module.exports = SmartField;


/**
 * Create a new SmartField object.
 * @param {Object} element: the element to create a SmartField instance from;
 * @param {String} [element.id] (required): the id of the element 
 * @param {String} [element.role] (optional): the role of the element. 
 *    This can be particularly usefule for identifying submit buttons that are not defined 
 *    as `<input type="submit" />`. In such cases, if we want effects that work with submit buttons 
 *    to have access to the button, we have to give the element a role of "submit-button", e.g. 
 *    `<button role="submit-button">Submit</button>`.
 * @param {Function} [element.getValue] (optional): A function to get the element's value.
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
 * @param {String} [rule.type]: the acceptable data type of the value  for this field (alnum|alpha|ascii|email|number).
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

  if(!validateId(element.id) && !isSubmitBtn(element)) {
    throw new TypeError(
      errorMessages
        .objectPropertyShouldHaveType
        .replace(":prop:", "id")
        .replace(":object:", "element")
        .replace(":type:", "a string or a number")
    );
  }

  if(normalizeId(element.id).length === 0 && !isSubmitBtn(element)) {
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

  if(isSubmitBtn(element)) {
    this.role = "submit-button";
  }

  this.id = element.id;
  this.element = element;
  this.defaultEffects = new Map();
  this.defaultValidators = new Map(defaultValidatorFunctions);
  this.effects = new Map();
  this.validators = new Map();

  for(const effect of defaultEffects) {
    const { name, meta, init, valid, invalid } = effect;

    this.defaultEffects.set(name, { meta, init, valid, invalid });

    if(is.function(init)) {
      init(this.element);
    }
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
    this.rule = object.cloneAndExtend(existingRule, rule);
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
 * getEffect:  retrieves an effect attached to this field by name.
 * 
 * @param {String} name (required)
 * @param {String} namespace (optional)
 * @returns {Boolean}
 */
SmartField.prototype.getEffect = function getEffect(name, namespace) {
  name = is.string(name) ? name.trim().toLowerCase() : "";
  namespace = is.string(namespace) ? namespace.trim().toLowerCase() : "";

  const effectName = generateEffectName(name, namespace);

  if(this.effects.has(effectName)) {
    return this.effects.get(effectName);
  } else {
    return null;
  }
};

/**
 * @param {String} type (optional): "addon"|"default".
 * @returns {Object} with members: `default` and/or `addon`.
 */
SmartField.prototype.getEffects = function getActiveEffects(type) {
  type = is.string(type) ? type.toLowerCase().trim() : "";

  const effects = {
    default: this.defaultEffects,
    addon: this.effects,
  };

  if(["addon", "default"].includes(type)) {
    return effects[type];
  } else {
    return effects;
  }
};

/**
 * 
 * @param {Object} effect: 
 * @param {String} [effect.name] (required): The name of this effect, used when registering the effect.
 * @param {Function} [effects.init] (optional): Function that performs any initialization function.
 *    The function is invoked right after the effect is registered.
 *    It receives the current input field as its first argument.
 * @param {Function} [effect.valid] (required): Function to invoke post-validation if the field is valid.
 *    The function receives the validated input field as its first argument.
 * @param {Function} [effect.invalid] (required): Function to invoke post-validation if the field is invalid.
 *    The function is passed the validated input field as its first argument
 * @param {Object} [effect.meta] (optional): Effect meta data, e.g., namespace, author, version, etc.
 * @param {String} [effect.meta.namespace]: used in conjunction with the effect `name` 
 *    to create a unique name for the effect.
 * @returns this.
 */
SmartField.prototype.useEffect = function useEffect(effect) {
  const parsedEffect = preEffectRegistrationCheck(effect, defaultEffectNames);

  let { name: effectName, meta, init, valid, invalid } = parsedEffect;

  if(this.usesEffect(effectName)) {
    throw new TypeError(
      errorMessages.objectWithKeyExists
        .replace(":object:", "An effect")
        .replace(":key:", effectName)
    );
  }

  this.effects.set(effectName, { meta, init, valid, invalid });

  if(is.function(init)) {
    init(this.getElement());
  }

  return this;
};

/**
 * usesEffect: checks whether the field has any effects attached to.
 * If the `name` (and/or `namespace`) parameter is supplied, 
 * checks if the field has the named effect attached.
 * 
 * @param {String} name (optional)
 * @param {String} namespace (optional)
 * @returns {Boolean}
 */
SmartField.prototype.usesEffect = function usesEffect(name, namespace) {
  if(is.string(name)) {
    name = name.trim().toLowerCase();
    namespace = is.string(namespace) ? namespace.trim().toLowerCase() : "";

    const effectName = generateEffectName(name, namespace);

    return this.effects.has(effectName);
  } else {
    return this.effects.size > 0;
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
  validatorKey = preValidatorRegistrationCheck(validatorKey, validatorFn, validatorMeta, defaultValidatorKeys);

  if(this.hasValidator(validatorKey)) {
    throw new TypeError(
      errorMessages.objectWithKeyExists
        .replace(":object:", "A validator")
        .replace(":key:", validatorKey)
    );
  }

  this.validators.set(validatorKey, validatorFn);

  return this;
};

/**
 * @param {String} type (optional): "addon"|"default".
 * @returns {Object} with members: `default` and/or `addon`.
 */
SmartField.prototype.getValidators = function getValidators(type) {
  type = is.string(type) ? type.toLowerCase().trim() : "";

  const validators = {
    default: this.defaultValidators,
    addon: this.validators,
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
    value = input.value;
  } else if(input.isContentEditable && typeof input.textContent !== "undefined") {
    value = input.textContent;
  }

  return ( is.string(value) ? value.trim() : value );
};

/**
 * @returns {Boolean}
 */
SmartField.prototype.validate = function validate() {
  const { default: defaultValidators, addon: addonValidators } = this.getValidators();
  const validators = Array.from(defaultValidators.values()).concat(Array.from(addonValidators.values()));

  if(validators.length === 0) {
    throw new TypeError(errorMessages.noValidatorsActive);
  }

  const { default: defaultEffects, addon: addonEffects } = this.getEffects();
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