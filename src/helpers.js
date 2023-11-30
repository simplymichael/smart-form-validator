"use strict";

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
  generateEffectName,
  normalizeId,
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

function generateEffectName(name, namespace) {
  if(name.length > 0 && namespace.length > 0) {
    return `${namespace}.${name}`.toLowerCase();
  } else if(name.length > 0) {
    return name.toLowerCase();
  } else {
    return "";
  }
}

function normalizeId(id) {
  return String(id).trim();
}

function validateId(id) {
  return ["number", "string"].includes(typeof id) && Boolean(id);
}