"use strict";

const APP_CLASSNAME = "sfv";
const VALID_FIELD_CLASSNAME = "ok";
const INVALID_FIELD_CLASSNAME = "error";

const is = {
  array: isArray,
  number: isNumber,
  object: isObject,
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
  normalizeId,
  validateId,
  APP_CLASSNAME,
  VALID_FIELD_CLASSNAME,
  INVALID_FIELD_CLASSNAME,
};

function isArray(data) {
  return Array.isArray(data);
}

function isNumber(num) {
  num = Number(num);

  return typeof num === "number" && !Number.isNaN(num);
}

function isObject(data) {
  return (typeof data === "object" && data && !isArray(data));
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

function normalizeId(id) {
  return String(id).trim();
}

function validateId(id) {
  return ["number", "string"].includes(typeof id);
}