"use strict";

const errorMessages = require("./error-messages");

const APP_CLASSNAME = "sfv";
const VALID_FIELD_CLASSNAME = "ok";
const INVALID_FIELD_CLASSNAME = "error";

const array = {
  iterator: arrayIterator,
  functionArrayIterator: functionArrayIterator,
};

const is = {
  array: isArray,
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
  array,
  object,
  normalizeId,
  validateId,
  APP_CLASSNAME,
  VALID_FIELD_CLASSNAME,
  INVALID_FIELD_CLASSNAME,
};

function arrayIterator(arr) {
  if(!isArray(arr)) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "arr")
        .replace(":type:", "an array")
    );
  }

  let i = 0;
  let result;
  const generator = (function *nextGenerator() {
    while(i < arr.length) {
      yield(arr[i++]);
    }
  }());

  return {
    advance: () => result = generator.next(),
    done: () => result.done,
    key: () => i,
    reset: () => i = 0,
    value: () => result.value,
  };
}

/**
 * Get an Iterator for an array of functions.
 * @param {Function[]}: The array of functions to iterate, invoking each one on next iteration.
 * @return {Object}: An Iterator object.
 */
function functionArrayIterator(arr) {
  if(!isArray(arr) || !(arr.every(fn => typeof fn === "function"))) {
    throw new TypeError(
      errorMessages.functionParamExpectsType
        .replace(":param:", "arr")
        .replace(":type:", "an array of functions")
    );
  }
  
  return arrayIterator(arr);
}

function isArray(data) {
  return Array.isArray(data);
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