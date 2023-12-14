const validators = require("../validators");
const { is } = require("../helpers");

const defaultValidators = {};

for(const [key, validator] of Object.entries(validators)) {
  defaultValidators[key] = validator;
}

/**
 * @param {String} type (optional): "addon"|"default".
 * @returns {Object} with members: `default` and/or `addon`.
 */
module.exports = function getValidator(type) {
  type = is.string(type) ? type.trim().toLowerCase() : "";

  const addonValidators = this.validators || null;

  if(["addon", "default"].includes(type)) {
    switch(type) {
    case "default": return defaultValidators;
    case "addon"  : return addonValidators;
    }
  } else {
    return {
      default: defaultValidators,
      addon: addonValidators,
    };
  }
};
