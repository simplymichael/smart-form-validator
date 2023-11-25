"use strict";

const APP_CLASSNAME = "sfv";
const DISABLED_FIELD_CLASSNAME = "disabled";
const VALID_FIELD_CLASSNAME = "ok";
const INVALID_FIELD_CLASSNAME = "error";

const form = {
  canSubmit: determineFormSubmission,
};

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
  form,
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
  return ["number", "string"].includes(typeof id) && Boolean(id);
}

function determineFormSubmission(validationPassed, input) {
  let submitBtn;
  const parent = input.parentNode;
      
  submitBtn = parent?.querySelector("[type=\"submit\"]");
  submitBtn = submitBtn || Array.from(parent?.querySelectorAll("button"))?.pop();

  if(!submitBtn) {
    return;
  }

  if(validationPassed) {
    submitBtn.removeAttribute("disabled");
    submitBtn.classList.remove(APP_CLASSNAME);
    submitBtn.classList.remove(DISABLED_FIELD_CLASSNAME);
  } else {
    submitBtn.setAttribute("disabled", true);
    submitBtn.classList.add(APP_CLASSNAME);
    submitBtn.classList.add(DISABLED_FIELD_CLASSNAME);
  }
}