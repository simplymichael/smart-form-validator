'use strict';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var errorMessages;
var hasRequiredErrorMessages;
function requireErrorMessages() {
  if (hasRequiredErrorMessages) return errorMessages;
  hasRequiredErrorMessages = 1;
  errorMessages = {
    argNamesAreReserved: "The following :argNames: are reserved and cannot be used as :argTypes:: \n:argValues:",
    fieldCannotBeEmpty: "The `:field:` field expects a non-empty :type:",
    fieldNotRegistered: "No field with the specified id (\":id:\") has been registered on this :element:",
    functionParamExpectsType: "The `:param:` argument expects :type:",
    functionParamIsRequired: "The `:param:` argument is required",
    htmlElementExpected: "The `:param:` argument expects an HTML `:elementType:` element",
    noObjectWithSpecifiedKey: "No :object: with the key `:key:` exists",
    noEffectsActive: "There are no active effects set on this field. \n" + "You can set an effect by calling `useEffect(effect)`",
    noValidatorsActive: "There are no active validators for this field. " + "You can do one of the following to fix this issue: " + "1. Re-enable any disabled validators by calling `enableValidator(key)` \n" + "2. Add a rule using the `addRule(rule)` method \n" + "3. Add a validator using the `addValidator(key, validator, meta)` method",
    objectPropertyCannotBeEmpty: "The `:prop:` property of the `:object:` object cannot be empty",
    objectMustHaveProperty: "The `:param:` argument must have a `:prop:` property",
    objectsMustHaveProperty: "The `:paramA:` argument must have a `:propA:` property or The `:paramB:` argument must have a `:propB:` property",
    objectPropertyShouldHaveType: "The `:prop:` property of the `:object:` object shoulde be :type:",
    objectWithKeyExists: ":object: with key `:key:` already exists",
    objectWithKeyExistsCanReplace: ":object: with key `:key:` already exists. Use `:replacer:` to replace it.",
    unknownType: "Unknown :type:: `:typeName:`, allowed :types: are: :allowedTypes:"
  };
  return errorMessages;
}

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

var helpers;
var hasRequiredHelpers;
function requireHelpers() {
  if (hasRequiredHelpers) return helpers;
  hasRequiredHelpers = 1;
  var errorMessages = requireErrorMessages();
  var APP_CLASSNAME = "sfv";
  var SMART_FIELD_CLASSNAME = "sfv-sf";
  var DISABLED_FIELD_CLASSNAME = "sfv-disabled";
  var VALID_FIELD_CLASSNAME = "sfv-ok";
  var INVALID_FIELD_CLASSNAME = "sfv-error";
  var is = {
    array: isArray,
    "function": isFunction,
    number: isNumber,
    object: isObject,
    string: isString
  };
  var object = {
    clone: clone,
    cloneAndExtend: cloneAndExtend,
    has: objectHas
  };

  // eslint-disable-next-line
  helpers = {
    is: is,
    object: object,
    createListFromArray: createListFromArray,
    generateEffectName: generateEffectName,
    getEffectNames: getEffectNames,
    getValidatorNames: getValidatorNames,
    isSubmitBtn: isSubmitBtn,
    normalizeId: normalizeId,
    preEffectRegistrationCheck: preEffectRegistrationCheck,
    preValidatorRegistrationCheck: preValidatorRegistrationCheck,
    validateId: validateId,
    APP_CLASSNAME: APP_CLASSNAME,
    DISABLED_FIELD_CLASSNAME: DISABLED_FIELD_CLASSNAME,
    SMART_FIELD_CLASSNAME: SMART_FIELD_CLASSNAME,
    VALID_FIELD_CLASSNAME: VALID_FIELD_CLASSNAME,
    INVALID_FIELD_CLASSNAME: INVALID_FIELD_CLASSNAME
  };
  function isArray(data) {
    return Array.isArray(data);
  }
  function isFunction(data) {
    return typeof data === "function";
  }
  function isNumber(num) {
    num = Number(num);
    return typeof num === "number" && !Number.isNaN(num);
  }
  function isObject(data) {
    return _typeof(data) === "object" && data && !isArray(data);
  }
  function isString(data) {
    return typeof data === "string";
  }
  function objectHas(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  function clone(obj) {
    return isObject(obj) ? Object.assign({}, obj) : obj;
  }
  function cloneAndExtend(obj, newProps) {
    if (isObject(obj) && isObject(newProps)) {
      return Object.assign(clone(obj), newProps);
    } else {
      return obj;
    }
  }
  function createListFromArray(array, combinator) {
    if (typeof combinator !== "string") {
      combinator = "\t\n* ";
    }
    return "".concat(combinator).concat(array.join(combinator));
  }
  function generateEffectName(name, namespace) {
    name = is.string(name) ? name.trim() : "";
    namespace = is.string(namespace) ? namespace.trim() : "";
    if (name.length > 0 && namespace.length > 0) {
      return "".concat(namespace, ".").concat(name);
    } else if (name.length > 0) {
      return name;
    } else {
      return "";
    }
  }
  function getEffectNames(effects) {
    var effectObjects = Object.values(effects);
    var effectNames = effectObjects.map(function (effect) {
      return effect.name;
    });
    return effectNames;
  }
  function getValidatorNames(validators) {
    return Object.keys(validators);
  }
  function isSubmitBtn(element) {
    return element.type === "submit" || element.role === "submit-button";
  }
  function normalizeId(id) {
    return String(id).trim();
  }
  function preEffectRegistrationCheck(effect, defaultEffectNames) {
    if (!is.object(effect)) {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "effect").replace(":type:", "an object"));
    }
    var name = effect.name,
      meta = effect.meta,
      valid = effect.valid,
      invalid = effect.invalid;
    if (!is.string(name)) {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "effect.name").replace(":type:", "a string"));
    }
    var namespace = "";
    name = name.trim();
    if (!is["function"](valid)) {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "effect.valid").replace(":type:", "a function"));
    }
    if (!is["function"](invalid)) {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "effect.invalid").replace(":type:", "a function"));
    }
    if (is.object(meta) && is.string(meta.namespace)) {
      namespace = meta.namespace.trim();
    }
    var effectName = generateEffectName(name, namespace);
    if (effectName.length === 0) {
      throw new TypeError(errorMessages.fieldCannotBeEmpty.replace(":field:", "effect.name").replace(":type:", "string"));
    }
    if (defaultEffectNames.includes(effectName)) {
      throw new TypeError(errorMessages.argNamesAreReserved.replace(":argNames:", "names").replace(":argTypes:", "effect names").replace(":argValues:", createListFromArray(defaultEffectNames)));
    }
    return _objectSpread2(_objectSpread2({}, effect), {}, {
      name: effectName
    });
  }
  function preValidatorRegistrationCheck(validatorKey, validatorFn, validatorMeta, defaultValidatorKeys) {
    if (!is.string(validatorKey)) {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "validatorKey").replace(":type:", "a string"));
    }
    var validatorNamespace = "";
    validatorKey = validatorKey.trim();
    if (!validatorKey) {
      throw new TypeError(errorMessages.fieldCannotBeEmpty.replace(":field:", "validatorKey").replace(":type:", "string"));
    }
    if (is.object(validatorMeta) && is.string(validatorMeta.namespace)) {
      validatorNamespace = validatorMeta.namespace.trim();
    }
    validatorKey = generateValidatorKey(validatorKey, validatorNamespace);
    if (defaultValidatorKeys.includes(validatorKey)) {
      throw new TypeError(errorMessages.argNamesAreReserved.replace(":argNames:", "keys").replace(":argTypes:", "validator keys").replace(":argValues:", createListFromArray(defaultValidatorKeys)));
    }
    if (!is["function"](validatorFn)) {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "validatorFn").replace(":type:", "a function"));
    }
    return validatorKey;
  }
  function validateId(id) {
    return ["number", "string"].includes(_typeof(id)) && Boolean(id);
  }

  // Helpers 
  function generateValidatorKey(key, namespace) {
    if (key.length > 0 && namespace.length > 0) {
      return "".concat(namespace, ".").concat(key);
    } else if (key.length > 0) {
      return key;
    } else {
      return "";
    }
  }
  return helpers;
}

var methods;
var hasRequiredMethods;
function requireMethods() {
  if (hasRequiredMethods) return methods;
  hasRequiredMethods = 1;
  var errorMessages = requireErrorMessages();
  var _require$$ = requireHelpers(),
    createListFromArray = _require$$.createListFromArray;
  var instanceMethodNames = ["addField", "addFields", "addRule", "addValidator", "getValidators", "getEffects", "getField", "getFields", "removeRule", "toJSON", "useEffect", "validate", "watch"];
  var staticMethodNames = ["getEffects", "useEffect"];
  methods = {
    addInstanceMethod: addInstanceMethod,
    addStaticMethod: addStaticMethod
  };

  /**
   * 
   * @param {Function} ctor: a constructor function 
   * @param {String} methodName: the method name to bind to instances of that constructor
   */
  function addInstanceMethod(ctor, methodName) {
    if (typeof ctor !== "function") {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "ctor").replace(":type:", "(constructor) function"));
    }
    if (!instanceMethodNames.includes(methodName)) {
      throw new TypeError(errorMessages.unknownType.replace(":type:", "instance method").replace(":typeName:", methodName).replace(":types:", "methods").replace(":allowedTypes:", createListFromArray(instanceMethodNames)));
    }
    ctor.prototype[methodName] = commonjsRequire("./".concat(methodName));
  }

  /**
   * 
   * @param {Function} ctor: a constructor function 
   * @param {String} methodName: the method name to bind as a static member to the constructor
   */
  function addStaticMethod(ctor, methodName) {
    if (typeof ctor !== "function") {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "ctor").replace(":type:", "(constructor) function"));
    }
    if (!staticMethodNames.includes(methodName)) {
      throw new TypeError(errorMessages.unknownType.replace(":type:", "static method").replace(":typeName:", methodName).replace(":types:", "methods").replace(":allowedTypes:", createListFromArray(staticMethodNames)));
    }
    ctor[methodName] = commonjsRequire("./".concat(methodName));
  }
  return methods;
}

var effectsHelpers;
var hasRequiredEffectsHelpers;
function requireEffectsHelpers() {
  if (hasRequiredEffectsHelpers) return effectsHelpers;
  hasRequiredEffectsHelpers = 1;
  var _require$$ = requireHelpers(),
    is = _require$$.is;
  effectsHelpers = {
    isSubmitButton: isSubmitButton
  };
  function isSubmitButton(element) {
    return is.object(element) && (element.type === "submit" || element.role === "submit-button");
  }
  return effectsHelpers;
}

var addBottomBorder;
var hasRequiredAddBottomBorder;
function requireAddBottomBorder() {
  if (hasRequiredAddBottomBorder) return addBottomBorder;
  hasRequiredAddBottomBorder = 1;
  var _require$$ = requireHelpers(),
    is = _require$$.is,
    VALID_FIELD_CLASSNAME = _require$$.VALID_FIELD_CLASSNAME,
    INVALID_FIELD_CLASSNAME = _require$$.INVALID_FIELD_CLASSNAME;
  var _require$$2 = requireEffectsHelpers(),
    isSubmitButton = _require$$2.isSubmitButton;
  addBottomBorder = {
    name: "addBottomBorder",
    meta: {},
    valid: handleValid,
    invalid: handleInvalid
  };
  function handleValid(field) {
    if (!is.object(field) || isSubmitButton(field)) {
      return;
    }
    field.classList.remove(INVALID_FIELD_CLASSNAME);
    field.classList.add(VALID_FIELD_CLASSNAME);
  }
  function handleInvalid(field) {
    if (!is.object(field) || isSubmitButton(field)) {
      return;
    }
    field.classList.remove(VALID_FIELD_CLASSNAME);
    field.classList.add(INVALID_FIELD_CLASSNAME);
  }
  return addBottomBorder;
}

var addValidationStatusIcons;
var hasRequiredAddValidationStatusIcons;
function requireAddValidationStatusIcons() {
  if (hasRequiredAddValidationStatusIcons) return addValidationStatusIcons;
  hasRequiredAddValidationStatusIcons = 1;
  var _require$$ = requireHelpers(),
    is = _require$$.is,
    VALID_FIELD_CLASSNAME = _require$$.VALID_FIELD_CLASSNAME,
    INVALID_FIELD_CLASSNAME = _require$$.INVALID_FIELD_CLASSNAME;
  var _require$$2 = requireEffectsHelpers(),
    isSubmitButton = _require$$2.isSubmitButton;
  addValidationStatusIcons = {
    name: "addValidationStatusIcons",
    meta: {},
    valid: handleValid,
    invalid: handleInvalid
  };
  function handleValid(field) {
    if (!is.object(field) || isSubmitButton(field)) {
      return;
    }
    field.classList.remove(INVALID_FIELD_CLASSNAME);
    field.classList.add(VALID_FIELD_CLASSNAME);
  }
  function handleInvalid(field) {
    if (!is.object(field) || isSubmitButton(field)) {
      return;
    }
    field.classList.remove(VALID_FIELD_CLASSNAME);
    field.classList.add(INVALID_FIELD_CLASSNAME);
  }
  return addValidationStatusIcons;
}

var toggleSubmitButton;
var hasRequiredToggleSubmitButton;
function requireToggleSubmitButton() {
  if (hasRequiredToggleSubmitButton) return toggleSubmitButton;
  hasRequiredToggleSubmitButton = 1;
  var _require$$ = requireHelpers(),
    APP_CLASSNAME = _require$$.APP_CLASSNAME,
    DISABLED_FIELD_CLASSNAME = _require$$.DISABLED_FIELD_CLASSNAME;
  var _require$$2 = requireEffectsHelpers(),
    isSubmitButton = _require$$2.isSubmitButton;
  toggleSubmitButton = {
    name: "toggleSubmitButton",
    meta: {},
    init: init,
    valid: handleValid,
    invalid: handleInvalid
  };
  function init(field) {
    // Initially disable the submit button
    canSubmitForm(false, field);
  }
  function handleValid(field) {
    canSubmitForm(true, field);
  }
  function handleInvalid(field) {
    canSubmitForm(false, field);
  }

  // Helper methods
  function canSubmitForm(validationPassed, input) {
    try {
      if (!isSubmitButton(input)) {
        return;
      }
      var submitBtn = input;
      if (validationPassed) {
        submitBtn.removeAttribute("disabled");
        submitBtn.classList.remove(APP_CLASSNAME);
        submitBtn.classList.remove(DISABLED_FIELD_CLASSNAME);
      } else {
        submitBtn.setAttribute("disabled", true);
        submitBtn.classList.add(APP_CLASSNAME);
        submitBtn.classList.add(DISABLED_FIELD_CLASSNAME);
      }
    } catch (e) {
      console.log("Unable to modify the submit button state: ", e.message);
    }
  }
  return toggleSubmitButton;
}

var effects;
var hasRequiredEffects;
function requireEffects() {
  if (hasRequiredEffects) return effects;
  hasRequiredEffects = 1;
  effects = {
    addBottomBorder: requireAddBottomBorder(),
    addValidationStatusIcons: requireAddValidationStatusIcons(),
    toggleSubmitButton: requireToggleSubmitButton()
  };
  return effects;
}

var validatorHelpers;
var hasRequiredValidatorHelpers;
function requireValidatorHelpers() {
  if (hasRequiredValidatorHelpers) return validatorHelpers;
  hasRequiredValidatorHelpers = 1;
  var _require$$ = requireHelpers(),
    is = _require$$.is,
    object = _require$$.object;
  var regexRules = ["g", "m"];
  validatorHelpers = {
    createAlphanumericRegexObject: createAlphanumericRegexObject,
    getLengthRegex: getLengthRegex,
    getRegexRules: getRegexRules
  };
  function createAlphanumericRegexObject(regexStr, rule, emptyLengthCharacter) {
    var lenRegex;
    if (rule.length) {
      lenRegex = getLengthRegex(rule.length);
    } else {
      lenRegex = emptyLengthCharacter || "+";
    }
    regexStr = "".concat(regexStr).concat(lenRegex);
    regexStr = "^".concat(regexStr, "$");
    return new RegExp(regexStr, getRegexRules(rule.matchCase));
  }
  function getLengthRegex(lengthRule) {
    var regexStr;
    var len = object.clone(lengthRule) || {};
    if (len.min && len.max) {
      if (Number(len.min) > Number(len.max)) {
        var tmp = len.min;
        len.min = len.max;
        len.max = tmp;
      }
      regexStr = "{".concat(len.min, ",").concat(len.max, "}");
    } else if (len.min) {
      regexStr = "{".concat(len.min, ",}");
    } else if (len.max) {
      regexStr = "{0,".concat(len.max, "}");
    } else if (is.number(len)) {
      regexStr = "{0,".concat(len, "}");
    }
    return regexStr;
  }
  function getRegexRules(matchCase) {
    if (matchCase) {
      return regexRules.join("");
    } else {
      return [].concat(regexRules, ["i"]).join("");
    }
  }
  return validatorHelpers;
}

var alphanumericValidator;
var hasRequiredAlphanumericValidator;
function requireAlphanumericValidator() {
  if (hasRequiredAlphanumericValidator) return alphanumericValidator;
  hasRequiredAlphanumericValidator = 1;
  var _require$$ = requireValidatorHelpers(),
    createAlphanumericRegexObject = _require$$.createAlphanumericRegexObject;

  /**
  * Validate that a string contains only alphanumeric characters, _ (underscore), or - (hyphen). 
  * @param {String} value (required): The string to validate
  * @param {Object} rule (required): Object containing the requirements for the value to be valid.
  * @param {String} [rule.type]: the expected type of the value.
  * @param {Boolean} [rule.allowWhitespace] (optional): specifies whether to allow whitespace or not.
  * @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
  * @returns {Boolean}
  */
  alphanumericValidator = function alphanumericValidator(value, rule) {
    if (!rule.type || rule.type !== "alnum") {
      return true; // if the "alnum" rule has not been defined for this value, bypass this validator
    }

    if (!value) {
      return false;
    }
    var regexStr = rule.allowWhitespace ? "[A-Z0-9\\s_-]" : "[A-Z0-9_-]";
    var regex = createAlphanumericRegexObject(regexStr, rule);
    return regex.test(value);
  };
  return alphanumericValidator;
}

var alphaValidator;
var hasRequiredAlphaValidator;
function requireAlphaValidator() {
  if (hasRequiredAlphaValidator) return alphaValidator;
  hasRequiredAlphaValidator = 1;
  var _require$$ = requireValidatorHelpers(),
    createAlphanumericRegexObject = _require$$.createAlphanumericRegexObject;

  /**
   * Validate that a string contains only the characters A - Z, _ (underscore), or - (hyphen). 
   * @param {String} value (required): The string to validate
   * @param {Object} rule (required): Object containing the requirements for the value to be valid.
   * @param {String} [rule.type]: the expected type of the value.
   * @param {Boolean} [rule.allowWhitespace] (optional): specifies whether to allow whitespace or not.
   * @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
   * @returns {Boolean}
   */
  alphaValidator = function alphaValidator(value, rule) {
    if (!rule.type || rule.type !== "alpha") {
      return true; // if the "alpha" rule has not been defined for this value, bypass this validator
    }

    if (!value || typeof value !== "string") {
      return false;
    }
    var regexStr = rule.allowWhitespace ? "[A-Z\\s_-]" : "[A-Z_-]";
    var regex = createAlphanumericRegexObject(regexStr, rule);
    return regex.test(value);
  };
  return alphaValidator;
}

var asciiTextValidator;
var hasRequiredAsciiTextValidator;
function requireAsciiTextValidator() {
  if (hasRequiredAsciiTextValidator) return asciiTextValidator;
  hasRequiredAsciiTextValidator = 1;
  var _require$$ = requireValidatorHelpers(),
    createAlphanumericRegexObject = _require$$.createAlphanumericRegexObject;

  /**
   * Validate that a string contains only ascii text characters. 
   * @param {String} value (required): The string to validate
   * @param {Object} rule (required): Object containing the requirements for the value to be valid.
   * @param {String} [rule.type]: the expected type of the value.
   * @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
   * @returns {Boolean}
   */
  asciiTextValidator = function asciiTextValidator(value, rule) {
    if (!rule.type || rule.type !== "ascii") {
      return true; // if the "ascii" rule has not been defined for this value, bypass this validator
    }

    if (!value) {
      return false;
    }
    var regexStr = "[A-Z0-9`~!@#$%^&*()-+=\\[\\]{}\\\\;:'\"|<>?\\,\\.?\\/\\s_-]"; // \\\\ = support for backward slash
    var regex = createAlphanumericRegexObject(regexStr, rule);
    return regex.test(value);
  };
  return asciiTextValidator;
}

var emailValidator;
var hasRequiredEmailValidator;
function requireEmailValidator() {
  if (hasRequiredEmailValidator) return emailValidator;
  hasRequiredEmailValidator = 1;
  // Credits: https://github.com/manishsaraan/email-validator/blob/master/index.js
  //
  // Thanks to:
  // http://fightingforalostcause.net/misc/2006/compare-email-regex.php
  // http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
  // http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
  // https://en.wikipedia.org/wiki/Email_address  The format of an email address is local-part@domain, where the 
  // local part may be up to 64 octets long and the domain may have a maximum of 255 octets.[4]
  //

  var regex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  /**
   * Validate that a string is an email.
   * @param {String} value (required): The value to validate
   * @param {Object} rule (required): Object containing the requirements for the value to be valid.
   * @param {String} [rule.type]: the expected type of the value.
   * @returns {Boolean}
   */
  emailValidator = function emailValidator(value, rule) {
    if (!rule.type || rule.type !== "email") {
      return true; // if the "email" rule has not been defined for this value, bypass this validator
    }

    if (!value || typeof value !== "string") {
      return false;
    }
    var emailParts = value.split("@");
    if (emailParts.length !== 2) {
      return false;
    }
    var _emailParts = _slicedToArray(emailParts, 2),
      account = _emailParts[0],
      address = _emailParts[1];
    if (account.length > 64 || address.length > 255) {
      return false;
    }
    var domainParts = address.split(".");
    if (domainParts.some(function (part) {
      return part.length > 63;
    })) {
      return false;
    }
    return regex.test(value);
  };
  return emailValidator;
}

var lengthValidator;
var hasRequiredLengthValidator;
function requireLengthValidator() {
  if (hasRequiredLengthValidator) return lengthValidator;
  hasRequiredLengthValidator = 1;
  var _require$$ = requireHelpers(),
    is = _require$$.is;
  var _require$$2 = requireValidatorHelpers(),
    createAlphanumericRegexObject = _require$$2.createAlphanumericRegexObject;

  /**
   * Validate that a string conforms to the passed length requirements.
   * @param {String} value (required): The value to validate
   * @param {Object} rule (required): Object containing the requirements for the value to be valid.
   * @param {Number|Object} [rule.length] (required): The length requirements.
   * @param {Number} [rule.length.min] (optional): minimum length requirement.
   * @param {Number} [rule.length.max] (optional): maximum length requirement.
   * @returns {Boolean}
   */
  lengthValidator = function lengthValidator(value, rule) {
    if (!is.number(rule.length) && !is.object(rule.length)) {
      return true; // If the length rule has not been defined for the value, bypass this validator
    }

    if (typeof value === "undefined" || value === null || value === false) {
      return false;
    }
    var regexStr = "[A-Z0-9.\\s_-]";
    var regex = createAlphanumericRegexObject(regexStr, rule, "*");
    return regex.test(value);
  };
  return lengthValidator;
}

var numberValidator;
var hasRequiredNumberValidator;
function requireNumberValidator() {
  if (hasRequiredNumberValidator) return numberValidator;
  hasRequiredNumberValidator = 1;
  var _require$$ = requireValidatorHelpers(),
    createAlphanumericRegexObject = _require$$.createAlphanumericRegexObject;

  /**
   * Validate that a value contains only numbers. 
   * @param {Number|String} value (required): The string to validate
   * @param {Object} rule (required): Object containing the requirements for the value to be valid.
   * @param {String} [rule.type]: The expected type of the value.
   * @param {Boolean} [rule.allowWhitespace] (optional): specifies whether to allow whitespace or not.
   * @returns {Boolean}
   */
  numberValidator = function numberValidator(value, rule) {
    if (!rule.type || rule.type !== "number") {
      return true; // If the "number" rule has not been specified for this value, bypass this validator.
    }

    if (value === "" || value === null || typeof value === "undefined") {
      return false;
    }
    var regexStr = rule.allowWhitespace ? "[0-9\\s]" : "[0-9]";
    var regex = createAlphanumericRegexObject(regexStr, rule);
    return regex.test(value);
  };
  return numberValidator;
}

var regexValidator;
var hasRequiredRegexValidator;
function requireRegexValidator() {
  if (hasRequiredRegexValidator) return regexValidator;
  hasRequiredRegexValidator = 1;
  var _require$$ = requireHelpers(),
    is = _require$$.is;

  /**
   * Validate a value according to provided custom regular expression.
   * @param {Mixed} value (required): The value to validate
   * @param {Object} rule (required): Object containing the requirements for the value to be valid.
   * @param {Object|String} [rule.regex]: A regex string or a regex object.
   * @returns {Boolean}
   */
  regexValidator = function regexValidator(value, rule) {
    if (!rule.regex) {
      return true; // if the regex rule has not been defined for this value, bypass this validator
    }

    var regexStr = rule.regex;
    var regex = is.object(regexStr) ? regexStr : new RegExp(regexStr);
    return regex.test(value);
  };
  return regexValidator;
}

/**
 * Validate that a value is not empty, that is, not undefined. 
 * @param {String} value (required): The value to validate
 * @param {Object} rule (required): Object containing the requirements for the value to be valid.
 * @param {Boolean} [rule.required]: Dictates whether or not the value is required.
 * @param {Boolean} prevResult (optional);
 * @param {Object} extras
 * @param {Boolean} [extras.checked] (optional): if the value is of a checkbox, .
 * @returns {Boolean}
 */
var requiredFieldValidator;
var hasRequiredRequiredFieldValidator;
function requireRequiredFieldValidator() {
  if (hasRequiredRequiredFieldValidator) return requiredFieldValidator;
  hasRequiredRequiredFieldValidator = 1;
  requiredFieldValidator = function requiredFieldValidator(value, rule, _, extras) {
    if (!rule.required) {
      return true; // bypass this validation if no rule has been specified for it.
    }

    if (value === "" || typeof value === "undefined") {
      return false;
    }
    var passed;
    switch (rule.type) {
      case "checkbox":
        passed = extras.checked && value === "on";
        break;
      default:
        passed = value.length > 0;
        break;
    }
    return passed;
  };
  return requiredFieldValidator;
}

var validators;
var hasRequiredValidators;
function requireValidators() {
  if (hasRequiredValidators) return validators;
  hasRequiredValidators = 1;
  validators = {
    alphanumericValidator: requireAlphanumericValidator(),
    alphaValidator: requireAlphaValidator(),
    asciiTextValidator: requireAsciiTextValidator(),
    emailValidator: requireEmailValidator(),
    lengthValidator: requireLengthValidator(),
    numberValidator: requireNumberValidator(),
    regexValidator: requireRegexValidator(),
    requiredFieldValidator: requireRequiredFieldValidator()
  };
  return validators;
}

var smartField;
var hasRequiredSmartField;
function requireSmartField() {
  if (hasRequiredSmartField) return smartField;
  hasRequiredSmartField = 1;
  var effects = requireEffects();
  var errorMessages = requireErrorMessages();
  var _require$$ = requireHelpers(),
    APP_CLASSNAME = _require$$.APP_CLASSNAME,
    SMART_FIELD_CLASSNAME = _require$$.SMART_FIELD_CLASSNAME,
    is = _require$$.is,
    object = _require$$.object,
    generateEffectName = _require$$.generateEffectName,
    getEffectNames = _require$$.getEffectNames,
    getValidatorNames = _require$$.getValidatorNames,
    preEffectRegistrationCheck = _require$$.preEffectRegistrationCheck,
    preValidatorRegistrationCheck = _require$$.preValidatorRegistrationCheck,
    isSubmitBtn = _require$$.isSubmitBtn,
    normalizeId = _require$$.normalizeId,
    validateId = _require$$.validateId;
  var defaultValidators = requireValidators();
  var defaultEffects = Object.values(effects);
  var defaultEffectNames = getEffectNames(effects);
  var defaultValidatorFunctions = Object.entries(defaultValidators);
  var defaultValidatorKeys = getValidatorNames(defaultValidators); //Object.keys(defaultValidators);

  smartField = SmartField;

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
    if (!is.object(element)) {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "element").replace(":type:", "object"));
    }
    if (!validateId(element.id) && !isSubmitBtn(element)) {
      throw new TypeError(errorMessages.objectPropertyShouldHaveType.replace(":prop:", "id").replace(":object:", "element").replace(":type:", "a string or a number"));
    }
    if (normalizeId(element.id).length === 0 && !isSubmitBtn(element)) {
      throw new TypeError(errorMessages.objectPropertyCannotBeEmpty.replace(":prop:", "id").replace(":object:", "element"));
    }
    if (typeof element.getValue !== "undefined" && typeof element.getValue !== "function") {
      throw new TypeError(errorMessages.objectPropertyShouldHaveType.replace(":prop:", "getValue").replace(":object:", "element").replace(":type:", "a function"));
    }
    if (isSubmitBtn(element)) {
      this.role = "submit-button";
    }
    this.id = element.id;
    this.element = element;
    this.defaultEffects = new Map();
    this.defaultValidators = new Map(defaultValidatorFunctions);
    this.effects = new Map();
    this.validators = new Map();
    var _iterator = _createForOfIteratorHelper(defaultEffects),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var effect = _step.value;
        var name = effect.name,
          meta = effect.meta,
          init = effect.init,
          valid = effect.valid,
          invalid = effect.invalid;
        this.defaultEffects.set(name, {
          meta: meta,
          init: init,
          valid: valid,
          invalid: invalid
        });
        if (is["function"](init)) {
          init(this.element);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (is.object(rule)) {
      this.addRule(_objectSpread2(_objectSpread2({}, rule), {}, {
        fieldId: element.id
      }));
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
    var existingRule = this.rule;
    if (is.object(existingRule) && is.object(rule)) {
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
    var existingRule = this.rule;
    if (!is.object(existingRule)) {
      return this;
    }
    if (key) {
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
    if (key && this.rule) {
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
    var effectName = generateEffectName(name, namespace);
    if (this.effects.has(effectName)) {
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
    var effects = {
      "default": this.defaultEffects,
      addon: this.effects
    };
    if (["addon", "default"].includes(type)) {
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
    var parsedEffect = preEffectRegistrationCheck(effect, defaultEffectNames);
    var effectName = parsedEffect.name,
      meta = parsedEffect.meta,
      init = parsedEffect.init,
      valid = parsedEffect.valid,
      invalid = parsedEffect.invalid;
    if (this.usesEffect(effectName)) {
      throw new TypeError(errorMessages.objectWithKeyExists.replace(":object:", "An effect").replace(":key:", effectName));
    }
    this.effects.set(effectName, {
      meta: meta,
      init: init,
      valid: valid,
      invalid: invalid
    });
    if (is["function"](init)) {
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
    if (is.string(name)) {
      name = name.trim().toLowerCase();
      namespace = is.string(namespace) ? namespace.trim().toLowerCase() : "";
      var effectName = generateEffectName(name, namespace);
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
    if (this.hasValidator(validatorKey)) {
      throw new TypeError(errorMessages.objectWithKeyExists.replace(":object:", "A validator").replace(":key:", validatorKey));
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
    var validators = {
      "default": this.defaultValidators,
      addon: this.validators
    };
    if (["addon", "default"].includes(type)) {
      return validators[type];
    } else {
      return validators;
    }
  };
  SmartField.prototype.hasValidator = function hasValidator(validatorKey) {
    if (is.string(validatorKey)) {
      validatorKey = validatorKey.trim().toLowerCase();
    }
    return is.string(validatorKey) ? this.validators.has(validatorKey) : this.validators.size > 0;
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
    var _input$type, _input$tagName;
    var value;
    var input = this.getElement();
    if (typeof input.getValue === "function") {
      value = input.getValue();
    } else if (((_input$type = input.type) === null || _input$type === void 0 ? void 0 : _input$type.toLowerCase()) === "checkbox") {
      value = input.value;
    } else if (((_input$tagName = input.tagName) === null || _input$tagName === void 0 ? void 0 : _input$tagName.toLowerCase()) === "select") {
      var _getHtmlSelectElement;
      value = (_getHtmlSelectElement = getHtmlSelectElementSelectedOption(input)) === null || _getHtmlSelectElement === void 0 || (_getHtmlSelectElement = _getHtmlSelectElement.value) === null || _getHtmlSelectElement === void 0 ? void 0 : _getHtmlSelectElement.trim();
    } else if (typeof input.value !== "undefined") {
      value = input.value;
    } else if (input.isContentEditable && typeof input.textContent !== "undefined") {
      value = input.textContent;
    }
    return is.string(value) ? value.trim() : value;
  };

  /**
   * @returns {Boolean}
   */
  SmartField.prototype.validate = function validate() {
    var _this$getValidators = this.getValidators(),
      defaultValidators = _this$getValidators["default"],
      addonValidators = _this$getValidators.addon;
    var validators = Array.from(defaultValidators.values()).concat(Array.from(addonValidators.values()));
    if (validators.length === 0) {
      throw new TypeError(errorMessages.noValidatorsActive);
    }
    var _this$getEffects = this.getEffects(),
      defaultEffects = _this$getEffects["default"],
      addonEffects = _this$getEffects.addon;
    var effects = Array.from(defaultEffects.values()).concat(Array.from(addonEffects.values()));
    if (effects.length === 0) {
      throw new TypeError(errorMessages.noEffectsActive);
    }
    var rule = this.getRule();
    var input = this.getElement();
    var value = this.getValue();
    var extras = {};
    if (rule.required && input.type === "checkbox") {
      extras.checked = input.checked;
    }
    var validationPassed = validators.reduce(function (passed, fn) {
      return passed && fn(value, rule, passed, extras);
    }, true);
    effects.forEach(function (_ref) {
      var valid = _ref.valid,
        invalid = _ref.invalid;
      if (validationPassed) {
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
    var _this = this;
    var input = this.getElement();
    var targetEvent;
    switch (input.type) {
      case "checkbox":
        targetEvent = "click";
        break;
      case "email":
      case "password":
      case "text":
      default:
        targetEvent = "input";
        break;
    }
    input.addEventListener(targetEvent, function () {
      return _this.validate(_, callback);
    }); // eslint-disable-line
  };

  // Helpers

  function getHtmlSelectElementSelectedOption(selectElement) {
    return {
      value: selectElement.value,
      text: selectElement.options[selectElement.selectedIndex].text
    };
  }
  function claimField(input) {
    var _input$classList, _input$classList2;
    (_input$classList = input.classList) === null || _input$classList === void 0 || _input$classList.add(APP_CLASSNAME);
    (_input$classList2 = input.classList) === null || _input$classList2 === void 0 || _input$classList2.add(SMART_FIELD_CLASSNAME);
  }
  return smartField;
}

var addField;
var hasRequiredAddField;
function requireAddField() {
  if (hasRequiredAddField) return addField;
  hasRequiredAddField = 1;
  var errorMessages = requireErrorMessages();
  var _require$$ = requireHelpers(),
    is = _require$$.is,
    isSubmitBtn = _require$$.isSubmitBtn,
    normalizeId = _require$$.normalizeId,
    validateId = _require$$.validateId;
  var SmartField = requireSmartField();

  /**
   * Add a new field for validation
   * @param {Object|String} input: the field to validate. The field must have an `id` property.
   *    This can be the HTML element itself if we already have it, or its ID.
   * @param {String} [input.id] (required): the id of the element 
   * @param {String} [input.role] (optional): the role of the element. 
   *    This can be particularly useful for identifying submit buttons that are not defined 
   *    as `<input type="submit" />`. In such cases, if we want effects that work with submit buttons 
   *    to have access to the button, we have to give the element a role of "submit-button", e.g. 
   *    `<button role="submit-button">Submit</button>`.
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
  addField = function addField(input, rule) {
    if (typeof input === "string") {
      input = document.getElementById(input);
    }
    if (!is.object(input)) {
      throw new TypeError(errorMessages.functionParamExpectsType.replace(":param:", "input").replace(":type:", "object"));
    }
    if (!validateId(input.id) && !isSubmitBtn(input)) {
      throw new TypeError(errorMessages.objectPropertyShouldHaveType.replace(":prop:", "id").replace(":object:", "input").replace(":type:", "a string or a number"));
    }
    var field = this.getField(normalizeId(input.id));
    if (field) {
      if (is.object(rule)) {
        rule.field = input.id;
        this.addRule(rule);
      }
    } else {
      this.fields.push(new SmartField(input, rule));
    }
    return this;
  };
  return addField;
}

var smartForm;
var hasRequiredSmartForm;
function requireSmartForm() {
  if (hasRequiredSmartForm) return smartForm;
  hasRequiredSmartForm = 1;
  var errorMessages = requireErrorMessages();
  var _require$$ = requireHelpers(),
    is = _require$$.is,
    isSubmitBtn = _require$$.isSubmitBtn,
    validateId = _require$$.validateId;
  var _require$$2 = requireMethods(),
    addInstanceMethod = _require$$2.addInstanceMethod,
    addStaticMethod = _require$$2.addStaticMethod;
  var staticMethods = ["getEffects", "useEffect"];
  var instanceMethods = ["addRule", "removeRule", "getField", "getFields", "getEffects", "useEffect", "toJSON", "validate", "watch"];
  smartForm = SmartForm;

  /**
   * Create a new SmartForm object.
   * @param {Object|String} the form element to add validation routine to.
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
   * @returns this.
   * 
   * Before any of the form's fields can have any validation performed on them, 
   * a rule must be added to it
   * either during initialization or by calling the addRule(rule) method on the SmartForm instance.
   */
  function SmartForm(form, rules) {
    var _this = this;
    if (typeof form === "string") {
      form = document.getElementById(form.trim());
    }
    if (!is.object(form)) {
      throw new TypeError(errorMessages.htmlElementExpected.replace(":param:", "form").replace(":elementType:", "form"));
    }
    this.form = form;
    this.fields = [];
    var elements = form.elements;
    if (elements) {
      Array.from(elements).forEach(function (input) {
        if (validateId(input.id) || isSubmitBtn(input)) {
          _this.addField(input);
        }
      });
    }
    if (is.array(rules)) {
      // Grab a hold of only the input fields passed to our smart-form-validator processor; 
      // Ignore other fields and let the user handle those themselves.
      rules.forEach(function (rule) {
        var input = form.querySelector("#".concat(rule.fieldId));
        if (input && _this.getField(input.id)) {
          _this.addRule(rule);
        }
      });
    }
  }
  SmartForm.prototype.addField = function addField(element, rule) {
    var formInputIds = Array.from(this.form.elements).map(function (el) {
      return el.id;
    });
    if (formInputIds.includes(element.id)) {
      requireAddField().call(this, element, rule);
    }
    return this;
  };
  staticMethods.forEach(function bindMethodToClass(method) {
    addStaticMethod(SmartForm, method);
  });
  instanceMethods.forEach(function bindMethodToInstance(method) {
    addInstanceMethod(SmartForm, method);
  });
  return smartForm;
}

var smartFormValidator;
var hasRequiredSmartFormValidator;
function requireSmartFormValidator() {
  if (hasRequiredSmartFormValidator) return smartFormValidator;
  hasRequiredSmartFormValidator = 1;
  var _require$$ = requireMethods(),
    addInstanceMethod = _require$$.addInstanceMethod,
    addStaticMethod = _require$$.addStaticMethod;
  var SmartForm = requireSmartForm();
  var staticMethods = ["getEffects", "useEffect"];
  var instanceMethods = ["addField", "addFields", "addRule", "removeRule", "addValidator", "getValidators", "getField", "getFields", "getEffects", "useEffect", "toJSON", "validate", "watch"];
  smartFormValidator = SmartFormValidator;
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
    var smartForm = new SmartForm(form, rules);
    this.form = smartForm.form;
    return smartForm;
  };
  staticMethods.forEach(function bindMethodToClass(method) {
    addStaticMethod(SmartFormValidator, method);
  });
  instanceMethods.forEach(function bindMethodToInstance(method) {
    addInstanceMethod(SmartFormValidator, method);
  });
  return smartFormValidator;
}

var src;
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src;
  hasRequiredSrc = 1;
  var SmartFormValidator = requireSmartFormValidator();
  src = SmartFormValidator;
  return src;
}

var srcExports = requireSrc();
var index = /*@__PURE__*/getDefaultExportFromCjs(srcExports);

module.exports = index;
//# sourceMappingURL=smart-form-validator.js.map
