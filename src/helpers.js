"use strict";

const errorMessages = require("./error-messages");

const APP_CLASSNAME = "sfv";
const SMART_FIELD_CLASSNAME = "sfv-sf";
const DISABLED_FIELD_CLASSNAME = "sfv-disabled";
const VALID_FIELD_CLASSNAME = "sfv-ok";
const INVALID_FIELD_CLASSNAME = "sfv-error";

const is = {
  array: isArray,
  function: isFunction,
  number: isNumber,
  object: isObject,
  string: isString,
};

const object = {
  clone,
  cloneAndExtend,
  has: objectHas,
};

// eslint-disable-next-line
module.exports = {
  is,
  object,
  createListFromArray,
  generateEffectName,
  getEffectNames,
  isSubmitBtn,
  normalizeId,
  preEffectRegistrationCheck,
  validateId,
  APP_CLASSNAME,
  DISABLED_FIELD_CLASSNAME,
  SMART_FIELD_CLASSNAME,
  VALID_FIELD_CLASSNAME,
  INVALID_FIELD_CLASSNAME,
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
  return (typeof data === "object" && data && !isArray(data));
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
  if(isObject(obj) && isObject(newProps)) {
    return Object.assign(clone(obj), newProps);
  } else {
    return obj;
  }
}

function createListFromArray(array, combinator) {
  if(typeof combinator !== "string") {
    combinator = "\t\n* ";
  }

  return `${combinator}${array.join(combinator)}`;
}

function generateEffectName(name, namespace) {
  name = is.string(name) ? name.trim() : "";
  namespace = is.string(namespace) ? namespace.trim() : "";

  if(name.length > 0 && namespace.length > 0) {
    return `${namespace}.${name}`;
  } else if(name.length > 0) {
    return name;
  } else {
    return "";
  }
}

function getEffectNames(effects) {
  const effectObjects = Object.values(effects);
  const effectNames = effectObjects.map(effect => effect.name);

  return effectNames;
}

function isSubmitBtn(element) {
  return element.type === "submit" || element.role === "submit-button";
}

function normalizeId(id) {
  return String(id).trim();
}

function preEffectRegistrationCheck(effect, defaultEffectNames) {
  if(!(is.object(effect))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect")
        .replace(":type:", "an object")
    );
  }

  let { name, meta, valid, invalid } = effect;

  if(!(is.string(name))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.name")
        .replace(":type:", "a string")
    );
  }

  let namespace = "";
  name = name.trim();

  if(!(is.function(valid))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.valid")
        .replace(":type:", "a function")
    );
  }

  if(!(is.function(invalid))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "effect.invalid")
        .replace(":type:", "a function")
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

  return { ...effect, name: effectName };
}

function validateId(id) {
  return ["number", "string"].includes(typeof id) && Boolean(id);
}