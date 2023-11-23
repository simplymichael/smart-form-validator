const { is, object } = require("./helpers");
const regexRules = ["g", "m"];

module.exports = {
  alphaValidator,
  alphanumericValidator,
  asciiTextValidator,
  emailValidator,
  lengthValidator,
  numberValidator,
  regexValidator,
  requiredFieldValidator,
};


/**
 * Validate that a string contains only the characters A - Z, _ (underscore), or - (hyphen). 
 * @param {String} value (required): The string to validate
 * @param {Object} rule (required): Object containing the length and cases requirement.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
 * @returns {Boolean}
 */
function alphaValidator(value, rule) {
  if(!value) {
    return false;
  }

  const regexStr = rule.allowWhitespace ? "[A-Z\\s_-]" : "[A-Z_-]";
  const regex = createAlphanumericRegexObject(regexStr, rule);

  return regex.test(value);
}

/**
 * Validate that a string contains only alphanumeric characters, _ (underscore), or - (hyphen). 
 * @param {String} value (required): The string to validate
 * @param {Object} rule (required): Object containing the length and cases requirement.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
 * @returns {Boolean}
 */
function alphanumericValidator(value, rule) {
  if(!value) {
    return false;
  }

  const regexStr = rule.allowWhitespace ? "[A-Z0-9\\s_-]" : "[A-Z0-9_-]";
  const regex = createAlphanumericRegexObject(regexStr, rule);

  return regex.test(value);
}

/**
 * Validate that a string contains only ascii text characters. 
 * @param {String} value (required): The string to validate
 * @param {Object} rule (required): Object containing the length and cases requirement.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @param {Boolean} [rule.matchCase]: true for case-sensitive validation, false for case-insensitive validation.
 * @returns {Boolean}
 */
function asciiTextValidator(value, rule) {
  if(!value) {
    return false;
  }

  const regexStr = "[A-Z0-9`~!@#$%^&*()-+=\\[\\]{}\\\\;:'\"|<>?\\,\\.?\\/\\s_-]"; // \\\\ = support for backward slash
  const regex = createAlphanumericRegexObject(regexStr, rule);

  return regex.test(value);
}


// Credits: https://github.com/manishsaraan/email-validator/blob/master/index.js
//
// Thanks to:
// http://fightingforalostcause.net/misc/2006/compare-email-regex.php
// http://thedailywtf.com/Articles/Validating_Email_Addresses.aspx
// http://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses/201378#201378
// https://en.wikipedia.org/wiki/Email_address  The format of an email address is local-part@domain, where the 
// local part may be up to 64 octets long and the domain may have a maximum of 255 octets.[4]
//
/**
 * Validate that a string is an email.
 * @param {String} value (required): The value to validate
 * @returns {Boolean}
 */
function emailValidator(value) {
  const regex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  
  if(!value) {
    return false;
  }

  const emailParts = value.split("@");

  if(emailParts.length !== 2) {
    return false;
  }

  const [account, address] = emailParts;

  if(account.length > 64 || address.length > 255) {
    return false;
  }

  const domainParts = address.split(".");
  
  if(domainParts.some(part => part.length > 63)) {
    return false;
  }

  return regex.test(value);
}

/**
 * Validate that a string conforms to the passed length requirements.
 * @param {String} value (required): The value to validate
 * @param {Object} rule (required): Object containing the length rule to apply.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @returns {Boolean}
 */
function lengthValidator(value, rule) {
  const regex = new RegExp(getLengthRegex(rule.length));
  const passed = regex.test(value); 

  return passed;
}

/**
 * Validate that a value contains only numbers. 
 * @param {Number|String} value (required): The string to validate
 * @param {Object} rule (required): Object containing the length requirement.
 * @param {Number|Object} [rule.length] (required): The length requirements.
 * @param {Number} [rule.length.min] (optional): minimum length requirement.
 * @param {Number} [rule.length.max] (optional): maximum length requirement.
 * @returns {Boolean}
 */
function numberValidator(value, rule) {
  if(value === "" || value === null || value === "undefined") {
    return false;
  }

  const regexStr = rule.allowWhitespace ? "[0-9\\s]" : "[0-9]";
  const regex = createAlphanumericRegexObject(regexStr, rule);

  return regex.test(value);
}

/**
 * Validate a value according to provided custom regular expression.
 * @param {Mixed} value (required): The value to validate
 * @param {Object} rule (required): 
 * @param {Object|String} [rule.regex]: A regex string or a regex object.
 * @returns {Boolean}
 */
function regexValidator(value, rule) {
  const { regex: regexStr } = rule;
  const regex = is.object(regexStr) ? regexStr : new RegExp(regexStr);

  return regex.test(value);
}

/**
 * Validate that a value is not empty, that is, not undefined. 
 * @param {String} value (required): The value to validate
 * @param {Object} rule (required): Object containing the requirements to pass the validation.
 * @param {String} [rule.fieldType] (required): The type of the field (checkbox, text, select|dropdown).
 * @param {Boolean} [rule.checked] (optional): if the field is a checkbox, .
 * @returns {Boolean}
 */
function requiredFieldValidator(value, rule, _, extras) {
  if(value === "" || value === "undefined") {
    return false;
  }

  let passed;

  switch(rule.fieldType) {
  case "checkbox" : passed = extras.checked && value === "on"; break;
  case "text"     :
  case "select"   : 
  case "dropdown" : passed = value.length > 0; break;
  }

  return passed;
}


// Helpers 
function createAlphanumericRegexObject(regexStr, rule) {
  let lenRegex;

  if(rule.length) {
    lenRegex = getLengthRegex(rule.length);
  } else {
    lenRegex = "+";
  }

  regexStr = `${regexStr}${lenRegex}`;
  regexStr = `^${regexStr}$`;

  return new RegExp(regexStr, getRegexRules(rule.matchCase));
}

function getLengthRegex(lengthRule) {
  let regexStr;
  const len = object.clone(lengthRule);

  if(len.min && len.max) {
    if(Number(len.min) > Number(len.max)) {
      const tmp = len.min;

      len.min = len.max;
      len.max = tmp;
    }

    regexStr = `{${len.min},${len.max}}`;
  } else if(len.min) {
    regexStr = `{${len.min},}`;
  } else if(len.max) {
    regexStr = `{0,${len.max}}`;
  } else if(typeof Number(len) === "number") {
    regexStr = `{0,${len}}`;
  }

  return regexStr;
}

function getRegexRules(matchCase) {
  if(matchCase) {
    return regexRules.join("");
  } else {
    return [...regexRules, "i"].join("");
  }
}